// Enums
export enum TerrainTypeEnum {
    Mountain = 'Mountain',
    Forest = 'Forest',
    Desert = 'Desert',
    Plains = 'Plains',
    Coastal = 'Coastal',
    Hills = 'Hills',
    Wetlands = 'Wetlands',
    Urban = 'Urban',
    Tundra = 'Tundra',
    Jungle = 'Jungle',
  }
  
  export enum SurfaceTypeEnum {
    Paved = 'Paved',
    Gravel = 'Gravel',
    Mud = 'Mud',
    Sand = 'Sand',
    Rock = 'Rock',
    Grass = 'Grass',
    Snow = 'Snow',
    Ice = 'Ice',
    Boardwalk = 'Boardwalk',
    Cobblestone = 'Cobblestone',
  }
  
  export type RouteRequest = {
    orderInHike: number;
    description: string;
    distance: number;
    durationInMinutes: number;
    elevationChange: number;
    navigationNotes: string;
    terrainType: TerrainTypeEnum;
    surfaceType: SurfaceTypeEnum;
    hikeId: string;
  }