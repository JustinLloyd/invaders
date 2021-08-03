import {Validation} from "./Validation";

export class Random
{
    public next(): number
    {
        return Math.random();
    }

    public int(min?: number, max?: number): number
    {
        return this.nextInt(min, max);
    }

    public nextInt(min?: number, max?: number): number
    {
        if (min != undefined && max != undefined)
        {
            Validation.gt(max, min);
        }

        Validation.int(min);
        Validation.int(max);
        return Math.floor(this.next() * (max - min) + min);
    }

    public nextIntExclusive(min?: number, max?: number): number
    {
        return (this.nextInt(min, max));
    }

    public nextIntInclusive(min?: number, max?: number): number
    {
        if (min != undefined && max != undefined)
        {
            Validation.gt(max, min);
        }

        Validation.int(min);
        Validation.int(max);
        return Math.floor(this.next() * (max - min + 1) + min);
    }

    public float(min?: number, max?: number): number
    {
        return this.nextFloat(min, max);
    }

    public nextFloat(min?: number, max?: number): number
    {
        if (min != undefined && max != undefined)
        {
            Validation.gt(max, min);
        }

        return this.next() * (max - min) + min;
    }

    public boolean(): boolean
    {
        return (this.next() >= 0.5);
    }
}
