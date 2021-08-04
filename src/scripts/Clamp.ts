export class Clamp
{
    public static atMost(value: number, bound: number): number
    {
        return Math.min(value, bound);
    }

    public static atLeast(value: number, bound: number): number
    {
        return Math.max(value, bound);
    }

    public static between(value: number, lowerBound: number, upperBound: number): number
    {
        return Math.min(upperBound, Math.max(lowerBound, value));
    }
}
