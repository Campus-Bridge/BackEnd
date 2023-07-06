const getLecturersQuery = "SELECT l.*, u.email FROM lecturers l JOIN user_lecturer ul ON l.id = ul.lecturer_id JOIN users u ON u.id = ul.user_id;";
const getLecturerByIdQuery = "SELECT l.*, u.email FROM lecturers l JOIN user_lecturer ul ON l.id = ul.lecturer_id JOIN users u ON u.id = ul.user_id WHERE ul.user_id = $1;";
const updateLecturerQuery = `UPDATE "lecturers"
SET
    "first_name" = $1,
    "last_name" = $2,
    "date_of_birth" = $3,
    "phone" = $4,
    "home_address" = $5,
    "billing_address" = $6,
    "academic_title" = $7,
    "subjects_taught" = $8,
    "type_of_contract" = $9,
    "bank_account_number" = $10,
    "tax_identification_number" = $11,
    "employee_identification_number" = $12,
    "series_and_number_of_identity_card" = $13,
    "id_card_issuing_authority" = $14,
    "passport_number" = $15,
    "nationality" = $16,
    "citizenship" = $17,
    "contract_duration" = $18,
    "gender" = $19
WHERE "id" = $20;`;
const deleteLecturerQuery = "DELETE FROM lecturers WHERE id = $1;";

const createLecturerQuery = `INSERT INTO "lecturers" (
  "first_name",
  "last_name",
  "date_of_birth",
  "phone",
  "home_address",
  "billing_address",
  "academic_title",
  "subjects_taught",
  "type_of_contract",
  "bank_account_number",
  "tax_identification_number",
  "employee_identification_number",
  "series_and_number_of_identity_card",
  "id_card_issuing_authority",
  "passport_number",
  "nationality",
  "citizenship",
  "contract_duration",
  "gender"
)
VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12,
  $13,
  $14,
  $15,
  $16,
  $17,
  $18,
  $19
)
RETURNING "id";`;

export { getLecturersQuery, getLecturerByIdQuery, updateLecturerQuery, deleteLecturerQuery, createLecturerQuery };
