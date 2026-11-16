import { WorldDefinition } from '../../../types/world';
import { KAAPI_BASE_SCHEMA } from './schema';
import { KAAPI_INITIAL_DATASET } from './dataset';
import { KAAPI_MISSIONS } from './missions';

export const kaapiWorld: WorldDefinition = {
  id: 'kaapi',
  name: 'Query & Kaapi — Tiffin & Filter Coffee',
  industry: 'Hospitality & Culinary Operations',
  tagline: 'Rebuild menu registers, audit Davara loyalty passes, and optimize breakfast rush operations.',
  description:
    'Step into Query & Kaapi as Kitchen POS & Inventory Systems Lead. Restore the tiffin counter database, monitor morning footfall surges, and deliver executive breakfast sales tallies.',
  thumbnailUrl: '/images/kaapi-world.jpg',
  storyIntro: {
    roleTitle: 'Kitchen POS & Inventory Systems Lead',
    organization: 'Query & Kaapi Tiffin Room & Roastery',
    background:
      'It is 7:45 AM at Query & Kaapi, and the aroma of roasted Chikmagalur coffee beans and sizzling ghee is already drawing a queue outside the shutters. Moments before opening, a power fluctuation wiped the digital menu board and the prepaid Davara coffee-pass database. Master Roaster & Head Chef Suresh Shetty brings you behind the billing counter to restore the POS terminal before the first batch of Masala Dosas and brass-tumbler Degree Kaapi goes out. Rebuild menu tables, audit prepaid passes, and tally morning shift sales.',
    keyResponsibilities: [
      'Rebuild digital menu and loyalty pass schemas with strict constraint rules',
      'Load authentic South Indian tiffin items into master pricing tables',
      'Filter express breakfast combinations and audit missing nutritional calories',
      'Process emergency seasonal item updates and purge deprecated menu records',
      'Generate final executive closing registers for head chef and management',
    ],
  },
  difficulty: 'Beginner',
  estimatedTime: '40 mins',
  iconName: 'Coffee',
  accentColor: 'amber',
  dbFileName: 'kaapi.db',
  sqlTopics: [
    'CREATE TABLE',
    'PRIMARY KEY',
    'AUTOINCREMENT',
    'UNIQUE',
    'CHECK',
    'INSERT',
    'SELECT',
    'WHERE',
    'BETWEEN',
    'IN',
    'LIKE',
    'UPDATE',
    'DELETE',
    'Aggregate Functions',
  ],
  isAvailable: true,
  missions: KAAPI_MISSIONS,
  initialSchemaSql: KAAPI_BASE_SCHEMA,
  initialDatasetSql: KAAPI_INITIAL_DATASET,
  reportConfig: {
    title: 'Query & Kaapi — Morning Shift Executive Closing Register',
    subtitle: 'Generated dynamically from live SQLite culinary POS database records',
    executiveSummaryTemplate:
      'This operational register summarizes breakfast turnover across tiffin categories, coffee tumbler throughput, and customer menu preferences. Ghee tiffins and Chikmagalur degree kaapi lead morning volume.',
    metrics: [
      {
        id: 'total_menu_dishes',
        title: 'Active Menu Dishes',
        query: 'SELECT COUNT(*) as total_dishes FROM menu_items;',
        description: 'Total active breakfast dishes and beverage SKUs available for order.',
        type: 'stat',
        valueKey: 'total_dishes',
      },
      {
        id: 'total_shift_orders',
        title: 'Morning Shift Plates Served',
        query: 'SELECT printf("%,d", SUM(orders_today)) as total_orders FROM menu_items;',
        description: 'Aggregate breakfast orders fulfilled during the 8:00 AM rush.',
        type: 'stat',
        valueKey: 'total_orders',
      },
      {
        id: 'avg_dish_price',
        title: 'Average Dish Price',
        query: 'SELECT printf("₹%.2f", AVG(price_inr)) as avg_price FROM menu_items;',
        description: 'Mean price across all available breakfast items.',
        type: 'stat',
        valueKey: 'avg_price',
      },
      {
        id: 'orders_by_category',
        title: 'Orders by Category',
        query:
          'SELECT category, SUM(orders_today) as total_plates FROM menu_items GROUP BY category ORDER BY total_plates DESC;',
        description: 'Volume breakdown across Dosa, Idli_Vada, Kaapi, and Sweets.',
        type: 'bar_chart',
        labelKey: 'category',
        valueKey: 'total_plates',
      },
      {
        id: 'top_selling_tiffins',
        title: 'Top Best-Selling Tiffin Specials',
        query:
          'SELECT item_name, category, orders_today FROM menu_items ORDER BY orders_today DESC LIMIT 5;',
        description: 'Highest velocity breakfast dishes commanding peak kitchen demand.',
        type: 'table',
      },
    ],
  },
};
