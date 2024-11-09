export interface GeolocationPosition {
    coords: {
        latitude: number;
        longitude: number;
        accuracy?: number;
        altitude?: number | null;
        altitudeAccuracy?: number | null;
        heading?: number | null;
        speed?: number | null;
    };
    timestamp: number;
}

// Additional types can be added here as needed
export interface Location {
    latitude: number;
    longitude: number;
}
