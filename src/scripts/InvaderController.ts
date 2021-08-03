import {GameObject} from "./GameObject";
import {GameObjectPool} from "./GameObjectPool";
import {DifficultySetting} from "./DifficultySetting";
import {Invader} from "./Invader";

export class InvaderController extends GameObject
{
    invadersPool: GameObjectPool<Invader>;
    lastInvaderSpawnTime: number;

    public init()
    {
        this.invadersPool = new GameObjectPool<Invader>();
        for (let i = 0; i < DifficultySetting.difficulty.invaderCount; i++)
        {
            let invader = GameObject.CreateGameObject(Invader);
            invader.deactivate();
            invader.row = i;
            invader.col = i;
            this.invadersPool.push(invader);
        }

    }

    public reset()
    {
        this.lastInvaderSpawnTime = 0;
    }

    public get shouldAppear(): boolean
    {
        if (Math.random() < 0.5)
        {
            return false;
        }

        if ((Date.now() - this.lastInvaderSpawnTime) < DifficultySetting.difficulty.invaderSpawnInterval)
        {
            return false;
        }

        return true;
    }

    public update()
    {
        if (!this.shouldAppear)
        {
            return;
        }

        this.spawnInvaderIfCan();
    }

    public spawnInvaderIfCan()
    {
        for (let i = 0; i < this.invadersPool.length; i++)
        {
            let invader = this.invadersPool[i];
            if (!invader.isActive)
            {
                this.spawnInvader(invader);
            }
        }
    }

    private spawnInvader(invader: Invader)
    {
        console.log("Found an inactive invader");
        this.lastInvaderSpawnTime = Date.now();
        invader.appear();

    }
}
