# Kodaikanal Backpacking Trip (PWA)

Mobile-first **offline** travel route planner for:

**Bangalore → Poombarai → Kookal → Mannavanur → Kodaikanal → Bangalore**  
**Oct 1–4, 2026**

Static React frontend only — no backend. Deployable to **GitHub Pages**.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4
- Leaflet + OpenStreetMap tiles
- vite-plugin-pwa (installable PWA)
- localStorage + IndexedDB (`idb`) for trip/checklist state
- Cache Storage for offline map tiles

## Local development

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173/`).

```bash
npm run build
npm run preview
```

Typecheck (also runs as part of `build`):

```bash
npx tsc -b
```

## GitHub Pages deployment

1. Push this repo to GitHub (repo name becomes the URL path).
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main` (or `master`), or run the **Deploy to GitHub Pages** workflow manually.
4. Site URL: `https://<user>.github.io/<repo-name>/`

The workflow sets `VITE_BASE=/<repo-name>/` automatically so asset paths resolve correctly.

### Manual base override

```bash
VITE_BASE=/MyRepoName/ npm run build
```

## Offline maps — how it works

1. Deploy or run a **production** build (`npm run build && npm run preview`) so the PWA service worker is active. Plain `npm run dev` does not enable the SW by default.
2. Open the app once online, then tap **Download Offline Trip Area**.
3. The app:
   - Seeds itinerary data into IndexedDB
   - Enumerates OSM tiles for:
     - **Full trip corridor** zoom **8–11**
     - **Hills focus** (Poombarai / Kodaikanal / Kookal / Mannavanur) zoom **12–14**
   - Prefetches tiles with `<img>` requests (max **2** concurrent + short delays) so the service worker can store them — OSM tiles are not CORS-readable via `fetch()`
   - Service worker uses **CacheFirst** into Cache Storage (`poombarai-osm-tiles-v1`)
4. Progress, approximate size, and **Offline map ready** status are shown.
5. Leaflet requests the same tile URLs; offline responses come from the service worker cache. Markers, polylines, and trip data remain available from local storage.

If download reports no tiles cached: reload once (so the SW takes control), then retry.

### OpenStreetMap tile usage / licensing

- Tiles: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- Attribution required: © OpenStreetMap contributors
- Policy: https://operations.osmfoundation.org/policies/tiles/
- This app caches a **limited trip bounding box** only (not all of Tamil Nadu/Karnataka)
- Intended for **personal** offline trip use
- For heavy or commercial traffic, use your own tile server or a commercial provider

## Coordinates

Edit pins in:

`src/data/places.ts` → **`COORDINATE_CONFIG`**

Each place has `verificationStatus`: `verified` | `approximate` | `needs_verification`.

**Update lodging pins** (`poombarai_stay`, `kodaikanal_stay`) when stays are booked.

## Project structure

```
src/
  data/
    places.ts       # COORDINATE_CONFIG + places
    routes.ts       # distances, day segments, bounds
    tripData.ts     # meta, stays, timeline, checklist
  types/trip.ts
  services/
    offlineMaps.ts
    storage.ts
    navigation.ts
    geolocation.ts
  components/
    Map.tsx
    DaySelector.tsx
    PlaceCard.tsx
    Timeline.tsx
    Checklist.tsx
    OfflineStatus.tsx
    OfflineMapDownload.tsx
    TripSummary.tsx
    WeatherPanel.tsx
    OfflineTileLayer.tsx
  pages/Trip.tsx
  App.tsx
.github/workflows/deploy.yml
```

## Data still needing verification

See place cards marked **Needs verification** / **Approx. pin**, including:

- Exact Poombarai / Kodaikanal lodging coordinates
- Poombarai viewpoint pin
- Kookal lake / falls / farmland viewpoint pins
- Mannavanur grasslands / sheep farm access & pin
- Poondi return waypoint
- Kilavarai corridor pin
- Vattakanal falls trail pin
- Dolphin’s Nose trail conditions / closures
- Temple and lake opening hours
- Any waterfall water-entry safety (app shows a fixed caution — do not assume rock slides)

Distances and drive times are **road-adjusted estimates** from coordinates, not live routing.
