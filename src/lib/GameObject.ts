// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {Container} from "pixi.js";
import GameWorld from "./GameWorld";
import Component from "./Component";
import GameBehaviour from "./GameBehaviour";

export default class GameObject
{
    public container: Container;
    public _components: Array<Component>;
    protected __isEnabled: boolean = true;
    protected __hasStarted: boolean = false;
    protected __hasInitialised: boolean = false;
    public onDestroyed: Array<(gameObject: GameObject) => void> = new Array<(gameObject: GameObject) => void>();
    public onEnabled: Array<(gameObject: GameObject) => void> = new Array<(gameObject: GameObject) => void>();
    public onDisabled: Array<(gameObject: GameObject) => void> = new Array<(gameObject: GameObject) => void>();
    public collisionMask: number = 0;
    public collisionFlags: number = 0;
    public onShown: Array<(gameObject: GameObject) => void> = new Array<(gameObject: GameObject) => void>();
    public onHidden: Array<(gameObject: GameObject) => void> = new Array<(gameObject: GameObject) => void>();

    public static createGameObject<T extends GameObject>(goType: { new(): T }): T
    {
        let go = new goType();
        go._components = new Array<Component>();
        go.container = new Container();
        GameWorld.app.stage.addChild(go.container);
        GameWorld.instance.gameObjects.push(go);
        go.init();
        go.reset();
        go.__hasInitialised = true;
        if (go.enabled)
        {
            go.dispatchOnEnabled();
        }

        return (go);
    }

    public addComponent<Type extends Component>(componentType: { new(): Type }): Type
    {
        let component = new componentType();
        this._components.push(component);
        component._init();
        component._reset();

        return (component);
    }

    public init()
    {
        // do nothing
    }

    public reset()
    {
        // do nothing
    }

    public _start()
    {
        if (!this.__isEnabled)
        {
            return;
        }

        if (this.__hasStarted)
        {
            return;
        }

        this.start();
        this.__hasStarted = true;

    }

    public start()
    {
        // do nothing
    }

    public destroy()
    {
        this.enabled = false;
        for (let component of this._components)
        {
            if (component instanceof GameBehaviour)
            {
                (component as GameBehaviour).enabled = false;
            }

        }

        for (let component of this._components)
        {
            component.destroy();
        }

        this.dispatchOnDestroyed();
        this.container.destroy({children: true});
    }

    // late update always runs but only after all other update functions
    public _update(secondsPassed: number)
    {
        if (!this.enabled)
        {
            return;
        }

        this._start();
        this.update(secondsPassed);
        for (let component of this._components)
        {
            if (component instanceof GameBehaviour)
            {
                (component as GameBehaviour)._update(secondsPassed);
            }

        }

    }

    public update(secondsPassed: number)
    {
        // do nothing
    }

    // late update always runs but only after all other update functions
    public _lateUpdate(secondsPassed: number)
    {
        this.lateUpdate(secondsPassed);
        for (let component of this._components)
        {
            if (component instanceof GameBehaviour)
            {
                //     let behaviour = component as GameBehaviour;
                (component as GameBehaviour)._lateUpdate(secondsPassed);
            }
        }

    }

    public lateUpdate(secondsPassed: number)
    {
        // do nothing
    }

    public onCollision(other: GameObject)
    {
        // do nothing
    }

    public get enabled(): boolean
    {
        return this.__isEnabled;
    }

    public set enabled(value: boolean)
    {
        if (value == this.__isEnabled)
        {
            return;
        }

        this.__isEnabled = value;
        if (this.__isEnabled)
        {
            // this.show();
            this.dispatchOnEnabled();
            // TODO send network event
        }
        else
        {
            // this.hide();
            this.dispatchOnDisabled();
            // TODO send network event

        }

    }

    public hide()
    {
        this.container.visible = false;
        this.dispatchOnHide();
        // TODO send network event
    }

    public show()
    {
        this.container.visible = true;
        this.dispatchOnShow();
        // TODO send network event
    }

    protected dispatchOnShow()
    {
        this.onShow();
        for (let callback of this.onShown)
        {
            callback(this);
        }

        GameWorld.instance.events.emit('show', this);
    }

    protected dispatchOnHide()
    {
        this.onHide();
        for (let callback of this.onHidden)
        {
            callback(this);
        }

        GameWorld.instance.events.emit('hide', this);
    }

    protected dispatchOnEnabled()
    {
        this.onEnable();
        for (let callback of this.onEnabled)
        {
            callback(this);
        }

        GameWorld.instance.events.emit('enabled', this);
    }

    protected dispatchOnDisabled()
    {
        this.onDisable();
        for (let callback of this.onDisabled)
        {
            callback(this);
        }

        GameWorld.instance.events.emit('disabled', this);
    }

    public onDestroy()
    {
        // do nothing
    }

    protected dispatchOnDestroyed()
    {
        this.onDestroy();
        for (let callback of this.onDestroyed)
        {
            callback(this);
        }

        GameWorld.instance.events.emit('destroyed', this);
    }

    private onShow()
    {
        // do nothing
    }

    private onDisable()
    {
        // do nothing
    }

    private onEnable()
    {
        // do nothing
    }

    private onHide()
    {
        // do nothing
    }
}

