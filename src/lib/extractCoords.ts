/**
 * Extract latitude and longitude from a Google Maps URL.
 * Supports various URL formats:
 * - https://www.google.com/maps/place/.../@13.7563,100.5018,...
 * - https://www.google.com/maps?q=13.7563,100.5018
 * - https://www.google.com/maps?ll=13.7563,100.5018
 * - https://maps.google.com/...!3d13.7563!4d100.5018...
 * - https://www.google.com/maps/dir/.../@13.7563,100.5018,...
 */
export function extractCoordsFromUrl(url: string): { lat: number; lng: number } | null {
  if (!url) return null;

  // Pattern 1: /@lat,lng
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  // Pattern 2: ?q=lat,lng or &q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }

  // Pattern 3: ?ll=lat,lng or &ll=lat,lng
  const llMatch = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch) {
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  }

  // Pattern 4: !3dlat!4dlng (embedded/place IDs)
  const embedMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (embedMatch) {
    return { lat: parseFloat(embedMatch[1]), lng: parseFloat(embedMatch[2]) };
  }

  return null;
}
