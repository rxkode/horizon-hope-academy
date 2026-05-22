"""
Email Notification Service — Gmail SMTP.
Sends notifications to school admin when:
  - New admission enquiry is submitted
  - New contact message is received
  - M-Pesa payment is confirmed

Uses Gmail App Password (not the main Gmail password).
Configure in .env: GMAIL_ADDRESS and GMAIL_APP_PASSWORD
"""
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from app.core.config import get_settings

logger = logging.getLogger(__name__)


def _send_email(subject: str, html_body: str, to_email: str | None = None) -> bool:
    """
    Send an email via Gmail SMTP.
    Returns True on success, False on failure (never raises — payment
    and form submission must succeed even if email fails).
    """
    settings = get_settings()

    if not settings.gmail_address or not settings.gmail_app_password:
        logger.warning("email_service: Gmail not configured — skipping email send")
        return False

    recipient = to_email or settings.gmail_address

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"]    = f"Horizon Hope Academy <{settings.gmail_address}>"
        msg["To"]      = recipient
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(settings.gmail_address, settings.gmail_app_password)
            server.sendmail(settings.gmail_address, recipient, msg.as_string())

        logger.info("email_service: sent '%s' to %s", subject, recipient)
        return True

    except Exception as exc:
        logger.error("email_service: failed to send email: %s", exc)
        return False


def notify_admission_enquiry(
    guardian_name: str,
    guardian_phone: str,
    guardian_email: str,
    child_name: str,
    grade_applying: str,
    child_dob: str,
    message: str = "",
) -> bool:
    """Send admission enquiry notification to school admin."""
    subject = f"New Admission Enquiry — {child_name} ({grade_applying})"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1b45; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #d4a84a; margin: 0;">New Admission Enquiry</h2>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0;">Horizon Hope Academy Schools</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
        <h3 style="color: #0d1b45; border-bottom: 2px solid #c4922a; padding-bottom: 8px;">Child Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666; width: 40%;">Name:</td><td style="padding: 6px 0; font-weight: bold;">{child_name}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Grade Applying:</td><td style="padding: 6px 0; font-weight: bold;">{grade_applying}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Date of Birth:</td><td style="padding: 6px 0;">{child_dob or "Not provided"}</td></tr>
        </table>
        <h3 style="color: #0d1b45; border-bottom: 2px solid #c4922a; padding-bottom: 8px; margin-top: 20px;">Parent / Guardian</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666; width: 40%;">Name:</td><td style="padding: 6px 0; font-weight: bold;">{guardian_name}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Phone:</td><td style="padding: 6px 0;"><a href="tel:{guardian_phone}">{guardian_phone}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Email:</td><td style="padding: 6px 0;">{guardian_email or "Not provided"}</td></tr>
        </table>
        {f'<h3 style="color: #0d1b45; border-bottom: 2px solid #c4922a; padding-bottom: 8px; margin-top: 20px;">Message</h3><p style="color: #444;">{message}</p>' if message else ""}
        <div style="background: #0d1b45; padding: 16px; border-radius: 6px; margin-top: 24px;">
          <p style="color: rgba(255,255,255,0.7); margin: 0; font-size: 13px;">
            Received: {datetime.now().strftime("%d %b %Y at %H:%M")} |
            Reply via WhatsApp: <a href="https://wa.me/{guardian_phone.replace("+","").replace(" ","")}" style="color: #d4a84a;">Click here</a>
          </p>
        </div>
      </div>
    </div>
    """
    return _send_email(subject, html)


def notify_contact_message(
    name: str,
    phone: str,
    email: str,
    subject: str,
    message: str,
) -> bool:
    """Send contact form notification to school admin."""
    email_subject = f"New Message: {subject} — from {name}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1b45; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #d4a84a; margin: 0;">New Contact Message</h2>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0;">Horizon Hope Academy Schools</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666; width: 30%;">From:</td><td style="padding: 6px 0; font-weight: bold;">{name}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Phone:</td><td style="padding: 6px 0;"><a href="tel:{phone}">{phone}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Email:</td><td style="padding: 6px 0;">{email or "Not provided"}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Subject:</td><td style="padding: 6px 0; font-weight: bold;">{subject}</td></tr>
        </table>
        <div style="background: white; border-left: 3px solid #c4922a; padding: 16px; margin-top: 16px; border-radius: 0 6px 6px 0;">
          <p style="color: #444; margin: 0; line-height: 1.6;">{message}</p>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 16px;">
          Received: {datetime.now().strftime("%d %b %Y at %H:%M")}
        </p>
      </div>
    </div>
    """
    return _send_email(email_subject, html)


def notify_payment_received(
    student_name: str,
    admission_number: str,
    amount: float,
    trans_id: str,
    msisdn: str,
    trans_time: datetime,
) -> bool:
    """Send payment confirmation notification to school admin."""
    subject = f"Payment Received — {student_name} KES {amount:,.0f}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0d1b45; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #d4a84a; margin: 0;">✅ Payment Received</h2>
        <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0;">M-Pesa via Tower Sacco Paybill 506900</p>
      </div>
      <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px;">
        <div style="background: #e8f5e9; border: 1px solid #a5d6a7; padding: 16px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
          <p style="font-size: 32px; font-weight: bold; color: #2e7d32; margin: 0;">KES {amount:,.2f}</p>
          <p style="color: #388e3c; margin: 4px 0 0;">Payment Confirmed</p>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #666; width: 40%;">Student:</td><td style="padding: 6px 0; font-weight: bold;">{student_name}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Admission No:</td><td style="padding: 6px 0;">{admission_number}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">M-Pesa TransID:</td><td style="padding: 6px 0; font-family: monospace;">{trans_id}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Phone:</td><td style="padding: 6px 0;">{msisdn}</td></tr>
          <tr><td style="padding: 6px 0; color: #666;">Date & Time:</td><td style="padding: 6px 0;">{trans_time.strftime("%d %b %Y %H:%M")}</td></tr>
        </table>
      </div>
    </div>
    """
    return _send_email(subject, html)
