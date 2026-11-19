/**
 * World 4: Hospital Administration
 * Base schema definition
 */

export const HOSPITAL_BASE_SCHEMA = `
-- World 4: Hospital Administration Baseline Schema

CREATE TABLE IF NOT EXISTS departments (
  department_id INTEGER PRIMARY KEY AUTOINCREMENT,
  department_name TEXT NOT NULL,
  floor_number INTEGER NOT NULL,
  head_physician TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS doctors (
  doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  department_id INTEGER NOT NULL,
  is_on_call INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE IF NOT EXISTS wards (
  ward_id INTEGER PRIMARY KEY AUTOINCREMENT,
  ward_name TEXT NOT NULL,
  ward_type TEXT NOT NULL,
  total_beds INTEGER NOT NULL,
  occupied_beds INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admissions (
  admission_id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  doctor_id INTEGER NOT NULL,
  ward_id INTEGER NOT NULL,
  admission_date TEXT NOT NULL,
  discharge_date TEXT,
  status TEXT NOT NULL DEFAULT 'Admitted',
  FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id),
  FOREIGN KEY (ward_id) REFERENCES wards(ward_id)
);
`;
