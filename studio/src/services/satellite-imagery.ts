/**
 * Represents geographical coordinates with latitude and longitude.
 */
export interface Coordinates {
  /**
   * The latitude of the location.
   */
  latitude: number;
  /**
   * The longitude of the location.
   */
  longitude: number;
}

/**
 * Represents satellite imagery data.
 */
export interface SatelliteImage {
  /**
   * The URL of the satellite image.
   */
  imageUrl: string;
}

/**
 * Retrieves satellite imagery for a given location.
 *
 * @param coordinates The coordinates of the location.
 * @returns A promise that resolves to a SatelliteImage object.
 */
export async function getSatelliteImage(coordinates: Coordinates): Promise<SatelliteImage> {
  // TODO: Implement this function by calling an API or fetching from directory.
  // For now, return a placeholder image.
  //   const { latitude, longitude } = coordinates;
  //   const imageUrl = `directorylandsat_copernicus_export/downloaded_images/landsat_images/lat_${latitude}_lon_${longitude}.jpg`;

  return {
    imageUrl: '/images/satellite-placeholder.png',
  };
}
