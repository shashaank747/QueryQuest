import { Mission } from '../../../types/mission';

export const AIRPORT_MISSIONS: Mission[] = [
  {
    id: 'ap_m1',
    order: 1,
    title: 'Deploy Runway Inspection Safety Log',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Welcome to SkyHarbor International Airport! Aviation safety protocols mandate automated relational logging for tarmac inspections. Lead Air Traffic Controller Maya asks you to establish the runway safety registry.',
    businessProblem:
      'Inspectors currently log runway tarmac condition checks on clipboards, resulting in blind spots during adverse weather and regulatory audit delays.',
    objective:
      'Create a table named "runway_inspections" with inspection_id (INTEGER PRIMARY KEY AUTOINCREMENT), runway_name (TEXT NOT NULL), inspector_name (TEXT NOT NULL), surface_condition (TEXT NOT NULL), and friction_index (REAL).',
    requiredOutcome:
      'A new runway_inspections table ready to store asphalt friction data and runway clearance logs.',
    checklist: [
      'Use CREATE TABLE runway_inspections',
      'Define inspection_id INTEGER PRIMARY KEY AUTOINCREMENT',
      'Include runway_name TEXT NOT NULL',
      'Include inspector_name TEXT NOT NULL',
      'Include surface_condition TEXT NOT NULL',
      'Include friction_index REAL',
    ],
    sqlTopics: ['CREATE TABLE', 'PRIMARY KEY', 'Column Constraints', 'REAL type'],
    hints: [
      'Use CREATE TABLE runway_inspections (...) with appropriate columns.',
      'Define inspection_id as INTEGER PRIMARY KEY AUTOINCREMENT.',
      'CREATE TABLE runway_inspections (\n  inspection_id INTEGER PRIMARY KEY AUTOINCREMENT,\n  runway_name TEXT NOT NULL,\n  inspector_name TEXT NOT NULL,\n  surface_condition TEXT NOT NULL,\n  friction_index REAL\n);',
    ],
    sampleSolution: `CREATE TABLE runway_inspections (
  inspection_id INTEGER PRIMARY KEY AUTOINCREMENT,
  runway_name TEXT NOT NULL,
  inspector_name TEXT NOT NULL,
  surface_condition TEXT NOT NULL,
  friction_index REAL
);`,
    solutionExplanation:
      'Relational schemas enforce operational data integrity at the database layer. Creating the runway inspection registry provides a permanent audit trail for international civil aviation authorities.',
    initialSqlPlaceholder: `-- Mission 1: Create runway safety inspections table\nCREATE TABLE runway_inspections (\n  \n);`,
    validationRules: [
      {
        type: 'TABLE_EXISTS',
        description: 'Verify runway_inspections table exists with required columns',
        expectedTable: 'runway_inspections',
        expectedColumns: [
          'inspection_id',
          'runway_name',
          'inspector_name',
          'surface_condition',
          'friction_index',
        ],
      },
    ],
    xpReward: 100,
    badge: {
      id: 'table_architect',
      title: 'Table Architect',
      icon: 'Database',
    },
  },
  {
    id: 'ap_m2',
    order: 2,
    title: 'Register Trans-Atlantic Partner Airline',
    role: 'Flight Data Operations Analyst',
    storyline:
      'SkyHarbor has signed an international terminal agreement with Celtic Express. Operations Director Vikram requests their registration into the central carrier directory.',
    businessProblem:
      'Without an active entry in the airlines registry, SkyHarbor radar systems cannot assign flight numbers or reconcile passenger manifest feeds for this carrier.',
    objective:
      'Insert a new row into "airlines" with: airline_id = 6, airline_name = "Celtic Express", iata_code = "CE", country = "Ireland", and fleet_size = 52.',
    requiredOutcome:
      'New carrier record registered in the airlines table with IATA code CE.',
    checklist: [
      'Use INSERT INTO airlines (...)',
      'Specify airline_id, airline_name, iata_code, country, fleet_size',
      'Provide matching values with strings enclosed in single quotes',
    ],
    sqlTopics: ['INSERT INTO', 'VALUES', 'Catalog Registration'],
    hints: [
      'Use INSERT INTO airlines (airline_id, airline_name, iata_code, country, fleet_size) VALUES (...);',
      'Make sure string values like \'Celtic Express\' are wrapped in single quotes.',
      "INSERT INTO airlines (airline_id, airline_name, iata_code, country, fleet_size) VALUES (6, 'Celtic Express', 'CE', 'Ireland', 52);",
    ],
    sampleSolution: `INSERT INTO airlines (airline_id, airline_name, iata_code, country, fleet_size)
VALUES (6, 'Celtic Express', 'CE', 'Ireland', 52);`,
    solutionExplanation:
      'Inserting normalized records ensures downstream flight manifests can reliably establish foreign key relationships to carrier profiles.',
    initialSqlPlaceholder: `-- Mission 2: Register Celtic Express into airlines\nINSERT INTO airlines (\n  airline_id, airline_name, iata_code, country, fleet_size\n) VALUES (\n  \n);`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify Celtic Express is registered in airlines',
        expectedTable: 'airlines',
        expectedWhereClause: "iata_code = 'CE' AND airline_name = 'Celtic Express'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 120,
    badge: {
      id: 'flight_tracker',
      title: 'Flight Radar Specialist',
      icon: 'Plane',
    },
  },
  {
    id: 'ap_m3',
    order: 3,
    title: 'Audit Delayed Flight Operations',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Ground control reports weather disruptions causing departure holds. The Duty Manager needs an immediate manifest of all flights flagged as Delayed.',
    businessProblem:
      'Passenger assistance kiosks and catering ground crews require an immediate list of delayed flights to redistribute gate personnel and dispatch passenger refreshments.',
    objective:
      'Select flight_number, destination, scheduled_departure, and passenger_count from "flights" where status = "Delayed".',
    requiredOutcome:
      'A targeted table of delayed flights with their destination, scheduled time, and passenger count.',
    checklist: [
      'SELECT flight_number, destination, scheduled_departure, passenger_count',
      'FROM flights',
      'WHERE status = \'Delayed\'',
    ],
    sqlTopics: ['SELECT', 'WHERE clause', 'Status Filtering'],
    hints: [
      'Use SELECT column1, column2 FROM flights WHERE condition;',
      'Filter with status = \'Delayed\'.',
      "SELECT flight_number, destination, scheduled_departure, passenger_count FROM flights WHERE status = 'Delayed';",
    ],
    sampleSolution: `SELECT flight_number, destination, scheduled_departure, passenger_count
FROM flights
WHERE status = 'Delayed';`,
    solutionExplanation:
      'Filtering on the operational status attribute enables air traffic operations to rapidly triage grounded aircraft and isolate impacted travelers.',
    initialSqlPlaceholder: `-- Mission 3: Query all delayed flights\nSELECT flight_number, destination, scheduled_departure, passenger_count\nFROM flights\nWHERE ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify delayed flight records',
        expectedQuery:
          "SELECT flight_number, destination, scheduled_departure, passenger_count FROM flights WHERE status = 'Delayed';",
      },
    ],
    xpReward: 130,
  },
  {
    id: 'ap_m4',
    order: 4,
    title: 'Reassign Gate & Update Boarding Status',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Flight GA-305 (New York) was held on the tarmac, but departure clearance has been granted! Air traffic control assigns available gate B3 (gate_id = 6) and clears the flight to Boarding.',
    businessProblem:
      'Tarmac gate reassignments must be committed to the central database so automated airport display screens (FIDS) immediately direct passengers to the correct concourse.',
    objective:
      'Update "flights" to set gate_id = 6 and status = "Boarding" for the flight with flight_number = "GA-305".',
    requiredOutcome:
      'Flight GA-305 updated to Boarding status at gate_id 6.',
    checklist: [
      'Use UPDATE flights',
      'SET gate_id = 6, status = \'Boarding\'',
      'WHERE flight_number = \'GA-305\'',
    ],
    sqlTopics: ['UPDATE ... SET', 'WHERE clause', 'Status Transition'],
    hints: [
      'Syntax: UPDATE flights SET column1 = val1, column2 = val2 WHERE condition;',
      'Set gate_id = 6 and status = \'Boarding\'.',
      "UPDATE flights SET gate_id = 6, status = 'Boarding' WHERE flight_number = 'GA-305';",
    ],
    sampleSolution: `UPDATE flights
SET gate_id = 6, status = 'Boarding'
WHERE flight_number = 'GA-305';`,
    solutionExplanation:
      'Direct atomic UPDATE operations keep live display boards synchronized with air traffic command decisions, avoiding passenger concourse confusion.',
    initialSqlPlaceholder: `-- Mission 4: Reassign GA-305 to gate 6 and Boarding\nUPDATE flights\nSET gate_id = ..., status = ...\nWHERE flight_number = 'GA-305';`,
    validationRules: [
      {
        type: 'ROW_EXISTS',
        description: 'Verify GA-305 is updated to gate_id 6 and Boarding status',
        expectedTable: 'flights',
        expectedWhereClause: "flight_number = 'GA-305' AND gate_id = 6 AND status = 'Boarding'",
        expectedRowCount: 1,
      },
    ],
    xpReward: 140,
  },
  {
    id: 'ap_m5',
    order: 5,
    title: 'Correlate Heavy Baggage with Flight Manifests',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Ramp Operations needs to verify aircraft weight and balance. Ground handlers ask for a list of all heavy checked baggage items (weight_kg > 25.0) linked to their corresponding flight number and destination.',
    businessProblem:
      'Overweight luggage must be positioned carefully in the cargo hold to maintain aircraft center-of-gravity within safe aeronautical limits.',
    objective:
      'Join "flights" and "baggage" on flight_id. Select flight_number, destination, passenger_name, and weight_kg for all baggage where weight_kg > 25.0. Order by weight_kg descending.',
    requiredOutcome:
      'A joined table of oversized baggage (> 25kg) with flight destination, ordered by weight descending.',
    checklist: [
      'SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg',
      'FROM flights f JOIN baggage b ON f.flight_id = b.flight_id',
      'WHERE b.weight_kg > 25.0',
      'ORDER BY b.weight_kg DESC',
    ],
    sqlTopics: ['INNER JOIN', 'ON clause', 'ORDER BY DESC', 'Weight threshold'],
    hints: [
      'Join flights (f) and baggage (b) using ON f.flight_id = b.flight_id.',
      'Filter for weight_kg > 25.0 and order by weight_kg DESC.',
      'SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg FROM flights f JOIN baggage b ON f.flight_id = b.flight_id WHERE b.weight_kg > 25.0 ORDER BY b.weight_kg DESC;',
    ],
    sampleSolution: `SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg
FROM flights f
JOIN baggage b ON f.flight_id = b.flight_id
WHERE b.weight_kg > 25.0
ORDER BY b.weight_kg DESC;`,
    solutionExplanation:
      'Relational JOINs bridge passenger baggage records with flight routes, giving ramp operations direct visibility into cargo loading distribution.',
    initialSqlPlaceholder: `-- Mission 5: Join flights and baggage for heavy luggage\nSELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg\nFROM flights f\nJOIN baggage b ON ...\nWHERE b.weight_kg > 25.0\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify joined heavy baggage manifest',
        expectedQuery:
          'SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg FROM flights f JOIN baggage b ON f.flight_id = b.flight_id WHERE b.weight_kg > 25.0 ORDER BY b.weight_kg DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 160,
    badge: {
      id: 'join_master',
      title: 'Join Master',
      icon: 'GitFork',
    },
  },
  {
    id: 'ap_m6',
    order: 6,
    title: 'Analyze Terminal Passenger Throughput',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Airport CEO Sarah is preparing a terminal expansion proposal for civil aviation authorities. She needs a consolidated summary of total scheduled flights and total passengers routed through each terminal.',
    businessProblem:
      'Concourse infrastructure investments depend on accurate passenger density metrics derived across terminals, gates, and flights.',
    objective:
      'Join "terminals", "gates", and "flights". Select terminal_name, COUNT(f.flight_id) AS total_flights, and SUM(f.passenger_count) AS total_passengers. Group by terminal_name and order by total_passengers descending.',
    requiredOutcome:
      'Aggregated terminal throughput table sorted by total passenger load descending.',
    checklist: [
      'JOIN terminals t -> gates g ON t.terminal_id = g.terminal_id',
      'JOIN flights f ON g.gate_id = f.gate_id',
      'SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers',
      'GROUP BY t.terminal_name',
      'ORDER BY total_passengers DESC',
    ],
    sqlTopics: ['Multi-table JOIN', 'GROUP BY', 'SUM / COUNT Aggregation', 'ORDER BY DESC'],
    hints: [
      'Chain the two joins: terminals t JOIN gates g ON ... JOIN flights f ON ...',
      'Compute COUNT(f.flight_id) AS total_flights and SUM(f.passenger_count) AS total_passengers.',
      'SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers FROM terminals t JOIN gates g ON t.terminal_id = g.terminal_id JOIN flights f ON g.gate_id = f.gate_id GROUP BY t.terminal_name ORDER BY total_passengers DESC;',
    ],
    sampleSolution: `SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers
FROM terminals t
JOIN gates g ON t.terminal_id = g.terminal_id
JOIN flights f ON g.gate_id = f.gate_id
GROUP BY t.terminal_name
ORDER BY total_passengers DESC;`,
    solutionExplanation:
      'Multi-table aggregations provide executive-level operational intelligence, showing how passenger volumes distribute across physical airport infrastructure.',
    initialSqlPlaceholder: `-- Mission 6: Terminal passenger throughput summary\nSELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers\nFROM terminals t\nJOIN gates g ON ...\nJOIN flights f ON ...\nGROUP BY ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify terminal throughput aggregation',
        expectedQuery:
          'SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers FROM terminals t JOIN gates g ON t.terminal_id = g.terminal_id JOIN flights f ON g.gate_id = f.gate_id GROUP BY t.terminal_name ORDER BY total_passengers DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 250,
    badge: {
      id: 'airport_master',
      title: 'Aviation Operations Certified',
      icon: 'Award',
    },
  },
];
