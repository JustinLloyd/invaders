import * as $ from "jquery";
import * as PIXI from 'pixi.js';
import GameObject from "./GameObject";
import Invader from "./Invader";
import DifficultySetting from "./DifficultySetting";
import DeathRay from "./DeathRay";
import Missile from "./Missile";
import MissileBase from "./MissileBase";
import Bonus from "./Bonus";
import Scoreboard from "./Scoreboard";
import LivesIndicator from "./LivesIndicator";
import GameWorld from "./GameWorld";
import GameObjectPool from "./GameObjectPool";
import Playfield from "./Playfield";
import DebugInfo from "./DebugInfo";
import {
    BOTTOM_ROW, COLUMN_COUNT, INVADER_HIGHEST_ROW,
    LEFT_COLUMN, MAX_LIVES,
    MAX_POINTS, RIGHT_COLUMN, SCOREBOARD_OFFSET_X, SCOREBOARD_OFFSET_Y, SCOREBOARD_STEP_X,
    TEXTURE_BONUS_01,
    TEXTURE_BONUS_02,
    TEXTURE_BONUS_HIT_01,
    TEXTURE_BONUS_HIT_02,
    TEXTURE_DEATH_RAY_01,
    TEXTURE_DEATH_RAY_02, TEXTURE_DIFFICULTY_INDICATOR_00, TEXTURE_DIFFICULTY_INDICATOR_01, TEXTURE_DIFFICULTY_INDICATOR_02,
    TEXTURE_DIGIT_00,
    TEXTURE_DIGIT_01,
    TEXTURE_DIGIT_02,
    TEXTURE_DIGIT_03,
    TEXTURE_DIGIT_04,
    TEXTURE_DIGIT_05,
    TEXTURE_DIGIT_06,
    TEXTURE_DIGIT_07,
    TEXTURE_DIGIT_08,
    TEXTURE_DIGIT_09,
    TEXTURE_INVADER_01,
    TEXTURE_INVADER_02,
    TEXTURE_INVADER_HIT,
    TEXTURE_INVADER_LANDED,
    TEXTURE_LIVES_INDICATOR,
    TEXTURE_MISSILE,
    TEXTURE_MISSILE_BASE,
    TEXTURE_MISSILE_BASE_ARMED,
    TEXTURE_MISSILE_BASE_HIT,
    TEXTURE_VFD_PLAYFIELD, TOP_ROW
} from "./Constants";
import PlayfieldGameWorld from "./PlayfieldGameWorld";
import InvaderSpawner from "./InvaderSpawner";
import BonusController from "./BonusController";
import MissileBaseController from "./PlayerController";
import VFDGameObject from './VFDGameObject';

let invader_01 = require('url:../assets/invader-01.png');
let invader_02 = require('url:../assets/invader-02.png');
let invader_landed = require('url:../assets/invader-landed.png');
let death_ray_01 = require('url:../assets/death-ray-01.png');
let death_ray_02 = require('url:../assets/death-ray-02.png');
let invader_hit = require('url:../assets/invader-hit.png');

let lives_indicator = require('url:../assets/lives-indicator.png');
let bonus_01 = require('url:../assets/bonus-01.png');
let bonus_02 = require('url:../assets/bonus-02.png');
let bonus_hit_01 = require('url:../assets/bonus-hit-01.png');
let bonus_hit_02 = require('url:../assets/bonus-hit-02.png');

let missile = require('url:../assets/missile.png');
let missile_base = require('url:../assets/missile-base.png');
let missile_base_armed = require('url:../assets/missile-base-armed.png');
let missile_base_hit = require('url:../assets/missile-base-hit.png');

let difficulty_indicator_00 = require('url:../assets/difficulty-indicator-00.png');
let difficulty_indicator_01 = require('url:../assets/difficulty-indicator-01.png');
let difficulty_indicator_02 = require('url:../assets/difficulty-indicator-02.png');

let vfd_playfield = require('url:../assets/vfd-playfield.png');

let digit_00 = require('url:../assets/digit-00.png');
let digit_01 = require('url:../assets/digit-01.png');
let digit_02 = require('url:../assets/digit-02.png');
let digit_03 = require('url:../assets/digit-03.png');
let digit_04 = require('url:../assets/digit-04.png');
let digit_05 = require('url:../assets/digit-05.png');
let digit_06 = require('url:../assets/digit-06.png');
let digit_07 = require('url:../assets/digit-07.png');
let digit_08 = require('url:../assets/digit-08.png');
let digit_09 = require('url:../assets/digit-09.png');

let Application = PIXI.Application,
    Container = PIXI.Container,
    resources = PIXI.Loader.shared.resources,
    loader = PIXI.Loader.shared,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

enum GameState
{
    Playing,
    PlayerWon,
    PlayerLosesLife,
    PlayerLost,

}

