import { WorldDefinition } from '../../../types/world';
import { AIRPORT_BASE_SCHEMA } from './schema';
import { AIRPORT_INITIAL_DATASET } from './dataset';
import { AIRPORT_MISSIONS } from './missions';

export const airportWorld: WorldDefinition = {
  id: 'airport',
  name: 'Airport Operations',
  industry: 'Aviation & Transportation',
  tagline: 'Track flight radar schedules, passenger gates, and aircraft tarmac transitions.',
  description:
    'Manage airlines, terminal concourses, baggage handling systems, and live flight movements across runway states.',
  thumbnailUrl: '/images/airport-world.jpg',
  storyIntro: {
    roleTitle: 'Flight Data Operations Analyst',
    organization: 'SkyHarbor International Airport',
    background:
      'SkyHarbor coordinates 500+ daily flights. With tight turnaround windows and complex multi-terminal logistics, real-time relational analytics keep passengers moving safely.',
    keyResponsibilities: [
      'Track flight movement states: SCHEDULED -> BOARDING -> AIRBORNE -> LANDED',
      'Investigate baggage routing bottlenecks and passenger connections',
      'Analyze gate turnarounds and terminal passenger loads',
    ],
  },
  difficulty: 'Intermediate',
  estimatedTime: '60 mins',
  iconName: 'Plane',
  accentColor: 'sky',
  dbFileName: 'airport.db',
  sqlTopics: ['INNER JOIN', 'Multi-Table JOIN', 'LEFT JOIN', 'CASE WHEN', 'GROUP BY', 'HAVING'],
  isAvailable: true,
  missions: AIRPORT_MISSIONS,
  initialSchemaSql: AIRPORT_BASE_SCHEMA,
  initialDatasetSql: AIRPORT_INITIAL_DATASET,
  reportConfig: {
    title: 'SkyHarbor Airport Operations — Executive Operations Audit',
    subtitle: 'Generated dynamically from live SQLite relational database records',
    executiveSummaryTemplate:
      'This operational audit synthesizes flights, gates, and baggage handling across all terminals. Real-time data keeps airport operations punctuality and passenger throughput optimized.',
    metrics: [
      {
        id: 'total_flights',
        title: 'Total Active Flights',
        query: 'SELECT COUNT(*) AS total_flights FROM flights;',
        description: 'Scheduled and active flights on the flight radar manifest.',
        type: 'stat',
        valueKey: 'total_flights',
      },
      {
        id: 'total_passengers',
        title: 'Total Passenger Load',
        query: 'SELECT printf("%,d", SUM(passenger_count)) AS total_pax FROM flights;',
        description: 'Total passengers traveling through SkyHarbor today.',
        type: 'stat',
        valueKey: 'total_pax',
      },
      {
        id: 'delayed_flights_count',
        title: 'Delayed Flight Alerts',
        query: 'SELECT COUNT(*) AS delayed_count FROM flights WHERE status = "Delayed";',
        description: 'Flights currently experiencing ground or weather holds.',
        type: 'stat',
        valueKey: 'delayed_count',
      },
      {
        id: 'terminal_throughput',
        title: 'Passenger Throughput by Terminal',
        query:
          'SELECT t.terminal_name, SUM(f.passenger_count) as passengers FROM terminals t JOIN gates g ON t.terminal_id = g.terminal_id JOIN flights f ON g.gate_id = f.gate_id GROUP BY t.terminal_name ORDER BY passengers DESC;',
        description: 'Concourse passenger density distribution.',
        type: 'bar_chart',
        labelKey: 'terminal_name',
        valueKey: 'passengers',
      },
      {
        id: 'flights_by_airline',
        title: 'Flights by Airline Partner',
        query:
          'SELECT a.airline_name, a.iata_code, COUNT(f.flight_id) as active_flights FROM airlines a JOIN flights f ON a.airline_id = f.airline_id GROUP BY a.airline_name, a.iata_code ORDER BY active_flights DESC;',
        description: 'Flight distribution across registered carrier fleets.',
        type: 'table',
      },
      {
        id: 'heavy_baggage_list',
        title: 'Heavy Cargo / Baggage Watchlist (>25kg)',
        query:
          'SELECT f.flight_number, b.passenger_name, b.weight_kg, b.status FROM flights f JOIN baggage b ON f.flight_id = b.flight_id WHERE b.weight_kg > 25.0 ORDER BY b.weight_kg DESC;',
        description: 'Checked bags requiring special ramp weight-and-balance handling.',
        type: 'table',
      },
    ],
  },
};
