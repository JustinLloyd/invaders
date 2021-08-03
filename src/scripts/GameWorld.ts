import * as PIXI from 'pixi.js';
import * as $ from "jquery";
import {GameObject} from "./GameObject";
import {InputSystem} from "./InputSystem";


export abstract class GameWorld
{
    protected isDebug: boolean = false;
    protected isCheatEnabled: boolean = false;
    public isLocal: boolean;
    public static instance: GameWorld;
    frameCount: number = 0;
    frameRate: number = 0;
    canvas: HTMLCanvasElement;
    oldTimestamp: number;
    gameObjects: Array<GameObject>;
    __gameObjectsToStart: Array<GameObject>;
    __gameObjectsToDestroy: Array<GameObject>;
    public static app: PIXI.Application;
    public static foregroundContainer:PIXI.Container;
    public static backgroundContainer:PIXI.Container;
    inputSystem: InputSystem;
    lastBlinkTime:number;

    constructor()
    {
        this.isLocal = true;
        this.canvas = null;
        this.oldTimestamp = 0;
        this.gameObjects = new Array<GameObject>();
        this.__gameObjectsToStart = new Array<GameObject>();
        this.__gameObjectsToDestroy = new Array<GameObject>();
        this.inputSystem = new InputSystem();
        GameWorld.instance = this;
        this.initLibraries();
    }

    initLibraries()
    {
        GameWorld.app = new PIXI.Application({width: 1200, height: 1700, autoStart: false, sharedLoader: true});
        GameWorld.app.ticker.maxFPS = 30;
        //GameWorld.app.stage.scale.set(0.33);
        // GameWorld.app.view.style.width="200px";
        // GameWorld.app.view.style.height="500px";
        // GameWorld.app.renderer.resize(200, 500);
        $("#playfield").append(GameWorld.app.view);
        GameWorld.app.stop();
    }

    go()
    {
        GameWorld.app.ticker.add(delta => this.tick(delta));
        GameWorld.app.start();
    }

    public abstract init();

    tick(delta: number)
    {
        GameWorld.instance.gameLoop(delta);
    }

    gameLoop(delta: number)
    {
        this.__gameObjectsToStart.forEach(value =>
        {
            value.start();
        });
        this.__gameObjectsToStart.length = 0;
        this.detectCollisions();
        this.localUpdate(delta);
        this.networkUpdate(delta);
        this.gameObjects.forEach(value =>
        {
            if (value.isActive)
            {
                value.update(delta);
            }
        });
        if (this.isLocal)
        {
            this.gameObjects.forEach(value =>
            {
                if (value.isActive)
                {
                    value.localUpdate(delta);
                }
            });

            this.inputSystem.update();
        }
        else
        {
            this.gameObjects.forEach(value =>
            {
                if (value.isActive)
                {
                    value.networkUpdate(delta);
                }
            });
        }

        this.gameObjects.forEach(value =>
        {
            if (value.isActive)
            {
                value.lateUpdate(delta);
            }
        });
        this.lateUpdate(delta);
        this.__gameObjectsToDestroy.forEach(value =>
        {
            value.container.destroy({children: true});
            value.onDestroy();
            const index = this.gameObjects.indexOf(value, 0);
            if (index > -1)
            {
                this.gameObjects.splice(index, 1);
            }

        });

        this.__gameObjectsToDestroy.length = 0;
    }

    protected lateUpdate(delta: number)
    {
        // do nothing
    }

    protected update(delta: number)
    {
        // do nothing
    }

    protected localUpdate(delta: number)
    {
        // do nothing
    }

    protected networkUpdate(delta: number)
    {
        // do nothing
    }

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
            if (!thisOne.isActive)
            {
                continue;
            }

            for (let j = i + 1; j < this.gameObjects.length; j++)
            {
                let thatOne = this.gameObjects[j];
                if (!thatOne.isActive)
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
}

export default GameWorld;