// interface TestArray<T>
// {
//     [position:number]:T;
//     length:number;
//     add(item:T):number;
// }
//
// class TestArrayClass<T> implements TestArray<T>
// {
//     [position: number]: T;
//
//     public length: number;
//
//     public add(item: T): number
//     {
//         this.push
//         return 0;
//     }
//
// }
//
class InvadersGame extends PlayfieldGameWorld
{
    difficulty: DifficultySetting;
    scoreboard: Scoreboard;
    livesIndicator: LivesIndicator;
    playfield: Playfield;
    invaderController: InvaderSpawner;
    gameState: GameState;
    private missileBaseController: MissileBaseController;
    private bonusController: BonusController;
    //dispatchTest:EventDispatch<(lives:number) => void> = new EventDispatch<(lives:number) => void>();
    //    public dispatchTest: Array<() => void> = new Array<() => void>() ;
    //    public dispatchTest2: (() => void)[] = [];

    init()
    {
        //this.dispatchTest2 = []
        // this.dispatchTest2.push(this.callbackTest)
        // this.dispatchTest.push(this.callbackTest);
        // this.dispatchTest2.forEach(callback => callback())
        this.createWorld();
    }

    public start()
    {
        this.missileBaseController.missileBase.onExitPlayfield.push((missileBase) => this.onPlayerKilled(missileBase));
        this.livesIndicator.onOutOfLives.push((livesIndicator: LivesIndicator) => this.onOutOfLives(livesIndicator));
        this.difficulty.onDifficultyChanged.push((difficultySetting: DifficultySetting, difficulty: number) => this.onDifficultyChanged(difficultySetting, difficulty));
        this.scoreboard.onPointsUpdated.push((scoreboard: Scoreboard, points: number) => this.onPointsUpdated(scoreboard, points));
        this.scoreboard.onMaximumPointsAchieved.push((scoreboard: Scoreboard, points: number) => this.onMaximumPoints(scoreboard, points));
        this.bonusController.bonus.onDead.push((bonus) => this.scoreboard.addPoints(bonus.pointValue));
        this.invaderController.invadersPool.forEach(value => value.onDead.push(this.onInvaderKilled.bind(this)));
        this.invaderController.invadersPool.forEach(value => value.onLanded.push(this.onInvaderLanded.bind(this)));
        if (this.isDebug)
        {
            this.scoreboard.points = MAX_POINTS - 10;
        }
    }

    private restartMission()
    {
        this.missileBaseController.restartMission();
        this.invaderController.restartMission();
        this.bonusController.restartMission();
    }

    public onPlayerKilled(missileBase: MissileBase)
    {
        this.livesIndicator.deductLife();
        if (this.gameState == GameState.PlayerLost)
        {
            return;
        }
        this.restartMission();
    }

    public resetGame()
    {
        this.makeVFDObjectsPulse();
        this.gameState = GameState.Playing;
        this.livesIndicator.reset();

        this.scoreboard.reset();
        this.invaderController.reset();
        this.invaderController.restartMission();
        this.bonusController.reset();
        this.bonusController.restartMission();
        this.missileBaseController.reset();
        this.missileBaseController.restartMission();
    }

    public makeVFDObjectsPulse()
    {
        for (let go of this.gameObjects)
        {
            if (go instanceof VFDGameObject)
            {
                (go as VFDGameObject).flicker();
            }
        }
    }

    public makeVFDObjectsFlicker()
    {
        for (let go of this.gameObjects)
        {
            if (go instanceof VFDGameObject)
            {
                (go as VFDGameObject).fastblink();
            }
        }
    }


    reset()
    {
        this.gameState = GameState.Playing;
        this.livesIndicator.reset();
        this.scoreboard.reset();
        this.invaderController.reset();
        this.invaderController.enabled = true;
        this.bonusController.reset();
        this.bonusController.enabled = true;
        this.missileBaseController.reset();
        this.missileBaseController.enabled = true;
        //this.scoreboard.points = MAX_POINTS - 10;
        // TODO if the number of death rays on the new difficulty is different than previously, then adjust the pool
        //this.deathRaysPool.forEach(value => value.reset());
    }

    public onOutOfLives(livesIndicator: LivesIndicator): void
    {
        this.gameState = GameState.PlayerLost;
        this.shutdownGame();
    }

    public onPointsUpdated(scoreboard: Scoreboard, points: number): void
    {
        // do nothing
    }

    public onMaximumPoints(scoreboard: Scoreboard, points: number): void
    {
        this.gameState = GameState.PlayerWon;
        this.shutdownGame();
    }

    public createWorld()
    {
        this.difficulty = VFDGameObject.createGameObject(DifficultySetting);
        this.playfield = GameObject.createGameObject(Playfield);

        // player lives setup
        this.livesIndicator = VFDGameObject.createGameObject(LivesIndicator);
        this.livesIndicator.maximumLives = MAX_LIVES;

        // scoreboard setup
        this.scoreboard = VFDGameObject.createGameObject(Scoreboard);
        this.scoreboard.maximumPoints = MAX_POINTS;

        // bonus setup
        this.bonusController = GameObject.createGameObject(BonusController);

        // missile base setup
        this.missileBaseController = GameObject.createGameObject(MissileBaseController);

        // invaders setup
        this.invaderController = GameObject.createGameObject(InvaderSpawner);

        // TODO if the number of death rays on the new difficulty is different than previously, then adjust the pool
        if (this.isDebug)
        {
            this.ValidateSpritePlacements();
        }

    }

