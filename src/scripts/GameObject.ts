export class GameObject
{
    public x: number;
    public y: number;
    protected context;
    constructor()
    {
        this.x = 0;
        this.y = 0;
    }

    public initContext(context)
    {
        this.context = context;
    }

    public start()
    {

    }

    public update(secondsPassed: number)
    {

    }

    public draw()
    {

    }
}
