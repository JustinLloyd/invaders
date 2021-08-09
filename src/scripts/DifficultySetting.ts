import DifficultyData from "./DifficultyData";
import GameObject from "./GameObject";
import {DIFFICULTY_MAX, DIFFICULTY_MIN} from "./Constants";
import Clamp from "./Clamp";
import VFDGameObject from './VFDGameObject';

// difficulty 0
export const DIFFICULTY_0_INVADER_COUNT = 2;
export const DIFFICULTY_0_INVADER_SPAWN_INTERVAL = 1600;
export const DIFFICULTY_0_INVADER_SPAWN_CHANCE = 0.1;
export const DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW = 2;
export const DIFFICULTY_0_INVADER_FIRING_DELAY = 2000;
export const DIFFICULTY_0_INVADER_MOVEMENT_DELAY = 2000;
export const DIFFICULTY_0_INVADER_FIRING_CHANCE = 0.005;
export const DIFFICULTY_0_INVADER_STEP_DOWN_CHANCE = 0.005;
export const DIFFICULTY_0_INVADER_STEP_SIDEWAYS_CHANCE = 0.01;

export const DIFFICULTY_0_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY = 400;

export const DIFFICULTY_0_BONUS_CHANCE = 0.0075;
export const DIFFICULTY_0_BONUS_MOVEMENT_DELAY = 1000;
export const DIFFICULTY_0_BONUS_POINT_VALUE = 10;

export const DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY = 400;
export const DIFFICULTY_0_MISSILE_BASE_MISSILE_COUNT = 2;

export const DIFFICULTY_0_MISSILE_MOVEMENT_DELAY = 200;
export const DIFFICULTY_0_MISSILE_COUNT = 2;

// difficulty 1
export const DIFFICULTY_1_INVADER_COUNT = 2;
export const DIFFICULTY_1_INVADER_SPAWN_INTERVAL = 1200;
export const DIFFICULTY_1_INVADER_SPAWN_CHANCE = 0.15;
export const DIFFICULTY_1_INVADER_LOWEST_STARTING_ROW = 2;
export const DIFFICULTY_1_INVADER_FIRING_DELAY = 1500;
export const DIFFICULTY_1_INVADER_MOVEMENT_DELAY = 1500;
export const DIFFICULTY_1_INVADER_FIRING_CHANCE = 0.075;
export const DIFFICULTY_1_INVADER_STEP_DOWN_CHANCE = 0.03;
export const DIFFICULTY_1_INVADER_STEP_SIDEWAYS_CHANCE = 0.03;

export const DIFFICULTY_1_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY = 300;

export const DIFFICULTY_1_BONUS_CHANCE = 0.0075;
export const DIFFICULTY_1_BONUS_MOVEMENT_DELAY = 800;
export const DIFFICULTY_1_BONUS_POINT_VALUE = 10;

export const DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY = 400;
export const DIFFICULTY_1_MISSILE_BASE_MISSILE_COUNT = 2;

export const DIFFICULTY_1_MISSILE_MOVEMENT_DELAY = 200;
export const DIFFICULTY_1_MISSILE_COUNT = 2;

// difficulty 2
export const DIFFICULTY_2_INVADER_COUNT = 2;
export const DIFFICULTY_2_INVADER_SPAWN_INTERVAL = 900;
export const DIFFICULTY_2_INVADER_SPAWN_CHANCE = 0.2;
export const DIFFICULTY_2_INVADER_LOWEST_STARTING_ROW = 3;
export const DIFFICULTY_2_INVADER_FIRING_DELAY = 1200;
export const DIFFICULTY_2_INVADER_MOVEMENT_DELAY = 1200;
export const DIFFICULTY_2_INVADER_FIRING_CHANCE = 0.1;
export const DIFFICULTY_2_INVADER_STEP_DOWN_CHANCE = 0.05;
export const DIFFICULTY_2_INVADER_STEP_SIDEWAYS_CHANCE = 0.05;

export const DIFFICULTY_2_DEATH_RAY_COUNT = 2;
export const DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY = 200;

export const DIFFICULTY_2_BONUS_CHANCE = 0.0075;
export const DIFFICULTY_2_BONUS_MOVEMENT_DELAY = 600;
export const DIFFICULTY_2_BONUS_POINT_VALUE = 10;

