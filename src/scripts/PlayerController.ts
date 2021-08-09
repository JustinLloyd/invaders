import GameObject from "./GameObject";
import GameWorld from "./GameWorld";
import MissileBase from "./MissileBase";
import VFDGameObject from './VFDGameObject';


export default class MissileBaseController extends GameObject
{
    missileBase: MissileBase;

    public init()
    {
        this.missileBase = VFDGameObject.createGameObject(MissileBase);
    }

    public reset()
    {
        this.missileBase.reset();
    }

    public update(secondsPassed: number)
    {
        if (this.missileBase.isDead)
        {
            return;
        }

        if (GameWorld.instance.inputSystem.isDownFire())
        {
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

    public shutdownGame()
    {
        this.enabled = false;
        this.missileBase.shutdownGame();

    }

    public restartMission()
    {
        this.enabled=true;
        this.missileBase.restartMission();
    }
}
