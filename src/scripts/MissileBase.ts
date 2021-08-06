import {Sprite, utils} from "pixi.js";
import GameObject from "./GameObject";
import Missile from "./Missile";
import GameObjectPool from "./GameObjectPool";
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
    TEXTURE_MISSILE_BASE
} from "./Constants";
import DifficultySetting from "./DifficultySetting";
import Clamp from "./Clamp";
import Interval from "./Interval";
import PlayfieldGameObject from "./PlayfieldGameObject";

let TextureCache = utils.TextureCache;

export default class MissileBase extends PlayfieldGameObject
{
    protected _isArmed: boolean;
    protected missileBaseSprite: Sprite;
    protected missileBaseExplosionSprite: Sprite;
    protected firingInterval: Interval;
    protected missilesAvailable: number;
    missilesPool: GameObjectPool<Missile>;


    public init()
    {
        this.firingInterval = new Interval(DifficultySetting.difficulty.missileBaseFiringDelay);
        this.movement.delay = DifficultySetting.difficulty.missileBaseMovementDelay;
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

        this.missilesPool = new GameObjectPool<Missile>();
        for (let i = 0; i < DifficultySetting.difficulty.missileCount; i++)
        {
            let missile = GameObject.createGameObject(Missile);
            missile.enabled = false;
            this.missilesPool.push(missile);
        }

    }

    public reset()
    {
        this.movement.reset();
        this.firingInterval.reset();
        this._isArmed = true;
        this._isDead = false;
        this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE_ARMED];
        this.missileBaseSprite.visible = true;
        this.missileBaseExplosionSprite.visible = false;
        this.missilesAvailable = DifficultySetting.difficulty.missileCount;
        this.missilesPool.forEach(value =>
        {
            value.reset();
            value.enabled = false;
        });
    }

    public get isArmed(): boolean
    {
        return this._isArmed;
    }

    public die()
    {
        this._isDead = true;
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
            this.movement.update();
            // TODO send network event
        }

    }

    public moveRight()
    {
        if (this.col < RIGHT_COLUMN)
        {
            this.col++;
            this.movement.update();
            // TODO send network event
        }
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

    public replenishMissile()
    {
        this.missilesAvailable = Math.min(this.missilesAvailable + 1, DifficultySetting.difficulty.missileCount);
        // TODO send network event
    }

    public get canArmMissile(): boolean
    {
        return (!this._isDead && !this._isArmed && (this.missilesAvailable > 0) && this.firingInterval.hasElapsed);
    }

    public get canMove(): boolean
    {
        return this.movement.hasElapsed && !this.isDead;
    }

    public fireMissile()
    {
        for (let i = 0; i < this.missilesPool.length; i++)
        {
            let missile = this.missilesPool[i];
            if (!missile.enabled)
            {
                this.missileBaseSprite.texture = TextureCache[TEXTURE_MISSILE_BASE];
                missile.reset();
                missile.col = this.col;
                missile.enabled = true;
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
                this.missilesAvailable = Clamp.atLeast(this.missilesAvailable - 1, 0);
                // TODO send network event
                this._isArmed = false;
                this.firingInterval.update();

                break;
            }
        }
    }

    public update(secondsPassed: number)
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

