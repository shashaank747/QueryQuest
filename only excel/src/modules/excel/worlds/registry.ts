import { ExcelWorldDefinition, ExcelMission } from './types';
import { supermarketWorld } from './supermarket';
import { metroWorld } from './metro';
import { kaapiWorld } from './kaapi';
import { airportWorld } from './airport';
import { warehouseWorld } from './warehouse';
import { hospitalWorld } from './hospital';
import { bankWorld } from './bank';

export const EXCEL_WORLDS_REGISTRY: ExcelWorldDefinition[] = [
  supermarketWorld,
  metroWorld,
  kaapiWorld,
  airportWorld,
  warehouseWorld,
  hospitalWorld,
  bankWorld,
];

/**
 * Retrieve all registered Excel industry worlds
 */
export function getAllExcelWorlds(): ExcelWorldDefinition[] {
  return [...EXCEL_WORLDS_REGISTRY];
}

/**
 * Find an Excel world by its unique identifier (e.g. 'supermarket', 'metro', 'kaapi')
 */
export function getExcelWorldById(id: string): ExcelWorldDefinition | undefined {
  return EXCEL_WORLDS_REGISTRY.find((w) => w.id === id);
}

/**
 * Find a specific mission by world ID and mission ID
 */
export function getExcelMissionById(worldId: string, missionId: string): ExcelMission | undefined {
  const world = getExcelWorldById(worldId);
  if (!world) return undefined;
  return world.missions.find((m) => m.id === missionId);
}
