// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import * as PIXI from 'pixi.js';
import * as $ from "jquery";
import {gsap} from "gsap";
import {PixiPlugin}  from "gsap/PixiPlugin";
import GameObject from "./GameObject";
import InputSystem from "./InputSystem";
import {GAME_SCALE} from "../scripts/Constants";
import {EventEmitter, EventEmitterStatic} from 'eventemitter3';

let loader = PIXI.Loader.shared;

// prevent tree shaking in production builds (not sure if needed)
//const plugins = [PixiPlugin];


export default abstract class GameWorld
{
    events:any;
    protected isDebug: boolean = false;
    protected isCheatEnabled: boolean = false;
    public isLocal: boolean;
    public static instance: GameWorld;
    protected _gameScale:number=1.0;
    protected _viewportWidth:number=640;
    protected _viewportHeight:number=480;
    canvas: HTMLCanvasElement;
    gameObjects: Array<GameObject>;
    // __gameObjectsToStart: Array<GameObject>;f
    // __gameBehavioursToStart: Array<Component>;
    // __gameObjectsToDestroy: Array<GameObject>;
    public static app: PIXI.Application;
    public inputSystem: InputSystem;

    constructor()
    {
        this.isLocal = true;
        this.canvas = null;
        this.gameObjects = new Array<GameObject>();
        // this.__gameObjectsToStart = new Array<GameObject>();
        // this.__gameObjectsToDestroy = new Array<GameObject>();
        GameWorld.instance = this;
    }

    protected initGameEngine()
    {
        this.events = new EventEmitter();
        this.inputSystem = new InputSystem();
        GameWorld.app = new PIXI.Application({width: this._viewportWidth*this._gameScale, height: this._viewportHeight*this._gameScale, autoStart: false, sharedLoader: true});
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        GameWorld.app.ticker.maxFPS = 30;
        GameWorld.app.stage.scale.set(this._gameScale);
        // GameWorld.app.view.style.width="200px";
        // GameWorld.app.view.style.height="500px";
        // GameWorld.app.renderer.resize(200, 500);
        $("#playfield").append(GameWorld.app.view);
        GameWorld.app.stop();
    }

    private onAssetsLoaded()
    {
        this.init();
        this.reset();
        this.start();
        GameWorld.app.ticker.add(secondsPassed => this.tick(secondsPassed));
        GameWorld.app.start();
    }


    go()
    {
        this.initGameEngine();
        this.loadAssets();
        loader.load(this.onAssetsLoaded.bind(this));

    }

    public loadAssets()
    {
        // do nothing
    }

    public reset()
    {
        // do nothing
    }

    public init()
    {
        // do nothing
    }

    public start()
    {
        // do nothing
    }

    protected _update(secondsPassed: number)
    {
        this.inputSystem.update();
        this.update(secondsPassed);
        for (let gameObject of this.gameObjects)
        {
            gameObject._update(secondsPassed);
        }

    }

    protected tick(secondsPassed: number)
    {
        GameWorld.instance.gameLoop(secondsPassed);
    }

    gameLoop(secondsPassed: number)
    {
        // this._start();
        this._update(secondsPassed);
        this.detectCollisions();

        this._lateUpdate(secondsPassed);
        // this._cleanupGameObjects();
    }

    protected lateUpdate(secondsPassed: number)
    {
        // do nothing
    }

    protected update(secondsPassed: number)
    {
        // do nothing
    }

    // protected localUpdate(secondsPassed: number)
    // {
    //     // do nothing
    // }

    // protected networkUpdate(secondsPassed: number)
    // {
    //     // do nothing
    // }

    // naive collisin detector
    protected detectCollisions()
    {
        if (this.gameObjects.length <= 1)
        {
            return;
        }

        for (let i = 0; i < this.gameObjects.length - 1; i++)
        {
            let thisOne = this.gameObjects[i];
            if (!thisOne.enabled)
            {
                continue;
            }

            for (let j = i + 1; j < this.gameObjects.length; j++)
            {
                let thatOne = this.gameObjects[j];
                if (!thatOne.enabled)
                {
                    continue;
                }
                let collisionFlags = thisOne.collisionFlags;
                let collisionMask = thatOne.collisionMask;
                if ((collisionFlags & collisionMask) != 0)
                {
                    if (this.isColliding(thisOne, thatOne))
                    {
                        thisOne.onCollision(thatOne);
                        thatOne.onCollision(thisOne);
                    }
                }
            }

        }
    }

    protected isColliding(gameObject: GameObject, gameObject2: GameObject)
    {
        return false;
    }

    private _cleanupGameObjects()
    {
        // this.__gameObjectsToDestroy.forEach(value =>
        // {
        //     value.destroy();
        //     const index = this.gameObjects.indexOf(value, 0);
        //     if (index > -1)
        //     {
        //         this.gameObjects.splice(index, 1);
        //     }
        //
        // });
        //
        // this.__gameObjectsToDestroy.length = 0;

    }

    private _lateUpdate(secondsPassed: number)
    {
        this.lateUpdate(secondsPassed);
        for (let gameObject of this.gameObjects)
        {
            gameObject._lateUpdate(secondsPassed);
        }

    }

    private _start()
    {
        // this.__gameObjectsToStart.forEach(value =>
        // {
        //     value._start();
        // });
        // this.__gameObjectsToStart.length = 0;

    }
}
