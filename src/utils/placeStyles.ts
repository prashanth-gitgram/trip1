import type { PlaceType } from '../types/trip';

export const TYPE_COLORS: Record<PlaceType, string> = {
  city: '#c4a35a',
  town: '#b8956a',
  village: '#8fbc8f',
  stay: '#e8c547',
  viewpoint: '#6bb3c0',
  waterfall: '#5dade2',
  lake: '#4a90a4',
  temple: '#d4a017',
  grassland: '#7a9e6a',
  fuel: '#e67e22',
  food: '#cd853f',
  waypoint: '#9aa694',
};

export const TYPE_LABELS: Record<PlaceType, string> = {
  city: 'City',
  town: 'Town',
  village: 'Village',
  stay: 'Stay',
  viewpoint: 'Viewpoint',
  waterfall: 'Waterfall',
  lake: 'Lake',
  temple: 'Temple',
  grassland: 'Grassland',
  fuel: 'Fuel',
  food: 'Food',
  waypoint: 'Waypoint',
};

export function markerSymbol(type: PlaceType): string {
  switch (type) {
    case 'stay':
      return '⌂';
    case 'waterfall':
      return '≋';
    case 'viewpoint':
      return '◉';
    case 'lake':
      return '○';
    case 'village':
      return '▴';
    case 'temple':
      return '◆';
    case 'grassland':
      return '≈';
    case 'city':
    case 'town':
      return '■';
    default:
      return '•';
  }
}
