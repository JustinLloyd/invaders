// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import GameObject from "./GameObject";
import GameObjectPool from "./GameObjectPool";
import DifficultySetting from "./DifficultySetting";
import Invader from "./Invader";
import Random from "./Random";
import Interval from "./Interval";
import VFDGameObject from './VFDGameObject';

export default class InvaderSpawner extends GameObject
{
    invadersPool: GameObjectPool<Invader>;
    protected spawn: Interval = new Interval();

    public init()
    {
        this.invadersPool = new GameObjectPool<Invader>();
        for (let i = 0; i < DifficultySetting.difficulty.invaderCount; i++)
        {
            let invader = VFDGameObject.createGameObject(Invader);
            invader.enabled = false;
            invader.hide();
            invader.row = i;
            invader.col = i;
            invader.index = i;
            invader.controller = this;
            this.invadersPool.push(invader);
        }

    }

    public reset()
    {
        this.spawn.delay = DifficultySetting.difficulty.invaderSpawnInterval;
        this.spawn.reset();
    }

    public get shouldSpawnInvader(): boolean
    {
        return (Random.next() < DifficultySetting.difficulty.invaderSpawnChance);
    }

    public get canSpawnInvader(): boolean
    {
        return (this.spawn.hasElapsed && this.invadersPool.some(invader => invader.enabled == false));
    }

    public update()
    {
        this.spawnInvaderIfCan();
    }

    public spawnInvaderIfCan()
    {
        if (!this.canSpawnInvader || !this.shouldSpawnInvader)
        {
            return;
        }

        let invader: Invader = this.invadersPool.find(invader => invader.enabled == false);
        if (invader==undefined)
        {
            return;
        }
        this.spawnInvader(invader);
    }

    private spawnInvader(invader: Invader)
    {
        this.spawn.update();
        invader.enterPlayfield();
    }

    public isPlayfieldSpotEmpty(col: number, row: number)
    {
        for (let invader of this.invadersPool)
        {
            if ((col == invader.col) && (row == invader.row))
            {
                return false;
            }

        }

        return true;
    }

    public shutdownGame()
    {
        this.invadersPool.forEach(invader => invader.shutdownGame());
        this.enabled = false;
    }

    public restartMission()
    {
        this.enabled=true;
        for (let invader of this.invadersPool)
        {
            invader.restartMission();
        }
    }
}
