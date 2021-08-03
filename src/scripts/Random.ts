import {Validation} from "./Validation";

export class Random
{
    public static next(): number
    {
        return Math.random();
    }

    public static int(min?: number, max?: number): number
    {
        return this.nextInt(min, max);
    }

    public static nextInt(min?: number, max?: number): number
    {
        if (min != undefined && max != undefined)
        {
            Validation.gt(max, min);
        }

        Validation.int(min);
        Validation.int(max);
        return Math.floor(this.next() * (max - min) + min);
    }

    public static nextIntExclusive(min?: number, max?: number): number
    {
        return (this.nextInt(min, max));
    }

    public static nextIntInclusive(min?: number, max?: number): number
    {
        if (min != undefined && max != undefined)
        {
            Validation.gt(max, min);
        }

        Validation.int(min);
        Validation.int(max);
        return Math.floor(this.next() * (max - min + 1) + min);
    }

    public static float(min?: number, max?: number): number
    {
        return this.nextFloat(min, max);
    }

    public static nextFloat(min?: number, max?: number): number
    {
        if (min != undefined && max != undefined)
        {
            Validation.gt(max, min);
        }

        return this.next() * (max - min) + min;
    }

    public static boolean(): boolean
    {
        return (this.next() >= 0.5);
    }
}
