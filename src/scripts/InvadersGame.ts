import * as $ from "jquery";
import "gsap";
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
    BOTTOM_ROW, INVADER_HIGHEST_ROW,
    LEFT_COLUMN, MAX_LIVES,
    MAX_POINTS, RIGHT_COLUMN,
    TEXTURE_BONUS_01,
    TEXTURE_BONUS_02,
    TEXTURE_BONUS_HIT_01,
    TEXTURE_BONUS_HIT_02,
    TEXTURE_DEATH_RAY_01,
    TEXTURE_DEATH_RAY_02,
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
import InvaderController from "./InvaderController";
import BonusController from "./BonusController";
import MissileBaseController from "./PlayerController";
import {EventDispatch} from './EventDispatch';

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
    invaderController: InvaderController;
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

    public callbackTest()
    {
        console.log("Callback test invoked")
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

    public onOutOfLives()
    {
        this.gameState = GameState.PlayerLost;
        this.invaderController.enabled = false;
        this.bonusController.enabled = false;
        this.missileBaseController.enabled = false;
    }

    public onPointsUpdated(points: number)
    {
        console.log("Points updated");
    }

    public onMaximumPoints(points: number)
    {
        console.log("Maximum points reached");
        this.gameState = GameState.PlayerWon;
        this.invaderController.enabled = false;
        this.bonusController.enabled = false;
        this.missileBaseController.enabled = false;
    }

    public createWorld()
    {
        this.playfield = GameObject.createGameObject(Playfield);
        this.difficulty = new DifficultySetting();

        // player lives setup
        this.livesIndicator = GameObject.createGameObject(LivesIndicator);
        this.livesIndicator.maximumLives = MAX_LIVES;
        this.livesIndicator.onOutOfLives.push(()=>this.onOutOfLives);

        // scoreboard setup
        this.scoreboard = GameObject.createGameObject(Scoreboard);
        this.scoreboard.maximumPoints = MAX_POINTS;
        this.scoreboard.onPointsUpdated.push( (points) => this.onPointsUpdated(points));
        this.scoreboard.onMaximumPointsAchieved.push( (points) => this.onMaximumPoints(points));

        // bonus setup
        this.bonusController = GameObject.createGameObject(BonusController);
        this.bonusController.bonus.onDead.push( (bonus) => this.scoreboard.addPoints(bonus.pointValue));

        // missile base setup
        this.missileBaseController = GameObject.createGameObject(MissileBaseController);

        // invaders setup
        this.invaderController = GameObject.createGameObject(InvaderController);
        this.invaderController.invadersPool.forEach(value => value.onDead.push(this.onInvaderKilled));
        this.invaderController.invadersPool.forEach(value => value.onLanded.push(this.onInvaderLanded));

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

    public onPlayerKilled()
    {
        this.livesIndicator.deductLife();
        if (this.livesIndicator.lives == 0)
        {
            this.gameState = GameState.PlayerLost;
        }
    }

    public onInvaderLanded(invader: Invader)
    {
        this.gameState = GameState.PlayerLost;
        this.invaderController.enabled = false;
        this.bonusController.enabled = false;
        this.missileBaseController.enabled = false;

    }

    public onInvaderKilled(invader: Invader)
    {
        this.scoreboard.addPoints(invader.pointValue);
    }

    protected update()
    {
        if (this.inputSystem.isDownReset())
        {
            console.log("Reset");
            this.reset();
            return;
        }

        if (this.isGameFinished)
        {
            GameWorld.app.stage.visible = !GameWorld.app.stage.visible;
            return;
        }

        // TODO determine if we should launch an invader here
        // determine if we should launch a bonus spaceship

        // TODO determine if the bonus spaceship hass been hit by a player missile

        // TODO determine if an invader has been hit by a player missile
        // TODO determine if an invader missile has hit the player
        // TODO determine if the invaders have landed here
        // TODO determine if the game is over when the player runs out of life here
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
        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            for (let y = INVADER_HIGHEST_ROW; y < BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(Invader);
                go.row = y;
                go.col = x;
            }
        }

        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            for (let y = INVADER_HIGHEST_ROW; y < BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(Invader);
                go.col = x;
                go.die();
                go.row = y;
            }
        }
        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            for (let y = TOP_ROW; y < BOTTOM_ROW; y++)
            {
                let go = GameObject.createGameObject(Missile);
                go.row = y;
                go.col = x;
            }
        }

        GameObject.createGameObject(DebugInfo);

        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            for (let y = INVADER_HIGHEST_ROW; y < 5; y++)
            {
                let go = GameObject.createGameObject(DeathRay);
                go.col = x;
                go.row = y;
            }
        }

        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            let go = GameObject.createGameObject(Bonus);
            go.col = x;
        }

        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            let go = GameObject.createGameObject(Bonus);
            go.die();
            go.col = x;
        }

        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            let go = GameObject.createGameObject(MissileBase);
            go.col = x;
        }

        for (let x = LEFT_COLUMN; x < RIGHT_COLUMN; x++)
        {
            let go = GameObject.createGameObject(MissileBase);
            go.col = x;
            go.die();
        }

    }
}

$(function ()
{
    let invaders = new InvadersGame();
    invaders.go();
});

