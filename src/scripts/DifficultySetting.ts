// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import DifficultyData from "./DifficultyData";
import {
    DIFFICULTY_INDICATOR_X_OFFSET,
    DIFFICULTY_INDICATOR_Y_OFFSET,
    DIFFICULTY_MAX,
    DIFFICULTY_MIN,
    TEXTURE_DIFFICULTY_INDICATOR_00,
    TEXTURE_DIFFICULTY_INDICATOR_01,
    TEXTURE_DIFFICULTY_INDICATOR_02
} from "./Constants";

import * as DIFFICULTY from "./DifficultyConstants";

import Clamp from "../lib/Clamp";
import VFDGameObject from '../lib/VFDGameObject';
import {Sprite, utils} from 'pixi.js';
import Validation from '../lib/Validation';


let TextureCache = utils.TextureCache;

export default class DifficultySetting extends VFDGameObject
{
    public static instance: DifficultySetting;
    public onDifficultyChanged: Array<(difficultySetting:DifficultySetting, difficulty:number) => void> = new Array<(difficultySetting:DifficultySetting, difficulty:number) => void>();
    indicatorSprite: Sprite;
    indicatorTextureNames: Array<string>;

    private _currentDifficulty: number;
    private difficultyData: ReadonlyArray<DifficultyData> =
        [
            {
                invaderCount: DIFFICULTY.DIFFICULTY_0_INVADER_COUNT,
                invaderLowestStartingRow: DIFFICULTY.DIFFICULTY_0_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY.DIFFICULTY_0_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY.DIFFICULTY_0_INVADER_SPAWN_CHANCE,
                invaderMovementDelay: DIFFICULTY.DIFFICULTY_0_INVADER_MOVEMENT_DELAY,
                invaderFiringChance: DIFFICULTY.DIFFICULTY_0_INVADER_FIRING_CHANCE,
                invaderFiringDelay: DIFFICULTY.DIFFICULTY_0_INVADER_FIRING_DELAY,
                invaderStepDownChance: DIFFICULTY.DIFFICULTY_0_INVADER_STEP_DOWN_CHANCE,
                invaderStepSidewaysChance: DIFFICULTY.DIFFICULTY_0_INVADER_STEP_SIDEWAYS_CHANCE,

                deathRayCount: DIFFICULTY.DIFFICULTY_0_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY.DIFFICULTY_0_DEATH_RAY_MOVEMENT_DELAY,

                bonusChance: DIFFICULTY.DIFFICULTY_0_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY.DIFFICULTY_0_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY.DIFFICULTY_0_BONUS_POINT_VALUE,

                missileCount: DIFFICULTY.DIFFICULTY_0_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY.DIFFICULTY_0_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY.DIFFICULTY_0_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY.DIFFICULTY_0_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY.DIFFICULTY_1_INVADER_COUNT,
                invaderLowestStartingRow: DIFFICULTY.DIFFICULTY_1_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY.DIFFICULTY_1_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY.DIFFICULTY_1_INVADER_SPAWN_CHANCE,
                invaderMovementDelay: DIFFICULTY.DIFFICULTY_1_INVADER_MOVEMENT_DELAY,
                invaderFiringChance: DIFFICULTY.DIFFICULTY_1_INVADER_FIRING_CHANCE,
                invaderFiringDelay: DIFFICULTY.DIFFICULTY_1_INVADER_FIRING_DELAY,
                invaderStepDownChance: DIFFICULTY.DIFFICULTY_1_INVADER_STEP_DOWN_CHANCE,
                invaderStepSidewaysChance: DIFFICULTY.DIFFICULTY_1_INVADER_STEP_SIDEWAYS_CHANCE,

                deathRayCount: DIFFICULTY.DIFFICULTY_1_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY.DIFFICULTY_1_DEATH_RAY_MOVEMENT_DELAY,

                bonusChance: DIFFICULTY.DIFFICULTY_1_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY.DIFFICULTY_1_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY.DIFFICULTY_1_BONUS_POINT_VALUE,

                missileCount: DIFFICULTY.DIFFICULTY_1_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY.DIFFICULTY_1_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY.DIFFICULTY_1_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY.DIFFICULTY_1_MISSILE_BASE_MOVEMENT_DELAY
            },
            {
                invaderCount: DIFFICULTY.DIFFICULTY_2_INVADER_COUNT,
                invaderLowestStartingRow: DIFFICULTY.DIFFICULTY_2_INVADER_LOWEST_STARTING_ROW,
                invaderSpawnInterval: DIFFICULTY.DIFFICULTY_2_INVADER_SPAWN_INTERVAL,
                invaderSpawnChance: DIFFICULTY.DIFFICULTY_2_INVADER_SPAWN_CHANCE,
                invaderMovementDelay: DIFFICULTY.DIFFICULTY_2_INVADER_MOVEMENT_DELAY,
                invaderFiringChance: DIFFICULTY.DIFFICULTY_2_INVADER_FIRING_CHANCE,
                invaderFiringDelay: DIFFICULTY.DIFFICULTY_2_INVADER_FIRING_DELAY,
                invaderStepDownChance: DIFFICULTY.DIFFICULTY_2_INVADER_STEP_DOWN_CHANCE,
                invaderStepSidewaysChance: DIFFICULTY.DIFFICULTY_2_INVADER_STEP_SIDEWAYS_CHANCE,

                deathRayCount: DIFFICULTY.DIFFICULTY_2_DEATH_RAY_COUNT,
                deathRayMovementDelay: DIFFICULTY.DIFFICULTY_2_DEATH_RAY_MOVEMENT_DELAY,

                bonusChance: DIFFICULTY.DIFFICULTY_2_BONUS_CHANCE,
                bonusMovementDelay: DIFFICULTY.DIFFICULTY_2_BONUS_MOVEMENT_DELAY,
                bonusPointValue: DIFFICULTY.DIFFICULTY_2_BONUS_POINT_VALUE,

                missileCount: DIFFICULTY.DIFFICULTY_2_MISSILE_COUNT,
                missileMovementDelay: DIFFICULTY.DIFFICULTY_2_MISSILE_MOVEMENT_DELAY,
                missileBaseFiringDelay: DIFFICULTY.DIFFICULTY_2_MISSILE_BASE_FIRING_DELAY,
                missileBaseMovementDelay: DIFFICULTY.DIFFICULTY_2_MISSILE_BASE_MOVEMENT_DELAY
            }
        ];

