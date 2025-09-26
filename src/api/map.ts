import type { IShot_Distance } from "../types/map";

export function getCurCoordinates(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coors = {
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };

        console.log("current coordinates are: ", coors);
        // curDeviceCoor.value = coors;
        resolve(coors);
      },
      (err) => reject(err)
    );
  });
}

export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): IShot_Distance {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // variance of distance
  // 7.6 yards
  // 6.98 metres - 7 metres

  const distance_in_metres = Math.round(R * c);
  const distance_in_yards = Math.round(distance_in_metres * 1.09361);
  return { yards: distance_in_yards, metres: distance_in_metres };
}
