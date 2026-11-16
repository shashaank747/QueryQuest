/**
 * World 4: Hospital Administration
 * Seed dataset
 */

export const HOSPITAL_INITIAL_DATASET = `
-- Departments Seed Data
INSERT INTO departments (department_id, department_name, floor_number, head_physician) VALUES
  (1, 'Emergency & Trauma Care', 1, 'Dr. Aris Thorne'),
  (2, 'Cardiovascular Sciences', 2, 'Dr. Elena Vasquez'),
  (3, 'Neurology & Stroke Unit', 3, 'Dr. Rajiv Menon'),
  (4, 'Pediatrics & Neonatal Care', 4, 'Dr. Clara Oswald');

-- Doctors Seed Data
INSERT INTO doctors (doctor_id, first_name, last_name, specialty, department_id, is_on_call) VALUES
  (1, 'Aris', 'Thorne', 'Trauma Surgery', 1, 1),
  (2, 'Elena', 'Vasquez', 'Interventional Cardiology', 2, 0),
  (3, 'Rajiv', 'Menon', 'Neurovascular Surgery', 3, 1),
  (4, 'Clara', 'Oswald', 'Neonatal Medicine', 4, 0),
  (5, 'Marcus', 'Brody', 'Cardiothoracic Surgery', 2, 1),
  (6, 'Amina', 'Siddiqui', 'Emergency Medicine', 1, 1);

-- Patients Seed Data
INSERT INTO patients (patient_id, first_name, last_name, dob, blood_group, emergency_contact) VALUES
  (1, 'Siddharth', 'Varma', '1982-04-12', 'O+', '+91 98111 22334'),
  (2, 'Pooja', 'Hegde', '1995-09-28', 'A+', '+91 98222 33445'),
  (3, 'Robert', 'Langdon', '1964-06-22', 'B+', '+91 98333 44556'),
  (4, 'Kavya', 'Krishnan', '2018-11-05', 'AB+', '+91 98444 55667'),
  (5, 'Deepak', 'Chopra', '1958-01-17', 'O-', '+91 98555 66778'),
  (6, 'Zoya', 'Akhtar', '1989-07-30', 'A-', '+91 98666 77889');

-- Wards Seed Data
INSERT INTO wards (ward_id, ward_name, ward_type, total_beds, occupied_beds) VALUES
  (1, 'Intensive Care Unit (ICU)', 'Critical Care', 12, 12),
  (2, 'Cardiac Care Unit (CCU)', 'Critical Care', 10, 8),
  (3, 'Pediatric Ward', 'Specialized Care', 20, 14),
  (4, 'General Surgical Ward', 'General Inpatient', 30, 26),
  (5, 'Post-Op Recovery Wing', 'Step-Down Care', 16, 16);

-- Admissions Seed Data
INSERT INTO admissions (admission_id, patient_id, doctor_id, ward_id, admission_date, discharge_date, status) VALUES
  (101, 1, 1, 1, '2026-11-12', NULL, 'Admitted'),
  (102, 2, 5, 2, '2026-11-13', NULL, 'Admitted'),
  (103, 3, 1, 1, '2026-11-14', NULL, 'Admitted'),
  (104, 4, 4, 3, '2026-11-10', NULL, 'Admitted'),
  (105, 5, 2, 2, '2026-11-11', '2026-11-15', 'Discharged'),
  (106, 6, 3, 4, '2026-11-15', NULL, 'Admitted');
`;
