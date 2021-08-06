import GameObject from "./GameObject";
import Bonus from "./Bonus";

export default class BonusController extends GameObject
{
    bonus: Bonus;

    public init()
    {
        this.bonus = GameObject.createGameObject(Bonus);
        this.bonus.enabled = false;
    }

    public reset()
    {
        this.bonus.reset();
    }

    public update(secondsPassed:number)
    {
        if (this.bonus.shouldEnterPlayfield)
        {
            this.bonus.enterPlayfield();
        }


    }
}
