/**
 * World 2: Airport Operations
 * Seed dataset
 */

export const AIRPORT_INITIAL_DATASET = `
-- Airlines Seed Data
INSERT INTO airlines (airline_id, airline_name, iata_code, country, fleet_size) VALUES
  (1, 'SkyWing Express', 'SE', 'India', 45),
  (2, 'Global Aero', 'GA', 'United States', 120),
  (3, 'Pacific Flyer', 'PF', 'Singapore', 60),
  (4, 'Nordic Jet', 'NJ', 'Norway', 35),
  (5, 'Sahara Airways', 'SA', 'UAE', 80);

-- Terminals Seed Data
INSERT INTO terminals (terminal_id, terminal_name, concourse, gate_count) VALUES
  (1, 'Terminal 1 (Domestic)', 'Concourse A', 6),
  (2, 'Terminal 2 (International)', 'Concourse B', 8),
  (3, 'Terminal 3 (Regional)', 'Concourse C', 4);

-- Gates Seed Data
INSERT INTO gates (gate_id, gate_number, terminal_id, status) VALUES
  (1, 'A1', 1, 'Occupied'),
  (2, 'A2', 1, 'Available'),
  (3, 'A3', 1, 'Available'),
  (4, 'B1', 2, 'Occupied'),
  (5, 'B2', 2, 'Occupied'),
  (6, 'B3', 2, 'Available'),
  (7, 'C1', 3, 'Available'),
  (8, 'C2', 3, 'Maintenance');

-- Flights Seed Data
INSERT INTO flights (flight_id, flight_number, airline_id, origin, destination, scheduled_departure, status, gate_id, passenger_count) VALUES
  (1, 'SE-101', 1, 'SkyHarbor', 'Mumbai', '06:30', 'Landed', 1, 168),
  (2, 'SE-204', 1, 'SkyHarbor', 'Delhi', '08:15', 'Airborne', 2, 175),
  (3, 'GA-305', 2, 'SkyHarbor', 'New York', '10:00', 'Delayed', 4, 280),
  (4, 'PF-410', 3, 'SkyHarbor', 'Singapore', '11:45', 'Boarding', 5, 210),
  (5, 'NJ-502', 4, 'SkyHarbor', 'Oslo', '13:20', 'Scheduled', 6, 145),
  (6, 'SA-612', 5, 'SkyHarbor', 'Dubai', '15:00', 'Delayed', 4, 310),
  (7, 'SE-309', 1, 'SkyHarbor', 'Bengaluru', '16:45', 'Scheduled', 1, 155),
  (8, 'GA-718', 2, 'SkyHarbor', 'London', '18:30', 'Scheduled', 5, 260),
  (9, 'PF-822', 3, 'SkyHarbor', 'Tokyo', '20:15', 'Scheduled', 6, 195),
  (10, 'SE-901', 1, 'SkyHarbor', 'Goa', '22:00', 'Scheduled', 2, 130);

-- Baggage Seed Data
INSERT INTO baggage (baggage_id, flight_id, passenger_name, weight_kg, status) VALUES
  (1, 3, 'Ananya Sharma', 23.5, 'Loaded'),
  (2, 3, 'Rajesh Patel', 18.0, 'Loaded'),
  (3, 3, 'David Miller', 31.2, 'Loaded'),
  (4, 4, 'Meera Nair', 15.5, 'Loaded'),
  (5, 4, 'Kenji Sato', 22.0, 'Loaded'),
  (6, 6, 'Omar Al-Mansoor', 28.4, 'Loaded'),
  (7, 6, 'Fatima Zahra', 19.8, 'Loaded'),
  (8, 1, 'Vikram Singhania', 14.0, 'Claimed'),
  (9, 1, 'Priya Iyer', 26.3, 'Claimed'),
  (10, 2, 'Rohan Kapoor', 21.0, 'In Transit'),
  (11, 2, 'Sunita Rao', 17.5, 'In Transit'),
  (12, 5, 'Lars Eriksen', 25.0, 'Loaded');
`;
