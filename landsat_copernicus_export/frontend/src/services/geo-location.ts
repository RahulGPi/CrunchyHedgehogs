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
displayName: string;
  /**
   * The latitude and longitude coordinates of the location.
   */
  location: Location;
}

/**
 * Asynchronously retrieves geographic information for a given location based on latitude and longitude.
 *
 * @param location The location for which to retrieve geographic data.
 * @returns A promise that resolves to a GeoLocationInfo object containing the display name and coordinates.
 */
export async function getGeoLocationInfo(location: Location): Promise<GeoLocationInfo> {
  // TODO: Implement this by calling an API.

  return {
    displayName: 'Some Location',
    location: {
      lat: location.lat,
      lng: location.lng,
    },
  };
}
