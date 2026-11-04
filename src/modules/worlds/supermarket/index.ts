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
  storyIntro: {
    roleTitle: 'Junior Database Executive',
    organization: 'FreshMart Hypermarkets Ltd.',
    background:
      'FreshMart is scaling from a regional grocery chain into a multi-city hypermarket. The legacy paper registers and fragmented logs are failing during rush hours. You have been brought in to establish database integrity, audit supplier records, and report vital sales intelligence.',
    keyResponsibilities: [
      'Design and deploy relational schemas for branches and merchandise categories',
      'Maintain real-time inventory and catch low-stock deficits before shelves empty',
      'Investigate point-of-sale scanner exceptions and diagnose inventory mismatches',
      'Deliver automated executive analytics on revenue by category and top-selling lines',
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
    'FOREIGN KEY',
    'INSERT',
    'SELECT',
    'WHERE',
    'UPDATE',
    'DELETE',
    'INNER JOIN',
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
        id: 'revenue_by_category',
        title: 'Revenue by Category',
        query:
          'SELECT c.category_name, ROUND(SUM(oi.quantity * oi.unit_price), 2) as revenue FROM categories c JOIN products p ON c.category_id = p.category_id JOIN order_items oi ON p.product_id = oi.product_id GROUP BY c.category_name ORDER BY revenue DESC;',
        description: 'Departmental sales distribution across store merchandise lines.',
        type: 'bar_chart',
        labelKey: 'category_name',
        valueKey: 'revenue',
      },
      {
        id: 'best_sellers',
        title: 'Top Best-Selling Products',
        query:
          'SELECT p.product_name, SUM(oi.quantity) as units_sold FROM products p JOIN order_items oi ON p.product_id = oi.product_id GROUP BY p.product_name ORDER BY units_sold DESC LIMIT 5;',
        description: 'High-velocity SKUs commanding the largest order volume.',
        type: 'table',
      },
      {
        id: 'low_stock_items',
        title: 'Immediate Reorder Action List',
        query:
          'SELECT p.product_name, i.quantity_on_hand, i.reorder_level, i.aisle_number FROM products p JOIN inventory i ON p.product_id = i.product_id WHERE i.quantity_on_hand < i.reorder_level;',
        description: 'Stock deficit records requiring warehouse procurement replenishment.',
        type: 'table',
      },
    ],
  },
};

