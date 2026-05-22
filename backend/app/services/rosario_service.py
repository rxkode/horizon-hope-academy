"""
RosarioSIS Integration Service.

When a parent submits an admission enquiry on the website:
  1. Our API saves it to admission_inquiries (main DB)
  2. This service creates a PENDING student record in RosarioSIS (SIS DB)
  3. Admin logs into RosarioSIS, reviews, and activates the account

RosarioSIS DB connection is separate from the main API DB.
Uses synchronous psycopg2 (runs in thread executor from async endpoints).

School constants (from RosarioSIS):
  school_id = 1
  syear     = 2025
"""
import logging
import os
from datetime import date
from typing import Optional

logger = logging.getLogger(__name__)

# RosarioSIS DB connection string — uses the SIS postgres container
SIS_DSN = os.environ.get(
    "SIS_DATABASE_URL",
    "postgresql://rosario:rosario_dev_password@localhost:5434/rosariosis_db"
)

SCHOOL_ID = 1
SYEAR     = 2025


def _get_sis_conn():
    """Get a synchronous psycopg2 connection to RosarioSIS DB."""
    import psycopg2
    return psycopg2.connect(SIS_DSN)


def _parse_name(full_name: str) -> tuple[str, str, str]:
    """Split 'First Middle Last' into (first, middle, last)."""
    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0], "", parts[0]
    elif len(parts) == 2:
        return parts[0], "", parts[1]
    else:
        return parts[0], " ".join(parts[1:-1]), parts[-1]


def _grade_label_to_id(grade: str) -> Optional[int]:
    """
    Map CBC grade labels to RosarioSIS grade_id integers.
    RosarioSIS uses numeric grade IDs. These are standard defaults.
    """
    mapping = {
        "PP1": -1, "PP2": 0,
        "Grade 1": 1, "Grade 2": 2, "Grade 3": 3,
        "Grade 4": 4, "Grade 5": 5, "Grade 6": 6,
        "Grade 7": 7, "Grade 8": 8, "Grade 9": 9,
    }
    return mapping.get(grade)


def create_sis_pre_application(
    child_name: str,
    child_dob: Optional[str],
    grade_applying: str,
    guardian_name: str,
    guardian_phone: str,
    guardian_email: str,
    message: str = "",
) -> dict:
    """
    Create a pre-application student record in RosarioSIS.

    Returns:
        dict with student_id, person_id, and status
    """
    try:
        import psycopg2

        first, middle, last = _parse_name(child_name)
        g_first, g_middle, g_last = _parse_name(guardian_name)
        grade_id = _grade_label_to_id(grade_applying)

        # Parse DOB
        dob_date = None
        if child_dob:
            try:
                dob_date = date.fromisoformat(child_dob)
            except ValueError:
                pass

        conn = _get_sis_conn()
        cur = conn.cursor()

        try:
            # 1. Insert student record (pending — no username/password yet)
            cur.execute("""
                INSERT INTO students (first_name, middle_name, last_name, created_at)
                VALUES (%s, %s, %s, NOW())
                RETURNING student_id
            """, (first, middle, last))
            student_id = cur.fetchone()[0]

            # 2. Insert enrollment record (pending start date)
            cur.execute("""
                INSERT INTO student_enrollment
                  (syear, school_id, student_id, grade_id, start_date, enrollment_code)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                SYEAR, SCHOOL_ID, student_id, grade_id,
                date.today(),
                1,  # enrollment_code 1 = New Student
            ))

            # 3. Insert parent/guardian as a person
            cur.execute("""
                INSERT INTO people (first_name, middle_name, last_name, created_at)
                VALUES (%s, %s, %s, NOW())
                RETURNING person_id
            """, (g_first, g_middle, g_last))
            person_id = cur.fetchone()[0]

            # 4. Link student to parent/guardian
            cur.execute("""
                INSERT INTO students_join_people
                  (student_id, person_id, student_relation, custody, emergency)
                VALUES (%s, %s, %s, %s, %s)
            """, (student_id, person_id, "Parent/Guardian", "Y", "Y"))

            # 5. Store guardian phone in address table
            try:
                cur.execute("""
                    INSERT INTO address (phone, address, city, state, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    RETURNING address_id
                """, (guardian_phone, guardian_email, "Shamata", "Nyandarua"))
                address_id = cur.fetchone()[0]

                # Link address to person
                cur.execute("""
                    UPDATE students_join_people
                    SET address_id = %s
                    WHERE student_id = %s AND person_id = %s
                """, (address_id, student_id, person_id))
            except Exception as addr_err:
                logger.warning("rosario_service: address insert skipped: %s", addr_err)

            conn.commit()
            logger.info(
                "rosario_service: pre-application created student_id=%s person_id=%s for %s",
                student_id, person_id, child_name
            )
            return {
                "status": "created",
                "student_id": student_id,
                "person_id": person_id,
                "grade_id": grade_id,
            }

        except Exception as e:
            conn.rollback()
            logger.error("rosario_service: DB error: %s", e)
            return {"status": "error", "error": str(e)}
        finally:
            cur.close()
            conn.close()

    except ImportError:
        logger.warning("rosario_service: psycopg2 not installed — skipping SIS insert")
        return {"status": "skipped", "reason": "psycopg2 not available"}
    except Exception as e:
        logger.error("rosario_service: unexpected error: %s", e)
        return {"status": "error", "error": str(e)}


def get_sis_pending_applications() -> list[dict]:
    """
    Fetch students enrolled today with no username (pending activation).
    Used by admin to see new applications in the portal.
    """
    try:
        conn = _get_sis_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT s.student_id, s.first_name, s.middle_name, s.last_name,
                   se.grade_id, se.start_date
            FROM students s
            JOIN student_enrollment se ON se.student_id = s.student_id
            WHERE s.username IS NULL
              AND se.school_id = %s
              AND se.syear = %s
            ORDER BY se.start_date DESC
            LIMIT 50
        """, (SCHOOL_ID, SYEAR))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [
            {
                "student_id": r[0],
                "first_name": r[1],
                "middle_name": r[2],
                "last_name": r[3],
                "grade_id": r[4],
                "applied_date": str(r[5]),
            }
            for r in rows
        ]
    except Exception as e:
        logger.error("rosario_service: get_pending error: %s", e)
        return []
