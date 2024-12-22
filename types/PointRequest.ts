export enum FeatureType {
    Viewpoint = "Viewpoint",
    Landmark = "Landmark",
    Historic = "Historic",
    Waterfall = "Waterfall",
    Campsite = "Campsite",
    Shelter = "Shelter",
    Bridge = "Bridge",
    Cave = "Cave",
    PicnicArea = "PicnicArea",
    RiverCrossing = "RiverCrossing",
    ParkingArea = "ParkingArea",
    TrailIntersection = "TrailIntersection"
}

export enum PointType {
    Startpoint = "Startpoint",
    Endpoint = "Endpoint",
    Viewpoint = "Viewpoint",
    Waypoint = "Waypoint",
    Checkpoint = "Checkpoint",
    EmergencyExit = "EmergencyExit"
}

export type PointRequest = {
    latitude: number;
    longitude: number;
    altitude: number;
    feature: FeatureType;
    featureDescription: string;
    pointType: PointType;
    image: string;
    orderInRoute: number; 
    routeId: string;
}
