import { Mission } from '../../../types/mission';

export const AIRPORT_MISSIONS: Mission[] = [
  {
    id: 'ap_m1',
    order: 1,
    title: 'First Discovery: Correlate Flights with Carrier Profiles',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Welcome to SkyHarbor International Airport! Ground Control reports severe winter weather patterns triggering ground stops and departure holds across multiple flight corridors. Duty Manager Maya asks you to identify all delayed flights and match them with their operating airline names so carrier customer service counters can issue passenger meal and hotel vouchers.',
    businessProblem:
      'Flight records store carrier affiliations via numeric foreign keys (airline_id). Without joining against the central airlines directory, terminal concourse staff cannot determine which airline representatives must be summoned to address stranded passengers.',
    objective:
      'Perform an INNER JOIN between "flights" (alias f) and "airlines" (alias a) on f.airline_id = a.airline_id. Select flight_number, airline_name, destination, and status for all flights where status = "Delayed".',
    requiredOutcome:
      'A joined manifest of delayed flights displaying flight_number, airline_name, destination, and status.',
    checklist: [
      'FROM flights f',
      'JOIN airlines a ON f.airline_id = a.airline_id',
      'SELECT f.flight_number, a.airline_name, f.destination, f.status',
      'WHERE f.status = \'Delayed\'',
    ],
    sqlTopics: ['INNER JOIN', 'ON Clause', 'Table Aliasing', 'WHERE Filtering'],
    hints: [
      'Link the tables using `FROM flights f JOIN airlines a ON f.airline_id = a.airline_id`.',
      'Filter the joined results using `WHERE f.status = \'Delayed\'` and select `f.flight_number, a.airline_name, f.destination, f.status`.',
      "SELECT f.flight_number, a.airline_name, f.destination, f.status\nFROM flights f\nJOIN airlines a ON f.airline_id = a.airline_id\nWHERE f.status = 'Delayed';",
    ],
    sampleSolution: `SELECT f.flight_number, a.airline_name, f.destination, f.status
FROM flights f
JOIN airlines a ON f.airline_id = a.airline_id
WHERE f.status = 'Delayed';`,
    solutionExplanation:
      'An INNER JOIN matches records between two tables whenever their join condition evaluates to true. Joining flights with airlines on airline_id pairs each flight with its carrier brand, enabling targeted delay triage.',
    initialSqlPlaceholder: `-- Mission 1: First Relational INNER JOIN\n-- Link delayed flights to their operating airline names\nSELECT f.flight_number, a.airline_name, f.destination, f.status\nFROM flights f\nJOIN airlines a ON ...\nWHERE f.status = 'Delayed';`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify delayed flights joined with airline names',
        expectedQuery:
          "SELECT f.flight_number, a.airline_name, f.destination, f.status FROM flights f JOIN airlines a ON f.airline_id = a.airline_id WHERE f.status = 'Delayed';",
      },
    ],
    xpReward: 100,
    badge: {
      id: 'flight_tracker',
      title: 'Flight Radar Specialist',
      icon: 'Plane',
    },
  },
  {
    id: 'ap_m2',
    order: 2,
    title: 'Multi-Table Relational Chain: Terminal Gate Locator',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Connecting passengers frequently get disoriented navigating between SkyHarbor terminals and concourses. Lead Dispatcher Vikram needs an automated display manifest that maps every scheduled flight to its designated physical terminal and concourse gate.',
    businessProblem:
      'The flights table references gate_id, while terminal names and concourses reside two relational hops away in terminals via gates.terminal_id. To display complete routing instructions on concourse flight boards (FIDS), operations must link across all three normalized entities.',
    objective:
      'Chain two INNER JOINs linking "flights" (alias f) to "gates" (alias g) on f.gate_id = g.gate_id, and "gates" to "terminals" (alias t) on g.terminal_id = t.terminal_id. Select f.flight_number, t.terminal_name, g.gate_number, f.destination, and f.status.',
    requiredOutcome:
      'A comprehensive 3-table joined manifest resolving flight numbers through gates to terminal names.',
    checklist: [
      'FROM flights f',
      'JOIN gates g ON f.gate_id = g.gate_id',
      'JOIN terminals t ON g.terminal_id = t.terminal_id',
      'SELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status',
    ],
    sqlTopics: ['Multi-Table JOIN', 'Relational Chaining', 'Foreign Key Navigation'],
    hints: [
      'Chain the joins in sequence: start `FROM flights f JOIN gates g ON f.gate_id = g.gate_id` then `JOIN terminals t ON g.terminal_id = t.terminal_id`.',
      'Specify table prefixes for each column: `f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status`.',
      'SELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status\nFROM flights f\nJOIN gates g ON f.gate_id = g.gate_id\nJOIN terminals t ON g.terminal_id = t.terminal_id;',
    ],
    sampleSolution: `SELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status
FROM flights f
JOIN gates g ON f.gate_id = g.gate_id
JOIN terminals t ON g.terminal_id = t.terminal_id;`,
    solutionExplanation:
      'Relational databases normalize data across separate entity tables to avoid redundancy. Chaining multiple JOINs reconstructs full operational contexts (flights -> gates -> terminals) without data duplication.',
    initialSqlPlaceholder: `-- Mission 2: Multi-Table Relational Chain\n-- Map flights to physical gates and terminal names\nSELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status\nFROM flights f\nJOIN gates g ON ...\nJOIN terminals t ON ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify 3-table relational join linking flights, gates, and terminals',
        expectedQuery:
          'SELECT f.flight_number, t.terminal_name, g.gate_number, f.destination, f.status FROM flights f JOIN gates g ON f.gate_id = g.gate_id JOIN terminals t ON g.terminal_id = t.terminal_id;',
      },
    ],
    xpReward: 120,
    badge: {
      id: 'join_master',
      title: 'Join Master',
      icon: 'GitFork',
    },
  },
  {
    id: 'ap_m3',
    order: 3,
    title: 'Unmatched Record Detection with LEFT JOIN',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Airport Ground Control is experiencing peak afternoon arrivals. With tarmac congestion growing, Ramp Operations Chief Carlos needs to discover all idle or unoccupied gates that currently have no active flights assigned to them.',
    businessProblem:
      'An INNER JOIN only returns gates that have matching flight assignments. Unmatched or idle gates are omitted! Operations must preserve all gate records and detect non-matches using a LEFT JOIN with an IS NULL filter.',
    objective:
      'Perform a LEFT JOIN from "gates" (alias g) to "flights" (alias f) on g.gate_id = f.gate_id. Filter for gates where f.flight_id IS NULL to isolate unassigned gates. Select g.gate_id, g.gate_number, and g.status.',
    requiredOutcome:
      'A list of gates that currently have zero flights assigned, showing gate_id, gate_number, and status.',
    checklist: [
      'Use FROM gates g',
      'LEFT JOIN flights f ON g.gate_id = f.gate_id',
      'WHERE f.flight_id IS NULL',
      'SELECT g.gate_id, g.gate_number, g.status',
    ],
    sqlTopics: ['LEFT JOIN', 'Unmatched Records', 'IS NULL Filter', 'Outer Join Pattern'],
    hints: [
      'Start with `FROM gates g LEFT JOIN flights f ON g.gate_id = f.gate_id` so all gates are included even without flights.',
      'Add `WHERE f.flight_id IS NULL` to filter down to only gates that have no matching flight row.',
      'SELECT g.gate_id, g.gate_number, g.status\nFROM gates g\nLEFT JOIN flights f ON g.gate_id = f.gate_id\nWHERE f.flight_id IS NULL;',
    ],
    sampleSolution: `SELECT g.gate_id, g.gate_number, g.status
FROM gates g
LEFT JOIN flights f ON g.gate_id = f.gate_id
WHERE f.flight_id IS NULL;`,
    solutionExplanation:
      'A LEFT OUTER JOIN retains all records from the left table (gates), populating right-table columns with NULL when no match exists. Filtering on `WHERE f.flight_id IS NULL` is the canonical SQL anti-join pattern for detecting unused resources.',
    initialSqlPlaceholder: `-- Mission 3: Unmatched Record Detection with LEFT JOIN\n-- Find gates that have no active flights assigned\nSELECT g.gate_id, g.gate_number, g.status\nFROM gates g\nLEFT JOIN flights f ON ...\nWHERE f.flight_id IS NULL;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify unassigned gates detected via LEFT JOIN with IS NULL filter',
        expectedQuery:
          'SELECT g.gate_id, g.gate_number, g.status FROM gates g LEFT JOIN flights f ON g.gate_id = f.gate_id WHERE f.flight_id IS NULL;',
      },
    ],
    xpReward: 130,
  },
  {
    id: 'ap_m4',
    order: 4,
    title: 'Flight Capacity Classification with CASE WHEN',
    role: 'Flight Data Operations Analyst',
    storyline:
      'SkyHarbor Ground Handling and Passenger Logistics must allocate ground staff, boarding agents, and baggage handlers based on passenger volume. Operations Director Vikram requests a categorized flight capacity report.',
    businessProblem:
      'Raw passenger counts do not immediately indicate operational staffing tiers. Dispatchers need standardized capacity tiers to allocate dual-jetway boarding stairs and extra gate check-in agents.',
    objective:
      'Select flight_number, destination, passenger_count, and evaluate capacity tiers using a CASE statement: WHEN passenger_count >= 250 THEN "Heavy", WHEN passenger_count >= 150 THEN "Medium", ELSE "Light" END AS capacity_tier.',
    requiredOutcome:
      'A table of all flights with their raw passenger counts and classified capacity_tier.',
    checklist: [
      'SELECT flight_number, destination, passenger_count',
      'Include CASE WHEN passenger_count >= 250 THEN \'Heavy\'',
      'Include WHEN passenger_count >= 150 THEN \'Medium\'',
      'Include ELSE \'Light\' END AS capacity_tier',
      'FROM flights',
    ],
    sqlTopics: ['CASE WHEN', 'Conditional Logic', 'Derived Columns', 'Data Categorization'],
    hints: [
      'Use the CASE expression syntax: `CASE WHEN condition1 THEN val1 WHEN condition2 THEN val2 ELSE val3 END AS capacity_tier`.',
      'Check `>= 250` for Heavy first, then `>= 150` for Medium, with ELSE \'Light\'.',
      "SELECT flight_number, destination, passenger_count,\n  CASE\n    WHEN passenger_count >= 250 THEN 'Heavy'\n    WHEN passenger_count >= 150 THEN 'Medium'\n    ELSE 'Light'\n  END AS capacity_tier\nFROM flights;",
    ],
    sampleSolution: `SELECT flight_number, destination, passenger_count,
  CASE
    WHEN passenger_count >= 250 THEN 'Heavy'
    WHEN passenger_count >= 150 THEN 'Medium'
    ELSE 'Light'
  END AS capacity_tier
FROM flights;`,
    solutionExplanation:
      'The CASE statement brings branching conditional logic into SQL queries. Evaluating passenger thresholds into discrete labels transforms continuous operational metrics into actionable categories.',
    initialSqlPlaceholder: `-- Mission 4: Conditional Logic with CASE WHEN\n-- Classify flights into capacity tiers\nSELECT flight_number, destination, passenger_count,\n  CASE\n    WHEN passenger_count >= 250 THEN 'Heavy'\n    WHEN ...\n    ELSE 'Light'\n  END AS capacity_tier\nFROM flights;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify flight passenger capacity classification using CASE WHEN',
        expectedQuery:
          "SELECT flight_number, destination, passenger_count, CASE WHEN passenger_count >= 250 THEN 'Heavy' WHEN passenger_count >= 150 THEN 'Medium' ELSE 'Light' END AS capacity_tier FROM flights;",
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
    sqlTopics: ['INNER JOIN', 'ON clause', 'ORDER BY DESC', 'Weight Threshold Filtering'],
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
        description: 'Verify joined heavy baggage manifest ordered descending',
        expectedQuery:
          'SELECT f.flight_number, f.destination, b.passenger_name, b.weight_kg FROM flights f JOIN baggage b ON f.flight_id = b.flight_id WHERE b.weight_kg > 25.0 ORDER BY b.weight_kg DESC;',
        orderSensitive: true,
      },
    ],
    xpReward: 160,
  },
  {
    id: 'ap_m6',
    order: 6,
    title: 'Terminal Throughput Summary with HAVING',
    role: 'Flight Data Operations Analyst',
    storyline:
      'Airport CEO Sarah is preparing a terminal infrastructure expansion proposal for civil aviation authorities. She needs a consolidated summary of high-density concourses — specifically terminals routing more than 500 total passengers.',
    businessProblem:
      'Civil aviation grant allocations require identifying high-volume hubs. Operations must aggregate passenger volumes across terminals, gates, and flights, and filter out low-volume or inactive terminals using a HAVING threshold.',
    objective:
      'Join "terminals" (alias t), "gates" (alias g) on t.terminal_id = g.terminal_id, and "flights" (alias f) on g.gate_id = f.gate_id. Select terminal_name, COUNT(f.flight_id) AS total_flights, and SUM(f.passenger_count) AS total_passengers. Group by terminal_name, apply a HAVING filter where total_passengers > 500, and order by total_passengers descending.',
    requiredOutcome:
      'An aggregated terminal throughput summary showing total flights and passengers for terminals exceeding 500 passengers, sorted descending.',
    checklist: [
      'JOIN terminals t -> gates g ON t.terminal_id = g.terminal_id',
      'JOIN flights f ON g.gate_id = f.gate_id',
      'SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers',
      'GROUP BY t.terminal_name',
      'HAVING total_passengers > 500',
      'ORDER BY total_passengers DESC',
    ],
    sqlTopics: ['Multi-Table JOIN', 'GROUP BY', 'HAVING Clause', 'SUM / COUNT Aggregation', 'ORDER BY DESC'],
    hints: [
      'Chain the joins: terminals t JOIN gates g ON t.terminal_id = g.terminal_id JOIN flights f ON g.gate_id = f.gate_id.',
      'GROUP BY t.terminal_name and filter groups with HAVING total_passengers > 500 (or HAVING SUM(f.passenger_count) > 500).',
      'SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers\nFROM terminals t\nJOIN gates g ON t.terminal_id = g.terminal_id\nJOIN flights f ON g.gate_id = f.gate_id\nGROUP BY t.terminal_name\nHAVING total_passengers > 500\nORDER BY total_passengers DESC;',
    ],
    sampleSolution: `SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers
FROM terminals t
JOIN gates g ON t.terminal_id = g.terminal_id
JOIN flights f ON g.gate_id = f.gate_id
GROUP BY t.terminal_name
HAVING total_passengers > 500
ORDER BY total_passengers DESC;`,
    solutionExplanation:
      'Multi-table aggregations combined with HAVING allow filtering on grouped metric calculations (unlike WHERE which filters individual rows before aggregation). This extracts exactly the high-capacity hubs required for infrastructure planning.',
    initialSqlPlaceholder: `-- Mission 6: Multi-table terminal throughput summary with HAVING\nSELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers\nFROM terminals t\nJOIN gates g ON ...\nJOIN flights f ON ...\nGROUP BY t.terminal_name\nHAVING ...\nORDER BY ...;`,
    validationRules: [
      {
        type: 'SELECT_EXACT',
        description: 'Verify terminal throughput aggregation with HAVING threshold',
        expectedQuery:
          'SELECT t.terminal_name, COUNT(f.flight_id) AS total_flights, SUM(f.passenger_count) AS total_passengers FROM terminals t JOIN gates g ON t.terminal_id = g.terminal_id JOIN flights f ON g.gate_id = f.gate_id GROUP BY t.terminal_name HAVING total_passengers > 500 ORDER BY total_passengers DESC;',
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
