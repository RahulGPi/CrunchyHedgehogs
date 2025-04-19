/**
 * Represents a geographical location with latitude and longitude coordinates.
 */
export interface Location {
  /**
   * The latitude of the location.
   */
  lat: number;
  /**
   * The longitude of the location.
   */
  lng: number;
}

/**
 * Represents information about a geographical location.
 */ 
export interface GeoLocationInfo {
  /**
   * The display name of the location.
   */
  name: string;
  lat: number;
  lng: number;
}

/**
 * Asynchronously retrieves geographic information for a given location based on latitude and longitude.
 *
 * @param latitude The latitude of the location.
* @param longitude The longitude of the location.
 * @returns A promise that resolves to a GeoLocationInfo object containing the display name and coordinates.
 */
export async function getGeoLocationInfo(latitude: number, longitude: number): Promise<GeoLocationInfo> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
  );
  const data = await response.json();

  return {
    name: data.display_name,
    lat: latitude,
    lng: longitude,
  };
}
