import GameObject from "./GameObject";
import GameWorld from "./GameWorld";
import MissileBase from "./MissileBase";


export default class MissileBaseController extends GameObject
{
    missileBase: MissileBase;

    public init()
    {
        this.missileBase = GameObject.createGameObject(MissileBase);
    }

    public reset()
    {
        this.missileBase.reset();
    }

    public update(secondsPassed: number)
    {
        if (GameWorld.instance.inputSystem.isDownFire())
        {
            console.log("Fire");
            this.missileBase.fireIfCan();
        }

        if (GameWorld.instance.inputSystem.isDownMoveLeft())
        {
            this.missileBase.moveLeftIfCan();
        }
        else if (GameWorld.instance.inputSystem.isDownMoveRight())
        {
            this.missileBase.moveRightIfCan();
        }
        else
        {
            this.missileBase.moveCenterIfCan();
        }

    }
}
