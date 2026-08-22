/** Approximate city-centre coordinates for nearby-venue search on guide/city pages. */
const CITY_CENTROIDS: Record<string, { lat: number; lng: number }> = {
  london: { lat: 51.5074, lng: -0.1278 },
  birmingham: { lat: 52.4862, lng: -1.8904 },
  manchester: { lat: 53.4808, lng: -2.2426 },
  leeds: { lat: 53.8008, lng: -1.5491 },
  liverpool: { lat: 53.4084, lng: -2.9916 },
  bristol: { lat: 51.4545, lng: -2.5879 },
  newcastle: { lat: 54.9783, lng: -1.6178 },
  "newcastle-upon-tyne": { lat: 54.9783, lng: -1.6178 },
  sheffield: { lat: 53.3811, lng: -1.4701 },
  nottingham: { lat: 52.9548, lng: -1.1581 },
  edinburgh: { lat: 55.9533, lng: -3.1883 },
  leicester: { lat: 52.6369, lng: -1.1398 },
  derby: { lat: 52.9225, lng: -1.4746 },
  brighton: { lat: 50.8225, lng: -0.1372 },
  glasgow: { lat: 55.8642, lng: -4.2518 },
  cardiff: { lat: 51.4816, lng: -3.1791 },
  hull: { lat: 53.7676, lng: -0.3274 },
  "kingston-upon-hull": { lat: 53.7676, lng: -0.3274 },
  coventry: { lat: 52.4068, lng: -1.5197 },
  southampton: { lat: 50.9097, lng: -1.4044 },
  northampton: { lat: 52.2405, lng: -0.9027 },
  huddersfield: { lat: 53.6458, lng: -1.785 },
  bath: { lat: 51.3811, lng: -2.359 },
  "weston-super-mare": { lat: 51.346, lng: -2.977 },
  belfast: { lat: 54.5973, lng: -5.9301 },
  york: { lat: 53.96, lng: -1.0873 },
  oxford: { lat: 51.752, lng: -1.2577 },
  cambridge: { lat: 52.2053, lng: 0.1218 },
  swansea: { lat: 51.6214, lng: -3.9436 },
}

export function getCityCentroid(city: string): { lat: number; lng: number } | null {
  const key = city.toLowerCase().replace(/\s+/g, "-")
  return CITY_CENTROIDS[key] ?? null
}

export function getAllCentroidCitySlugs(): string[] {
  return Object.keys(CITY_CENTROIDS)
}
