"""
PDF Document Engine — Fee Receipts, Invoices, Report Cards.
Uses ReportLab for pixel-perfect A4 generation.
Logo injected from /app/assets/logo-navbar.png (mounted read-only).
"""
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table,
    TableStyle, Image as RLImage, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from io import BytesIO
from datetime import datetime
import uuid
import os

LOGO_PATH   = "/app/assets/logo-navbar.png"
NAVY_COLOR  = colors.HexColor("#0d1b45")
GOLD_COLOR  = colors.HexColor("#c4922a")
LIGHT_GRAY  = colors.HexColor("#f5f5f5")
SCHOOL_NAME = "Horizon Hope Academy Schools"
SCHOOL_ADDR = "Shamata, Nyandarua County, Kenya"
SCHOOL_PO   = "P.O. Box 20304-4, Kaheho"
SCHOOL_TEL  = "+254 722 777 384"
SCHOOL_EMAIL = "horizonhopeacademy.sc@gmail.com"


def _header_table(logo_path: str) -> Table:
    """School letterhead: logo left, school info right."""
    styles = getSampleStyleSheet()
    name_style  = ParagraphStyle("name",  fontSize=14, textColor=NAVY_COLOR, fontName="Helvetica-Bold",   alignment=TA_RIGHT)
    sub_style   = ParagraphStyle("sub",   fontSize=8,  textColor=GOLD_COLOR, fontName="Helvetica-Bold",   alignment=TA_RIGHT, spaceBefore=2)
    detail_style = ParagraphStyle("detail", fontSize=8, textColor=colors.HexColor("#555555"), alignment=TA_RIGHT, spaceBefore=1)

    logo_cell = RLImage(logo_path, width=2.8*cm, height=2.8*cm) if os.path.exists(logo_path) else Paragraph("HHA", name_style)

    info_cell = [
        Paragraph(SCHOOL_NAME, name_style),
        Paragraph("COMMITTED SERVICE TO EXCELLENCE", sub_style),
        Paragraph(SCHOOL_ADDR, detail_style),
        Paragraph(f"{SCHOOL_PO} | {SCHOOL_TEL}", detail_style),
        Paragraph(SCHOOL_EMAIL, detail_style),
    ]

    t = Table([[logo_cell, info_cell]], colWidths=[3.5*cm, 13.5*cm])
    t.setStyle(TableStyle([
        ("VALIGN",      (0, 0), (-1, -1), "MIDDLE"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return t


def generate_fee_receipt(
    student_name: str,
    admission_number: str,
    grade: str,
    guardian_name: str,
    trans_id: str,
    msisdn: str,
    amount_paid: float,
    term_fee: float,
    balance_due: float,
    trans_time: datetime,
) -> bytes:
    """Generate an A4 M-Pesa fee receipt PDF. Returns raw bytes."""
    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
        rightMargin=2*cm, leftMargin=2*cm,
        topMargin=1.5*cm, bottomMargin=1.5*cm)

    serial = f"HHA-RCPT-{uuid.uuid4().hex[:8].upper()}"
    styles = getSampleStyleSheet()

    title_style   = ParagraphStyle("title", fontSize=13, textColor=NAVY_COLOR,
                                   fontName="Helvetica-Bold", alignment=TA_CENTER, spaceBefore=12)
    label_style   = ParagraphStyle("label", fontSize=8, textColor=colors.HexColor("#888"))
    value_style   = ParagraphStyle("value", fontSize=9, textColor=NAVY_COLOR, fontName="Helvetica-Bold")
    footer_style  = ParagraphStyle("footer", fontSize=7, textColor=colors.gray, alignment=TA_CENTER)

    elements = [
        _header_table(LOGO_PATH),
        HRFlowable(width="100%", thickness=2, color=GOLD_COLOR, spaceAfter=4),
        HRFlowable(width="100%", thickness=0.5, color=NAVY_COLOR, spaceAfter=8),
        Paragraph("OFFICIAL FEE RECEIPT", title_style),
        Spacer(1, 0.3*cm),
    ]

    # Receipt meta table
    meta_data = [
        ["Serial No:", serial,            "Date:", trans_time.strftime("%d %b %Y %H:%M")],
        ["M-Pesa TransID:", trans_id,     "Phone:", msisdn],
    ]
    meta_table = Table(meta_data, colWidths=[3.5*cm, 6*cm, 2.5*cm, 5*cm])
    meta_table.setStyle(TableStyle([
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#888")),
        ("TEXTCOLOR", (2, 0), (2, -1), colors.HexColor("#888")),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica-Bold"),
        ("FONTNAME", (3, 0), (3, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    elements.append(meta_table)
    elements.append(Spacer(1, 0.4*cm))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY))
    elements.append(Spacer(1, 0.4*cm))

    # Student details
    student_data = [
        ["Student Name:", student_name],
        ["Admission No:", admission_number],
        ["Grade:",        grade],
        ["Guardian:",     guardian_name],
    ]
    st = Table(student_data, colWidths=[4*cm, 13*cm])
    st.setStyle(TableStyle([
        ("FONTSIZE",   (0, 0), (-1, -1), 9),
        ("TEXTCOLOR",  (0, 0), (0, -1), colors.HexColor("#888")),
        ("FONTNAME",   (1, 0), (1, -1), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, LIGHT_GRAY]),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING",    (0, 0), (-1, -1), 5),
        ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    ]))
    elements.append(st)
    elements.append(Spacer(1, 0.5*cm))

    # Financial breakdown
    fin_data = [
        ["DESCRIPTION",                     "AMOUNT (KES)"],
        ["Term Fee",                         f"{term_fee:,.2f}"],
        ["Payment Received (M-Pesa)",        f"{amount_paid:,.2f}"],
        ["BALANCE DUE",                      f"{balance_due:,.2f}"],
    ]
    fin_table = Table(fin_data, colWidths=[13*cm, 4*cm])
    fin_table.setStyle(TableStyle([
        ("BACKGROUND",   (0, 0), (-1, 0),  NAVY_COLOR),
        ("TEXTCOLOR",    (0, 0), (-1, 0),  colors.white),
        ("FONTNAME",     (0, 0), (-1, 0),  "Helvetica-Bold"),
        ("FONTSIZE",     (0, 0), (-1, -1), 9),
        ("ALIGN",        (1, 0), (1, -1),  "RIGHT"),
        ("ROWBACKGROUNDS",(0, 1),(-1, -2), [colors.white, LIGHT_GRAY]),
        ("BACKGROUND",   (0, -1),(-1, -1), colors.HexColor("#fdf3e3")),
        ("TEXTCOLOR",    (0, -1),(-1, -1), GOLD_COLOR),
        ("FONTNAME",     (0, -1),(-1, -1), "Helvetica-Bold"),
        ("BOTTOMPADDING",(0, 0), (-1, -1), 7),
        ("TOPPADDING",   (0, 0), (-1, -1), 7),
        ("LEFTPADDING",  (0, 0), (-1, -1), 10),
        ("GRID",         (0, 0), (-1, -1), 0.5, colors.HexColor("#dddddd")),
    ]))
    elements.append(fin_table)
    elements.append(Spacer(1, 1*cm))

    elements.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(
        f"This is an official computer-generated receipt for {SCHOOL_NAME}. "
        f"Retain for your records. Serial: {serial}",
        footer_style
    ))
    elements.append(Paragraph(
        "Kenya Data Protection Act 2019 — This document contains personal data handled lawfully.",
        footer_style
    ))

    doc.build(elements)
    return buf.getvalue()
