// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {Sprite, utils} from "pixi.js";
import GameObject from "../lib/GameObject";
import Missile from "./Missile";
import GameObjectPool from "../lib/GameObjectPool";
import {
    CENTER_COLUMN,
    LEFT_COLUMN,
    MISSILE_BASE_COL_STEP,
    MISSILE_BASE_ROW_OFFSET,
    RIGHT_COLUMN,
    COLLISION_DEATH_RAY,
    COLLISION_INVADER,
    COLLISION_MISSILE_BASE,
    TEXTURE_MISSILE_BASE_ARMED,
    TEXTURE_MISSILE_BASE_HIT,
    TEXTURE_MISSILE_BASE, MISSILE_BASE_COL_OFFSET, MISSILE_BASE_HIT_X_OFFSET, MISSILE_BASE_HIT_Y_OFFSET
} from "./Constants";
import DifficultySetting from "./DifficultySetting";
import Clamp from "../lib/Clamp";
import Interval from "../lib/Interval";
import PlayfieldGameObject from "./PlayfieldGameObject";
import DeathRay from './DeathRay';
import VFDGameObject from '../lib/VFDGameObject';

let TextureCache = utils.TextureCache;

export default class MissileBase extends PlayfieldGameObject
{
    protected _isArmed: boolean;
    protected missileBaseSprite: Sprite;
    protected missileBaseExplosionSprite: Sprite;
    protected firingInterval: Interval;
    missilesPool: GameObjectPool<Missile>;


    public init()
    {
        this.isLockedToPlayfield = true;
        this.missileBaseSprite = new Sprite(TextureCache[TEXTURE_MISSILE_BASE_ARMED]);
        this.missileBaseSprite.anchor.set(0.5, 1);
        this.missileBaseSprite.x = 0;
        this.missileBaseSprite.y = 0;
        this.container.addChild(this.missileBaseSprite);
        this.missileBaseExplosionSprite = new Sprite(TextureCache[TEXTURE_MISSILE_BASE_HIT]);
        this.missileBaseExplosionSprite.anchor.set(0.5, 1);
        this.missileBaseExplosionSprite.x = MISSILE_BASE_HIT_X_OFFSET;
        this.missileBaseExplosionSprite.y = MISSILE_BASE_HIT_Y_OFFSET;
        this.container.addChild(this.missileBaseExplosionSprite);
        this.collisionFlags = COLLISION_MISSILE_BASE;
        this.collisionMask = COLLISION_DEATH_RAY | COLLISION_INVADER;

        this.colStep = MISSILE_BASE_COL_STEP;
        this.colOffset = MISSILE_BASE_COL_OFFSET;
        this.rowOffset = MISSILE_BASE_ROW_OFFSET;
        this.rowStep = 0;
        this.col = CENTER_COLUMN;
        this.row = 6;
        this.isRowLocked = true;

        this.missilesPool = new GameObjectPool<Missile>();
        for (let i = 0; i < DifficultySetting.difficulty.missileCount; i++)
        {
            let missile = VFDGameObject.createGameObject(Missile);
            missile.enabled = false;
            missile.hide();
            this.missilesPool.push(missile);
        }

        this.armMissile();
    }

    public reset()
    {
        super.reset()
        this.firingInterval = new Interval(DifficultySetting.difficulty.missileBaseFiringDelay);
        this.movement.delay = DifficultySetting.difficulty.missileBaseMovementDelay;

        this.firingInterval.reset();
        this.armMissile();
        this.showNormal();
        for (let missile of this.missilesPool)
        {
            missile.restartMission();
        }
    }

    public get isArmed(): boolean
    {
        return this._isArmed;
    }

    public die()
    {
        super.die();
        this._isArmed = false;
    }

    public showNormal()
    {
        this.missileBaseSprite.visible = true;
        this.missileBaseExplosionSprite.visible = false;
    }

    public showDead()
    {
        this.missileBaseSprite.visible = false;
        this.missileBaseExplosionSprite.visible = true;

    }


    public moveCenter()
    {
        this.col = CENTER_COLUMN;
        this.movement.update();
        // TODO send network event
    }

    public armMissile()
    {
        this._isArmed = true;
        this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE_ARMED];
        // TODO send network event
    }

    public get canArmMissile(): boolean
    {
        return (!this._isDead && !this._isArmed && this.firingInterval.hasElapsed && this.missilesPool.some(missile => missile.enabled == false));
    }

    public fireMissile()
    {

        let missile = this.missilesPool.find(missile => missile.enabled == false);
        if (missile == undefined)
        {
            return;
        }

        missile.reset();
        missile.fire(this.col);
        this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE];
        // TODO send network event
        this._isArmed = false;
        this.firingInterval.update();
    }

    public update(secondsPassed: number)
    {
        if (this.exitPlayfieldIfDone())
        {
            return;
        }

        this.armIfCan();
    }

    public fireIfCan()
    {
        if (this.isDead)
        {
            return;
        }

        if (!this.isArmed)
        {
            return;
        }

        this.fireMissile();
    }

    private armIfCan()
    {
        if (this.isDead)
        {
            return;
        }
        if (this.canArmMissile)
        {
            this.armMissile();
        }

    }

    public moveCenterIfCan()
    {
        if (this.isDead)
        {
            return;
        }

        if (!this.canMove)
        {
            return;
        }

        this.moveCenter();
    }

    public shutdownGame()
    {
        this.enabled = false;
        this.missilesPool.forEach(missile =>
        {
            missile.shutdownGame();
        });
    }

    public onCollision(other: GameObject)
    {
        if (other instanceof DeathRay)
        {
            this.die();
        }
    }

    public restartMission()
    {
        this.enterPlayfield();
    }
}

