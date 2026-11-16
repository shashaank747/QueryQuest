import { WorldDefinition } from '../../../types/world';
import { WAREHOUSE_BASE_SCHEMA } from './schema';
import { WAREHOUSE_INITIAL_DATASET } from './dataset';
import { WAREHOUSE_MISSIONS } from './missions';

export const warehouseWorld: WorldDefinition = {
  id: 'warehouse',
  name: 'Warehouse Management',
  industry: 'Logistics & Supply Chain',
  tagline: 'Audit bulk pallets, track cross-dock shipments, and reconcile inventory discrepancies.',
  description:
    'Step into a high-throughput distribution center. Analyze purchase orders, carrier dispatches, and warehouse reorder thresholds.',
  thumbnailUrl: '/images/warehouse-world.jpg',
  storyIntro: {
    roleTitle: 'Logistics Data Specialist',
    organization: 'Apex Global Logistics Hub',
    background:
      'Apex handles thousands of pallets daily. Precision stock tracking ensures supply chains across the continent avoid costly halts.',
    keyResponsibilities: [
      'Monitor stock movements across warehouse bins and temperature vaults',
      'Evaluate vendor shipment punctuality and carrier lead times',
      'Reconcile physical stock against database manifests',
    ],
  },
  difficulty: 'Intermediate',
  estimatedTime: '50 mins',
  iconName: 'Boxes',
  accentColor: 'amber',
  dbFileName: 'warehouse.db',
  sqlTopics: ['CREATE TABLE', 'INSERT', 'SELECT', 'WHERE', 'UPDATE', 'JOIN', 'GROUP BY', 'HAVING'],
  isAvailable: true,
  missions: WAREHOUSE_MISSIONS,
  initialSchemaSql: WAREHOUSE_BASE_SCHEMA,
  initialDatasetSql: WAREHOUSE_INITIAL_DATASET,
  reportConfig: {
    title: 'Apex Global Logistics Hub — Executive Operations Audit',
    subtitle: 'Generated dynamically from live SQLite relational database records',
    executiveSummaryTemplate:
      'This logistics audit monitors warehouse storage capacity, inventory distribution across zones, and outbound freight movement to ensure fulfillment punctuality.',
    metrics: [
      {
        id: 'total_inventory_units',
        title: 'Total Stock Units Stored',
        query: 'SELECT printf("%,d", SUM(quantity)) AS total_units FROM inventory_bins;',
        description: 'Aggregate SKU quantities across all active storage bins.',
        type: 'stat',
        valueKey: 'total_units',
      },
      {
        id: 'total_dispatched_pallets',
        title: 'Total Freight Pallets Dispatched',
        query: 'SELECT SUM(pallet_count) AS total_pallets FROM shipments;',
        description: 'Total pallet volume processed across outbound carrier runs.',
        type: 'stat',
        valueKey: 'total_pallets',
      },
      {
        id: 'overcapacity_bins_count',
        title: 'Saturated Bin Alerts',
        query: 'SELECT COUNT(*) AS saturated_count FROM inventory_bins WHERE quantity >= max_capacity;',
        description: 'Number of storage bins operating at or exceeding 100% capacity.',
        type: 'stat',
        valueKey: 'saturated_count',
      },
      {
        id: 'stock_by_zone',
        title: 'Stock Distribution by Zone',
        query:
          'SELECT z.zone_name, SUM(b.quantity) as total_qty FROM zones z JOIN inventory_bins b ON z.zone_id = b.zone_id GROUP BY z.zone_name ORDER BY total_qty DESC;',
        description: 'Physical inventory density across warehouse zones.',
        type: 'bar_chart',
        labelKey: 'zone_name',
        valueKey: 'total_qty',
      },
      {
        id: 'carrier_scorecard',
        title: 'Carrier Freight Performance Scorecard',
        query:
          'SELECT carrier, COUNT(shipment_id) as shipments, SUM(pallet_count) as total_pallets FROM shipments GROUP BY carrier ORDER BY total_pallets DESC;',
        description: 'Outbound freight volume grouped by contracted commercial carrier.',
        type: 'table',
      },
      {
        id: 'overcapacity_details',
        title: 'Overcapacity Bins Immediate Attention List',
        query:
          'SELECT b.bin_code, p.product_name, b.quantity, b.max_capacity FROM inventory_bins b JOIN products p ON b.product_id = p.product_id WHERE b.quantity >= b.max_capacity;',
        description: 'Storage bins requiring immediate stock redistribution.',
        type: 'table',
      },
    ],
  },
};