    public init()
    {
        DifficultySetting.instance = this;
        this.indicatorTextureNames = [TEXTURE_DIFFICULTY_INDICATOR_00, TEXTURE_DIFFICULTY_INDICATOR_01, TEXTURE_DIFFICULTY_INDICATOR_02];
        this.indicatorSprite = new Sprite(TextureCache[this.indicatorTextureNames[0]]);
        this.container.addChild(this.indicatorSprite);
        this.container.x = DIFFICULTY_INDICATOR_X_OFFSET;
        this.container.y = DIFFICULTY_INDICATOR_Y_OFFSET;

    }

    public reset()
    {
        this._currentDifficulty = 0;
//        this.changeTexturesForDifficulty(this._currentDifficulty);
    }

    get currentDifficulty(): number
    {
        return this._currentDifficulty;
    }

    set currentDifficulty(value: number)
    {
        if (value==this._currentDifficulty)
        {
            return;
        }

        value = Clamp.between(value, DIFFICULTY_MIN, DIFFICULTY_MAX);
        this._currentDifficulty = value;
        this.changeTexturesForDifficulty(value);
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

    private changeTexturesForDifficulty(difficulty: number)
    {
        Validation.range(difficulty, DIFFICULTY_MIN, DIFFICULTY_MAX);
        this.indicatorSprite.texture = TextureCache[this.indicatorTextureNames[difficulty]];
    }


}