export const DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY = 350;
export const DIFFICULTY_2_MISSILE_BASE_FIRING_DELAY = 400;
export const DIFFICULTY_2_MISSILE_BASE_MISSILE_COUNT = 2;

export const DIFFICULTY_2_MISSILE_MOVEMENT_DELAY = 200;
export const DIFFICULTY_2_MISSILE_COUNT = 2;

export default class DifficultySetting extends VFDGameObject
{
    public static instance: DifficultySetting;
    public onDifficultyChanged: Array<(difficultySetting:DifficultySetting, difficulty:number) => void> = new Array<(difficultySetting:DifficultySetting, difficulty:number) => void>();

    private _currentDifficulty: number;
    private difficultyData: ReadonlyArray<DifficultyData> =
        [
            {
                invaderCount: DIFFICULTY_0_INVADER_COUNT,
                invaderLowestStartingRow: DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY_0_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY_0_INVADER_SPAWN_CHANCE,
                invaderMovementDelay: DIFFICULTY_0_INVADER_MOVEMENT_DELAY,
                invaderFiringChance: DIFFICULTY_0_INVADER_FIRING_CHANCE,
                invaderFiringDelay: DIFFICULTY_0_INVADER_FIRING_DELAY,
                invaderStepDownChance: DIFFICULTY_0_INVADER_STEP_DOWN_CHANCE,
                invaderStepSidewaysChance: DIFFICULTY_0_INVADER_STEP_SIDEWAYS_CHANCE,

                deathRayCount: DIFFICULTY_0_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY,

                bonusChance: DIFFICULTY_0_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY_0_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_0_BONUS_POINT_VALUE,

                missileCount: DIFFICULTY_0_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_0_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY_1_INVADER_COUNT,
                invaderLowestStartingRow: DIFFICULTY_1_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY_1_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY_1_INVADER_SPAWN_CHANCE,
                invaderMovementDelay: DIFFICULTY_1_INVADER_MOVEMENT_DELAY,
                invaderFiringChance: DIFFICULTY_1_INVADER_FIRING_CHANCE,
                invaderFiringDelay: DIFFICULTY_1_INVADER_FIRING_DELAY,
                invaderStepDownChance: DIFFICULTY_1_INVADER_STEP_DOWN_CHANCE,
                invaderStepSidewaysChance: DIFFICULTY_1_INVADER_STEP_SIDEWAYS_CHANCE,

                deathRayCount: DIFFICULTY_1_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY,

                bonusChance: DIFFICULTY_1_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY_1_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_1_BONUS_POINT_VALUE,

                missileCount: DIFFICULTY_1_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_1_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY_2_INVADER_COUNT,
                invaderLowestStartingRow: DIFFICULTY_2_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY_2_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY_2_INVADER_SPAWN_CHANCE,
                invaderMovementDelay: DIFFICULTY_2_INVADER_MOVEMENT_DELAY,
                invaderFiringChance: DIFFICULTY_2_INVADER_FIRING_CHANCE,
                invaderFiringDelay: DIFFICULTY_2_INVADER_FIRING_DELAY,
                invaderStepDownChance: DIFFICULTY_2_INVADER_STEP_DOWN_CHANCE,
                invaderStepSidewaysChance: DIFFICULTY_2_INVADER_STEP_SIDEWAYS_CHANCE,

                deathRayCount: DIFFICULTY_2_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY,

                bonusChance: DIFFICULTY_2_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY_2_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY_2_BONUS_POINT_VALUE,

                missileCount: DIFFICULTY_2_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY_2_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY_2_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY
            }
        ];

    public init()
    {
        DifficultySetting.instance = this;
    }

    public reset()
    {
        this._currentDifficulty = 0;
    }

    get currentDifficulty(): number
    {
        return this._currentDifficulty;
    }

    set currentDifficulty(value: number)
    {
        value = Clamp.between(value, DIFFICULTY_MIN, DIFFICULTY_MAX);
        this._currentDifficulty = value;
        this.dispatchOnDifficultyChanged();
        // TODO send a network event
    }

    public static get difficulty(): DifficultyData
    {
        return DifficultySetting.instance.difficultyData[DifficultySetting.instance._currentDifficulty];
    }

    private dispatchOnDifficultyChanged()
    {
        for (let callback of this.onDifficultyChanged)
        {
            callback(this, this._currentDifficulty);
        }

    }
}
