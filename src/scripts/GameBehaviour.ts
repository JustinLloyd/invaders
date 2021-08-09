import Behaviour from "./Behaviour";

export default class GameBehaviour extends Behaviour
{
    protected __isEnabled: boolean = true;
    protected __hasStarted: boolean = false;
    public onEnabled: Array<(gameBehaviour:GameBehaviour) => void>=new Array<(gameBehaviour:GameBehaviour) => void>()
    public onDisabled: Array<(gameBehaviour:GameBehaviour) => void>= new Array<(gameBehaviour:GameBehaviour) => void>();


    public _start()
    {
        if (this.__hasStarted)
        {
            return;
        }

        this.start();
        this.__hasStarted = true;
    }

    public _update(secondsPassed: number)
    {
        if (!this.__isEnabled)
        {
            return;
        }

        this._start();
        this.update(secondsPassed);
    }

    public start()
    {
        // do nothing
    }

    // update always runs
    // noinspection JSUnusedLocalSymbols
    public update(secondsPassed: number)
    {
        // do nothing
    }

    // noinspection JSUnusedLocalSymbols
    public lateUpdate(secondsPassed: number)
    {

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
            this._start();
            // GameWorld.instance.__gameBehavioursToStart.push(this);

            this.dispatchOnEnabled();
            // TODO send network event
        }
        else
        {
            this.dispatchOnDisabled();
            // TODO send network event

        }

    }

    protected dispatchOnEnabled()
    {
        for (let callback of this.onEnabled)
        {
            callback(this);
        }

    }

    protected dispatchOnDisabled()
    {
        for (let callback of this.onDisabled)
        {
            callback(this);
        }

    }

    public destroy()
    {
        this.enabled = false;

        super.destroy();
    }

    public _lateUpdate(secondsPassed: number)
    {
        if (this.enabled)
        {
            this.lateUpdate(secondsPassed);
        }

    }
}
