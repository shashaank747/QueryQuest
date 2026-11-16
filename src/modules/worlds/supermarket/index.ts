import { WorldDefinition } from '../../../types/world';
import { SUPERMARKET_BASE_SCHEMA } from './schema';
import { SUPERMARKET_FULL_SEED, SUPERMARKET_CATALOG_AND_SALES_SEED } from './dataset';
import { SUPERMARKET_MISSIONS } from './missions';

export const supermarketWorld: WorldDefinition = {
  id: 'supermarket',
  name: 'Supermarket Operations',
  industry: 'Retail & Consumer Goods',
  tagline: 'Streamline shelf stock, troubleshoot checkout errors, and generate retail revenue reports.',
  description:
    'Step into FreshMart Hypermarkets as a Junior Database Executive. Transform chaotic paper receipts and unlinked spreadsheets into an operational SQLite relational engine.',
  thumbnailUrl: '/images/supermarket-world.jpg',
  storyIntro: {
    roleTitle: 'Junior Database Executive',
    organization: 'FreshMart Hypermarkets Ltd.',
    background:
      'FreshMart is scaling from a regional grocery chain into a multi-city hypermarket. The legacy paper registers and fragmented logs are failing during rush hours. You have been brought in to establish database integrity, audit supplier records, and report vital sales intelligence.',
    keyResponsibilities: [
      'Design and deploy schemas for branches and merchandise categories',
      'Maintain inventory and catch low-stock deficits before shelves empty',
      'Perform catalog text searches and filter completed order transactions',
      'Deliver executive analytics on payment method turnover and top customer spenders',
    ],
  },
  difficulty: 'Beginner',
  estimatedTime: '45 mins',
  iconName: 'ShoppingCart',
  accentColor: 'emerald',
  dbFileName: 'supermarket.db',
  sqlTopics: [
    'CREATE TABLE',
    'PRIMARY KEY',
    'AUTOINCREMENT',
    'UNIQUE',
    'INSERT',
    'SELECT',
    'WHERE',
    'UPDATE',
    'DELETE',
    'LIKE',
    'BETWEEN',
    'GROUP BY',
    'HAVING',
    'Aggregate Functions',
  ],
  isAvailable: true,
  missions: SUPERMARKET_MISSIONS,
  initialSchemaSql: SUPERMARKET_BASE_SCHEMA,
  initialDatasetSql: `${SUPERMARKET_FULL_SEED}\n${SUPERMARKET_CATALOG_AND_SALES_SEED}`,
  reportConfig: {
    title: 'FreshMart Supermarket Operations — Executive Audit Report',
    subtitle: 'Generated dynamically from live SQLite relational database records',
    executiveSummaryTemplate:
      'This comprehensive audit synthesizes data across store suppliers, product catalogs, customer transactions, and live shelf inventory. The store operates with active supplier channels, multi-tiered loyalty members, and healthy category turnover.',
    metrics: [
      {
        id: 'total_revenue',
        title: 'Total Gross Store Sales',
        query: 'SELECT printf("₹%,d", CAST(SUM(total_amount) AS INTEGER)) as metric_val FROM orders;',
        description: 'Aggregate revenue generated across completed checkout transactions.',
        type: 'stat',
        valueKey: 'metric_val',
      },
      {
        id: 'total_inventory',
        title: 'Total Units in Inventory',
        query: 'SELECT SUM(quantity_on_hand) as total_units FROM inventory;',
        description: 'Total stock units currently available across all store shelves and cold rooms.',
        type: 'stat',
        valueKey: 'total_units',
      },
      {
        id: 'low_stock_count',
        title: 'Depleted SKU Alerts',
        query: 'SELECT COUNT(*) as alert_count FROM inventory WHERE quantity_on_hand < reorder_level;',
        description: 'Number of product lines whose current stock is below reorder threshold.',
        type: 'stat',
        valueKey: 'alert_count',
      },
      {
        id: 'revenue_by_payment_method',
        title: 'Revenue by Payment Channel',
        query:
          'SELECT payment_method, ROUND(SUM(amount), 2) as revenue FROM payments GROUP BY payment_method ORDER BY revenue DESC;',
        description: 'Payment method turnover distribution across store checkouts.',
        type: 'bar_chart',
        labelKey: 'payment_method',
        valueKey: 'revenue',
      },
      {
        id: 'top_spenders',
        title: 'Top Customer Spenders',
        query:
          'SELECT customer_id, COUNT(order_id) as total_orders, printf("₹%,d", CAST(SUM(total_amount) AS INTEGER)) as total_spent FROM orders GROUP BY customer_id ORDER BY SUM(total_amount) DESC LIMIT 5;',
        description: 'High-value customer accounts driving checkout volume.',
        type: 'table',
      },
      {
        id: 'low_stock_items',
        title: 'Immediate Reorder Action List',
        query:
          'SELECT product_id, quantity_on_hand, reorder_level, aisle_number FROM inventory WHERE quantity_on_hand < reorder_level;',
        description: 'Stock deficit records requiring warehouse replenishment.',
        type: 'table',
      },
    ],
  },
};

