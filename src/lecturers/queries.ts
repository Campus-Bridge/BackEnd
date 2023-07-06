const getLecturersQuery = "SELECT l.*, u.email FROM lecturers l JOIN user_lecturer ul ON l.id = ul.lecturer_id JOIN users u ON u.id = ul.user_id;";
const getLecturerByIdQuery = "SELECT l.*, u.email FROM lecturers l JOIN user_lecturer ul ON l.id = ul.lecturer_id JOIN users u ON u.id = ul.user_id WHERE ul.user_id = $1;";
const updateLecturerQuery = `UPDATE "lecturers"
SET
    "first_name" = $1,
    "last_name" = $2,
    "date_of_birth" = $3,
    "phone" = $4,
    "email" = $5,
    "home_address" = $6,
    "billing_address" = $7,
    "academic_title" = $8,
    "subjects_taught" = $9,
    "type_of_contract" = $10,
    "bank_account_number" = $11,
    "tax_identification_number" = $12,
    "employee_identification_number" = $13,
    "series_and_number_of_identity_card" = $14,
    "id_card_issuing_authority" = $15,
    "passport_number" = $16,
    "nationality" = $17,
    "citizenship" = $18,
    "contract_duration" = $19,
    "gender" = $20
WHERE "id" = $21;`;
const deleteLecturerQuery = "DELETE FROM lecturers WHERE id = $1;";

export { getLecturersQuery, getLecturerByIdQuery, updateLecturerQuery, deleteLecturerQuery };
