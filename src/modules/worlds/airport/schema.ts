/**
 * World 2: Airport Operations
 * Base schema definition
 */

export const AIRPORT_BASE_SCHEMA = `
-- World 2: Airport Operations Baseline Schema

CREATE TABLE IF NOT EXISTS airlines (
  airline_id INTEGER PRIMARY KEY AUTOINCREMENT,
  airline_name TEXT NOT NULL,
  iata_code TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  fleet_size INTEGER NOT NULL DEFAULT 10
);

CREATE TABLE IF NOT EXISTS terminals (
  terminal_id INTEGER PRIMARY KEY AUTOINCREMENT,
  terminal_name TEXT NOT NULL,
  concourse TEXT NOT NULL,
  gate_count INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS gates (
  gate_id INTEGER PRIMARY KEY AUTOINCREMENT,
  gate_number TEXT NOT NULL UNIQUE,
  terminal_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Available',
  FOREIGN KEY (terminal_id) REFERENCES terminals(terminal_id)
);

CREATE TABLE IF NOT EXISTS flights (
  flight_id INTEGER PRIMARY KEY AUTOINCREMENT,
  flight_number TEXT NOT NULL UNIQUE,
  airline_id INTEGER NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  scheduled_departure TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled',
  gate_id INTEGER,
  passenger_count INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
  FOREIGN KEY (gate_id) REFERENCES gates(gate_id)
);

CREATE TABLE IF NOT EXISTS baggage (
  baggage_id INTEGER PRIMARY KEY AUTOINCREMENT,
  flight_id INTEGER NOT NULL,
  passenger_name TEXT NOT NULL,
  weight_kg REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'Loaded',
  FOREIGN KEY (flight_id) REFERENCES flights(flight_id)
);
`;
