import GameObject from "./GameObject";
import GameObjectPool from "./GameObjectPool";
import DifficultySetting from "./DifficultySetting";
import Invader from "./Invader";
import Random from "./Random";
import Interval from "./Interval";

export default class InvaderController extends GameObject
{
    invadersPool: GameObjectPool<Invader>;
    protected spawn: Interval = new Interval();

    public init()
    {
        this.spawn.delay = DifficultySetting.difficulty.invaderSpawnInterval;
        this.invadersPool = new GameObjectPool<Invader>();
        for (let i = 0; i < DifficultySetting.difficulty.invaderCount; i++)
        {
            let invader = GameObject.createGameObject(Invader);
            invader.enabled = false;
            invader.row = i;
            invader.col = i;
            this.invadersPool.push(invader);
        }

    }

    public reset()
    {
        this.spawn.reset();
    }

    public get shouldSpawnInvader(): boolean
    {
        return ((Random.next() < DifficultySetting.difficulty.invaderSpawnChance) && this.spawn.hasElapsed);
    }

    public update()
    {
        this.spawnInvaderIfCan();
    }

    public spawnInvaderIfCan()
    {
        if (!this.shouldSpawnInvader)
        {
            return;
        }

        for (let i = 0; i < this.invadersPool.length; i++)
        {
            let invader = this.invadersPool[i];
            if (!invader.enabled)
            {
                this.spawnInvader(invader);
            }
        }
    }

    private spawnInvader(invader: Invader)
    {
        console.log("Found an inactive invader");
        this.spawn.update();
        invader.enterPlayfield();
    }
}
