import { WorldDefinition } from '../../types/world';
import { supermarketWorld } from './supermarket';
import { metroWorld } from './metro';
import { kaapiWorld } from './kaapi';
import { airportWorld } from './airport';
import { warehouseWorld } from './warehouse';
import { hospitalWorld } from './hospital';
import { bankWorld } from './bank';

export const WORLDS_REGISTRY: WorldDefinition[] = [
  supermarketWorld,
  metroWorld,
  kaapiWorld,
  airportWorld,
  warehouseWorld,
  hospitalWorld,
  bankWorld,
];

export function getWorldById(id: string): WorldDefinition | undefined {
  return WORLDS_REGISTRY.find((w) => w.id === id);
}
