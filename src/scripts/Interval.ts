export default class Interval
{
    public delay: number = 1000;
    public lastUpdated: number = 0;

    constructor(delay?: number)
    {
        this.delay = delay;
    }

    public reset()
    {
        this.lastUpdated = 0;
    }

    public get hasElapsed():boolean
    {
        return ((Date.now() - this.lastUpdated) >= this.delay);
    }

    public update()
    {
        this.lastUpdated = Date.now();
    }

}
