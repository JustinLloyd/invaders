import DifficultyData from "./DifficultyData";
import GameObject from "./GameObject";
import {DIFFICULTY_MAX, DIFFICULTY_MIN} from "./Constants";
import Clamp from "./Clamp";

export const DIFFICULTY_0_INVADER_COUNT = 2;
export const DIFFICULTY_0_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY = 200;
export const DIFFICULTY_0_INVADER_SPAWN_INTERVAL = 1600;
export const DIFFICULTY_0_INVADER_SPAWN_CHANCE = 0.1;
export const DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW = 2;
export const DIFFICULTY_0_BONUS_CHANCE = 0.0075;
export const DIFFICULTY_0_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_0_BONUS_POINT_VALUE = 10;
export const DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY = 400;
export const DIFFICULTY_0_MISSILE_BASE_MISSILE_COUNT = 2;
export const DIFFICULTY_0_MISSILE_MOVEMENT_DELAY = 200;
export const DIFFICULTY_0_MISSILE_COUNT = 2;

export const DIFFICULTY_1_INVADER_COUNT = 2;
export const DIFFICULTY_1_INVADER_LOWEST_STARTING_ROW = 3;
export const DIFFICULTY_1_INVADER_SPAWN_INTERVAL = 800;
export const DIFFICULTY_1_INVADER_SPAWN_CHANCE = 0.2;
export const DIFFICULTY_1_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY = 200;
export const DIFFICULTY_1_BONUS_CHANCE = 0.0075;
export const DIFFICULTY_1_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_1_BONUS_POINT_VALUE = 10;
export const DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY = 400;
export const DIFFICULTY_1_MISSILE_BASE_MISSILE_COUNT = 2;
export const DIFFICULTY_1_MISSILE_MOVEMENT_DELAY = 200;
export const DIFFICULTY_1_MISSILE_COUNT = 2;

export const DIFFICULTY_2_INVADER_COUNT = 2;
export const DIFFICULTY_2_INVADER_SPAWN_INTERVAL = 400;
export const DIFFICULTY_2_INVADER_SPAWN_CHANCE = 0.25;
export const DIFFICULTY_2_INVADER_LOWEST_STARTING_ROW = 4;
export const DIFFICULTY_2_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY = 200;
export const DIFFICULTY_2_BONUS_CHANCE = 0.0075;
export const DIFFICULTY_2_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_2_BONUS_POINT_VALUE = 10;
export const DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_2_MISSILE_BASE_FIRING_DELAY = 400;
export const DIFFICULTY_2_MISSILE_BASE_MISSILE_COUNT = 2;
export const DIFFICULTY_2_MISSILE_MOVEMENT_DELAY = 200;
export const DIFFICULTY_2_MISSILE_COUNT = 2;

export default class DifficultySetting
{
    public static instance: DifficultySetting;

    private _currentDifficulty: number;
    private difficultyData: ReadonlyArray<DifficultyData> =
        [
            {
                invaderCount: DIFFICULTY_0_INVADER_COUNT,
                bonusChance: DIFFICULTY_0_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY_0_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_0_BONUS_POINT_VALUE,
                deathRayCount: DIFFICULTY_0_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY,
                invaderLowestStartingRow: DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY_0_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY_0_INVADER_SPAWN_CHANCE,
                invaderStepDownDelay: 500,
                invaderStepDownChance: 0.05,
                invaderStepSidewaysDelay: 500,
                invaderStepSidewaysChance: 0.01,
                missileCount: DIFFICULTY_0_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_0_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY_1_INVADER_COUNT,
                bonusChance: DIFFICULTY_1_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY_1_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_1_BONUS_POINT_VALUE,
                deathRayCount: DIFFICULTY_1_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY,
                invaderLowestStartingRow: DIFFICULTY_1_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY_1_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY_1_INVADER_SPAWN_CHANCE,
                invaderStepDownDelay: 500,
                invaderStepDownChance: 0.05,
                invaderStepSidewaysDelay: 500,
                invaderStepSidewaysChance: 0.01,
                missileCount: 2,
                missileMovementDelay: DIFFICULTY_1_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY_2_INVADER_COUNT,
                bonusChance: DIFFICULTY_2_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY_2_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_2_BONUS_POINT_VALUE,
                deathRayCount: DIFFICULTY_2_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY,
                invaderLowestStartingRow: DIFFICULTY_2_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY_2_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY_2_INVADER_SPAWN_CHANCE,
                invaderStepDownDelay: 500,
                invaderStepDownChance: 0.05,
                invaderStepSidewaysDelay: 500,
                invaderStepSidewaysChance: 0.01,
                missileCount: DIFFICULTY_2_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_2_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY_2_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY
            }
        ];

    constructor()
    {
        this._currentDifficulty = 0;
        DifficultySetting.instance = this;
    }

    get currentDifficulty(): number
    {
        return this._currentDifficulty;
    }

    set currentDifficulty(value: number)
    {
        value = Clamp.between(value, DIFFICULTY_MIN, DIFFICULTY_MAX);
        this._currentDifficulty = value;
    }

    public static get difficulty(): DifficultyData
    {
        return DifficultySetting.instance.difficultyData[DifficultySetting.instance._currentDifficulty];
    }

    // get deathRays(): number
    // {
    //     return this.difficultyData[this._currentDifficulty].deathRays;
    // }

    // get invaders(): number
    // {
    //     return this.difficultyData[this._currentDifficulty].invaderCount;
    // }

    // get missiles(): number
    // {
    //     return this.difficultyData[this._currentDifficulty].missiles;
    // }
    //
    // get bonusMovementDelay(): number
    // {
    //     return this.difficultyData[this._currentDifficulty].bonusMovementDelay;
    // }
}
