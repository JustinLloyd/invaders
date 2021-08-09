export default class Component
{
    public onDestroyed: Array<(component: Component) => void> = new Array<(component: Component) => void>();

    public _init()
    {
        this.init();
    }

    public _reset()
    {
        this._reset();
    }

    public init()
    {
        // do nothing
    }

    public reset()
    {
        // do nothing
    }

    public destroy()
    {
        this.dispatchOnDestroyed();
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

    }


}
