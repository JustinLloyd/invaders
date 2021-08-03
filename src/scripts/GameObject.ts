import * as PIXI from "pixi.js";
import GameWorld from "./GameWorld";
import {Sprite, filters, Container} from 'pixi.js';
import {GlowFilter} from 'pixi-filters';

// let Application = PIXI.Application,
//     Container = PIXI.Container,
//     loader = PIXI.Loader.shared,
//     resources = PIXI.Loader.shared.resources,
//     TextureCache = PIXI.utils.TextureCache,
//     Rectangle = PIXI.Rectangle;


export class Component
{

}

export class Behaviour extends Component
{

}

export class GameObject
{
    public container: Container;
    protected static blurFilter;
    protected static glowFilter;
    protected _isActive: boolean = true;
    public components: Array<Component>;
    public collisionMask: number = 0;
    public collisionFlags: number = 0;

    public static CreateGameObject<Type extends GameObject>(goType: { new(): Type }): Type
    {
        if (GameObject.blurFilter == null)
        {
            GameObject.blurFilter = new filters.BlurFilter();
            GameObject.blurFilter.blur = 1;
            GameObject.glowFilter = new GlowFilter();
            GameObject.glowFilter.outerStrength = 1;
            GameObject.glowFilter.color = 0x4080B0;
        }

        let go = new goType();
        GameWorld.instance.gameObjects.push(go);
        GameWorld.instance.__gameObjectsToStart.push(go);
        go.container = new Container();
        go.container.filters = [GameObject.blurFilter, GameObject.glowFilter];
        GameWorld.app.stage.addChild(go.container);
        go.init();
        go.reset();
        return go;
    }

    public static Destroy(go: GameObject)
    {
        GameWorld.instance.__gameObjectsToDestroy.push(go);
    }

    public init()
    {
        // do nothing
    }

    public reset()
    {
        // do nothing
    }

    public start()
    {
        // do nothing
    }

    // update always runs
    public update(secondsPassed: number)
    {
        // do nothing
    }

    // local update only runs on the localhost version of the game object
    public localUpdate(secondsPassed: number)
    {
        // do nothing
    }

    // network update only runs on the network input version of the game object
    public networkUpdate(secondsPassed: number)
    {
        // do nothing
    }

    // late update always runs but only after all other update functions
    public lateUpdate(secondsPassed: number)
    {
        // do nothing
    }

    public onDestroy()
    {
        // do nothing
    }

    public onCollision(other:GameObject)
    {
        // do nothing
    }

    public activate()
    {
        this._isActive = true;
        this.container.visible = true;
    }

    public deactivate()
    {
        this._isActive = false;
        this.container.visible = false;
    }

    public get isActive(): boolean
    {
        return this._isActive;
    }
}

