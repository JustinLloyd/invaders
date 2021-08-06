export default class Validation
{
    public static int(value: number)
    {
        if (Number.isInteger(value))
        {
            return;
        }

        throw new Error(`Value must be integer, but passed ${value}`);
    }

    public static positive(value: number)
    {
        if (value > 0)
        {
            return;
        }

        throw new Error(`Value must be positive, but passed ${value}`);
    }

    public static negative(value: number)
    {
        if (value < 0)
        {
            return;
        }

        throw new Error(`Value must be negative, but passed ${value}`);
    }

    public static range(value: number, lowerBound: number, upperBound: number)
    {
        if (value > lowerBound)
        {
            return;
        }

        throw new Error(`Value must be between ${lowerBound} and ${upperBound} but passed ${value}`);
    }

    public static lt(value: number, bound: number)
    {
        if (value < bound)
        {
            return;
        }

        throw new Error(`Value must be less than ${bound} but passed ${value}`);
    }

    public static lte(value: number, bound: number)
    {
        if (value <= bound)
        {
            return;
        }

        throw new Error(`Value must be less than or equal to ${bound} but passed ${value}`);
    }

    public static gt(value: number, bound: number)
    {
        if (value > bound)
        {
            return;
        }

        throw new Error(`Value must be greater than ${bound} but passed ${value}`);
    }

    public static gte(value: number, bound: number)
    {
        if (value >= bound)
        {
            return;
        }

        throw new Error(`Value must be greater than or equal to ${bound} but passed ${value}`);
    }

}