    protected get isGameFinished(): boolean
    {
        return (this.gameState == GameState.PlayerWon || this.gameState == GameState.PlayerLost);
    }

    public onInvaderLanded(invader: Invader)
    {
        this.gameState = GameState.PlayerLost;
        this.shutdownGame();
    }

    public onInvaderKilled(invader: Invader)
    {
        this.scoreboard.addPoints(invader.pointValue);
    }

    protected update()
    {
        if (this.inputSystem.isDownReset())
        {
            this.resetGame();
            return;
        }

    }

    protected onDifficultyChanged(difficultySetting: DifficultySetting, difficulty: number)
    {
        this.resetGame();
    }

    public loadAssets()
    {
        loader
            // invaders
            .add(TEXTURE_INVADER_01, invader_01)
            .add(TEXTURE_INVADER_02, invader_02)
            .add(TEXTURE_INVADER_LANDED, invader_landed)
            .add(TEXTURE_DEATH_RAY_01, death_ray_01)
            .add(TEXTURE_DEATH_RAY_02, death_ray_02)
            .add(TEXTURE_INVADER_HIT, invader_hit)

            // bonus ufo
            .add(TEXTURE_BONUS_01, bonus_01)
            .add(TEXTURE_BONUS_02, bonus_02)
            .add(TEXTURE_BONUS_HIT_01, bonus_hit_01)
            .add(TEXTURE_BONUS_HIT_02, bonus_hit_02)

            // player
            .add(TEXTURE_MISSILE_BASE, missile_base)
            .add(TEXTURE_MISSILE_BASE_ARMED, missile_base_armed)
            .add(TEXTURE_MISSILE, missile)
            .add(TEXTURE_LIVES_INDICATOR, lives_indicator)
            .add(TEXTURE_MISSILE_BASE_HIT, missile_base_hit)

            .add(TEXTURE_DIFFICULTY_INDICATOR_00, difficulty_indicator_00)
            .add(TEXTURE_DIFFICULTY_INDICATOR_01, difficulty_indicator_01)
            .add(TEXTURE_DIFFICULTY_INDICATOR_02, difficulty_indicator_02)

            // scoreboard
            .add(TEXTURE_DIGIT_00, digit_00)
            .add(TEXTURE_DIGIT_01, digit_01)
            .add(TEXTURE_DIGIT_02, digit_02)
            .add(TEXTURE_DIGIT_03, digit_03)
            .add(TEXTURE_DIGIT_04, digit_04)
            .add(TEXTURE_DIGIT_05, digit_05)
            .add(TEXTURE_DIGIT_06, digit_06)
            .add(TEXTURE_DIGIT_07, digit_07)
            .add(TEXTURE_DIGIT_08, digit_08)
            .add(TEXTURE_DIGIT_09, digit_09)

            // playfield
            .add(TEXTURE_VFD_PLAYFIELD, vfd_playfield);

    }

    private ValidateSpritePlacements()
    {
        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            for (let y = INVADER_HIGHEST_ROW; y <= BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(Invader);
                go.row = y;
                go.col = x;
                go.enabled = false;
            }
        }

        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            for (let y = INVADER_HIGHEST_ROW; y < BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(Invader);
                go.col = x;
                go.row = y;
                go.showDead();
                go.enabled = false;
            }
        }
        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            for (let y = TOP_ROW; y < BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(Missile);
                go.row = y;
                go.col = x;
                go.enabled = false;
            }
        }

        GameObject.createGameObject(DebugInfo);

        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            for (let y = INVADER_HIGHEST_ROW; y < BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(DeathRay);
                go.col = x;
                go.row = y;
                go.enabled = false;
            }
        }

        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            let go = GameObject.createGameObject(Bonus);
            go.col = x;
            go.enabled = false;
        }

        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            let go = GameObject.createGameObject(Bonus);
            go.col = x;
            go.die();
            go.enabled = false;
        }

        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            let go = GameObject.createGameObject(MissileBase);
            go.col = x;
            go.enabled = false;
        }

        for (let x = LEFT_COLUMN; x < COLUMN_COUNT; x++)
        {
            let go = GameObject.createGameObject(MissileBase);
            go.col = x;
            go.die();
            go.enabled = false;
        }

    }

    private shutdownGame()
    {
        this.invaderController.shutdownGame();
        this.bonusController.shutdownGame();
        this.missileBaseController.shutdownGame();
        this.makeVFDObjectsFlicker();
    }
}

$(function ()
{
    let invaders = new InvadersGame();
    invaders.go();
});

