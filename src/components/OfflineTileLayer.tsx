import { TileLayer } from 'react-leaflet';
import { TILE_ATTRIBUTION, TILE_URL_TEMPLATE } from '../services/offlineMaps';

/**
 * Standard OSM raster layer. Offline tiles are served by the PWA service
 * worker (CacheFirst on tile.openstreetmap.org) after Download Offline Trip Area.
 */
export function OfflineTileLayer() {
  return (
    <TileLayer
      url={TILE_URL_TEMPLATE}
      attribution={TILE_ATTRIBUTION}
      maxZoom={18}
      minZoom={6}
      detectRetina={false}
    />
  );
}
