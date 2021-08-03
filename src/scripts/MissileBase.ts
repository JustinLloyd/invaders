import * as PIXI from 'pixi.js';
import {PlayfieldGameObject} from "./PlayfieldGameObject";
import {Sprite, utils} from "pixi.js";
import GameWorld from "./GameWorld";
import {GameObject} from "./GameObject";
import {Missile} from "./Missile";
import {GameObjectPool} from "./GameObjectPool";
import {
    CENTER_COLUMN,
    LEFT_COLUMN,
    MISSILE_BASE_COL_STEP,
    MISSILE_BASE_ROW_OFFSET,
    RIGHT_COLUMN, COLLISION_DEATH_RAY, COLLISION_INVADER, COLLISION_MISSILE_BASE, TEXTURE_MISSILE_BASE_ARMED, TEXTURE_MISSILE_BASE_HIT, TEXTURE_MISSILE_BASE
} from "./Constants";
import {DifficultySetting} from "./DifficultySetting";

let TextureCache = utils.TextureCache;

export class MissileBase extends PlayfieldGameObject
{
    protected _isArmed: boolean;
    protected _isDead: boolean;
    protected _isDieing: boolean;
    protected missileBaseSprite: Sprite;
    protected missileBaseExplosionSprite: Sprite;
    protected lastFiringTime: number = 0;
    protected missilesAvailable: number;
    missilesPool: GameObjectPool<Missile>;


    public init()
    {
        this.missileBaseSprite = new Sprite(TextureCache[TEXTURE_MISSILE_BASE_ARMED]);
        this.missileBaseSprite.anchor.set(0.5, 1);
        this.missileBaseSprite.x = 72;
        this.missileBaseSprite.y = 98;
        this.container.addChild(this.missileBaseSprite);
        this.missileBaseExplosionSprite = new Sprite(TextureCache[TEXTURE_MISSILE_BASE_HIT]);
        this.missileBaseExplosionSprite.x = 8;
        this.container.addChild(this.missileBaseExplosionSprite);
        this.collisionFlags = COLLISION_MISSILE_BASE;
        this.collisionMask = COLLISION_DEATH_RAY | COLLISION_INVADER;

        this.colStep = MISSILE_BASE_COL_STEP;
        this.colOffset = 0;
        this.rowOffset = MISSILE_BASE_ROW_OFFSET;
        this.rowStep = 0;
        this.col = CENTER_COLUMN;
        this.row = 6;
        this.isRowLocked = true;
        this.movementDelay = DifficultySetting.difficulty.missileBaseMovementDelay;

        this.missilesPool = new GameObjectPool<Missile>();
        for (let i = 0; i < DifficultySetting.difficulty.missileCount; i++)
        {
            let missile = GameObject.CreateGameObject(Missile);
            missile.deactivate();
            this.missilesPool.push(missile);
        }

    }

    public reset()
    {
        this.resetLastMovementTime();
        this.lastFiringTime = 0;
        this._isArmed = true;
        this._isDieing = false;
        this._isDead = false;
        this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE_ARMED];
        this.missileBaseSprite.visible = true;
        this.missileBaseExplosionSprite.visible = false;
        this.missilesAvailable = DifficultySetting.difficulty.missileCount;
        this.missilesPool.forEach(value =>
        {
            value.reset();
            value.deactivate();
        });
    }

    public get isArmed(): boolean
    {
        return this._isArmed;
    }

    public get isDead(): boolean
    {
        return this._isDead;
    }

    public get isDieing(): boolean
    {
        return this._isDieing;
    }

    public die()
    {
        this._isDead = true;
        this._isDieing = true;
        this._isArmed = false;
        this.missileBaseSprite.visible = false;
        this.missileBaseExplosionSprite.visible = true;
        this.missilesAvailable = 0;

        // TODO kill off all the player missiles? Or just leave them?
        //this.col = CENTER_COLUMN;
        // TODO send network event
    }

    public moveLeft()
    {
        if (this.col > LEFT_COLUMN)
        {
            this.col--;
            this.updateLastMovementTime();
            // TODO send network event
        }

    }

    public moveRight()
    {
        if (this.col < RIGHT_COLUMN)
        {
            this.col++;
            this.updateLastMovementTime();
            // TODO send network event
        }
    }

    public moveCenter()
    {
        this.col = CENTER_COLUMN;
        this.updateLastMovementTime();
        // TODO send network event
    }

    public armMissile()
    {
        this._isArmed = true;
        this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE_ARMED];
        // TODO send network event
    }

    public replenishMissile()
    {
        this.missilesAvailable = Math.min(this.missilesAvailable + 1, DifficultySetting.difficulty.missileCount);
        // TODO send network event
    }

    public get canArmMissile(): boolean
    {
        if (this._isDead || this._isArmed || this.missilesAvailable == 0)
        {
            return false;
        }

        let now = Date.now();
        if ((now - this.lastFiringTime) < DifficultySetting.difficulty.missileBaseFiringDelay)
        {
            return false;
        }

        return true;
    }

    public get canMove(): boolean
    {
        if (!this.isMovementTimeElapsed)
        {
            return false;
        }

        return true;
    }

    public fireMissile()
    {
        this._isArmed = false;
        this.lastFiringTime = Date.now();
        for (let i = 0; i < this.missilesPool.length; i++)
        {
            let missile = this.missilesPool[i];
            if (!missile.isActive)
            {
                this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE];
                missile.reset();
                missile.col = this.col;
                missile.activate();
                missile.onDead = () =>
                {
                    this.replenishMissile();
                    missile.onDead = null;
                };
                missile.onExitPlayfield = () =>
                {
                    this.replenishMissile();
                    missile.onExitPlayfield = null;
                };
                this.missilesAvailable = Math.max(0, this.missilesAvailable - 1);
                // TODO send network event

                break;
            }
        }
    }

    public localUpdate(delta: number)
    {
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

    public moveLeftIfCan()
    {
        if (this.isDead)
        {
            return;
        }

        if (!this.canMove)
        {
            return;
        }

        this.moveLeft();

    }

    public moveRightIfCan()
    {
        if (this.isDead)
        {
            return;
        }

        if (!this.canMove)
        {
            return;
        }

        this.moveRight();
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
}

