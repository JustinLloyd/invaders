import {DifficultyData} from "./DifficultyData";
import {GameObject} from "./GameObject";
import {DIFFICULTY_MAX, DIFFICULTY_MIN} from "./Constants";

export const DIFFICULTY_0_INVADER_COUNT = 2;
export const DIFFICULTY_0_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY=200;
export const DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW = 1;
export const DIFFICULTY_0_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_0_BONUS_POINT_VALUE = 10;
export const DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY = 500;
export const DIFFICULTY_0_MISSILE_BASE_MISSILE_COUNT = 2;
export const DIFFICULTY_0_MISSILE_MOVEMENT_DELAY=200;
export const DIFFICULTY_0_MISSILE_COUNT=2;

export const DIFFICULTY_1_INVADER_COUNT = 2;
export const DIFFICULTY_1_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY=200;
export const DIFFICULTY_1_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_1_BONUS_POINT_VALUE = 10;
export const DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY = 500;
export const DIFFICULTY_1_MISSILE_BASE_MISSILE_COUNT = 2;
export const DIFFICULTY_1_MISSILE_MOVEMENT_DELAY=2990;
export const DIFFICULTY_1_MISSILE_COUNT=2;

export const DIFFICULTY_2_INVADER_COUNT = 2;
export const DIFFICULTY_2_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY=200;
export const DIFFICULTY_2_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_2_BONUS_POINT_VALUE = 10;
export const DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_2_MISSILE_BASE_FIRING_DELAY = 500;
export const DIFFICULTY_2_MISSILE_BASE_MISSILE_COUNT = 2;
export const DIFFICULTY_2_MISSILE_MOVEMENT_DELAY=200;
export const DIFFICULTY_2_MISSILE_COUNT=2;

export class DifficultySetting extends GameObject
{
    public static instance: DifficultySetting;

    private _currentDifficulty: number;
    private difficultyData: ReadonlyArray<DifficultyData> =
        [
            {
                invaderCount: DIFFICULTY_0_INVADER_COUNT,
                bonusMovementDelay: DIFFICULTY_0_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_0_BONUS_POINT_VALUE,
                invaderDescentDelay: 1,
                deathRayCount: DIFFICULTY_0_DEATH_RAY_COUNT,
                deathRayMovementDelay:DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY,
                invaderLowestStartingRow: DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval:500,
                missileCount: DIFFICULTY_0_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_0_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay:DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY_1_INVADER_COUNT,
                bonusMovementDelay: DIFFICULTY_1_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_1_BONUS_POINT_VALUE,
                invaderDescentDelay: 1,
                deathRayCount: DIFFICULTY_1_DEATH_RAY_COUNT,
                deathRayMovementDelay:DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY,
                invaderLowestStartingRow: 2,
                invaderSpawnInterval:500,
                missileCount: 2,
                missileMovementDelay: DIFFICULTY_1_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay:DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY_2_INVADER_COUNT,
                bonusMovementDelay: DIFFICULTY_2_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_2_BONUS_POINT_VALUE,
                invaderDescentDelay: 1,
                deathRayCount: DIFFICULTY_2_DEATH_RAY_COUNT,
                deathRayMovementDelay:DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY,
                invaderLowestStartingRow: 3,
                invaderSpawnInterval:500,
                missileCount: DIFFICULTY_2_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_2_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay:DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY
            }
        ];

    init()
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
        value = Math.min(DIFFICULTY_MAX, Math.max(DIFFICULTY_MIN, value));
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
