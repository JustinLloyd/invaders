import GameObject from "./GameObject";
import Bonus from "./Bonus";
import VFDGameObject from './VFDGameObject';

export default class BonusController extends GameObject
{
    bonus: Bonus;

    public init()
    {
        this.bonus = VFDGameObject.createGameObject(Bonus);
        this.bonus.enabled = false;
        this.bonus.hide();
    }

    public shutdownGame()
    {
        this.enabled = false;
        this.bonus.enabled = false;
    }

    public reset()
    {
        this.bonus.reset();
    }

    public update(secondsPassed: number)
    {
        if (this.bonus.shouldEnterPlayfield)
        {
            this.bonus.enterPlayfield();
        }


    }

    public restartMission()
    {
        this.enabled=true;
        this.bonus.restartMission();
    }
}
