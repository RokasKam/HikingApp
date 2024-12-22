export enum DifficultyLevelEnum {
    Easy = "Easy",
    Moderate = "Moderate",
    Hard = "Hard",
    Expert = "Expert"
}

export enum SeasonalityEnum {
    Spring = "Spring",
    Summer = "Summer",
    Fall = "Fall",
    Winter = "Winter",
    YearRound = "YearRound"
}

export enum TerrainTypeEnum {
    Forest = "Forest",
    Mountain = "Mountain",
    Desert = "Desert",
    Coastal = "Coastal",
    Urban = "Urban"
}

export enum AccessibilityEnum {
    WheelchairFriendly = "WheelchairFriendly",
    DogFriendly = "DogFriendly",
    ChildFriendly = "ChildFriendly",
    SeniorFriendly = "SeniorFriendly",
    NonAccessible = "NonAccessible"
}

export type HikeRequest = {
    name: string;
    description: string;
    difficultyLevel: DifficultyLevelEnum;
    totalDistance: number;
    totalDurationInMinutes: number;
    totalElevationGain: number;
    seasonality: SeasonalityEnum;
    terrainType: TerrainTypeEnum;
    suitableForBeginners: boolean;
    accessibility: AccessibilityEnum;
}
