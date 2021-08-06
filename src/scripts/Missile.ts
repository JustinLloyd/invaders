import * as PIXI from 'pixi.js';
import {Sprite, utils} from "pixi.js";
import {
    BOTTOM_ROW, COLLISION_BONUS,
    COLLISION_INVADER,
    COLLISION_MISSILE,
    MISSILE_COL_OFFSET,
    MISSILE_COL_STEP,
    MISSILE_ROW_OFFSET,
    MISSILE_ROW_STEP,
    TEXTURE_MISSILE,
    TOP_ROW
} from "./Constants";
import GameObject from "./GameObject";
import DifficultySetting from "./DifficultySetting";
import PlayfieldGameObject from "./PlayfieldGameObject";

let TextureCache = utils.TextureCache;

export default class Missile extends PlayfieldGameObject
{
    missileSprite: Sprite;

    init()
    {
        this.rowOffset = MISSILE_ROW_OFFSET;
        this.rowStep = MISSILE_ROW_STEP;
        this.colOffset = MISSILE_COL_OFFSET;
        this.colStep = MISSILE_COL_STEP;
        this.isLockedToPlayfield = false;
        this.movement.delay = DifficultySetting.difficulty.missileMovementDelay;
        this.missileSprite = new Sprite(TextureCache[TEXTURE_MISSILE]);
        this.missileSprite.anchor.set(0.5, 1);
        this.container.addChild(this.missileSprite);
        this.col = 0;
        this.row = 0;
        this.collisionFlags = COLLISION_MISSILE;
        this.collisionMask = COLLISION_INVADER | COLLISION_BONUS;
    }

    reset()
    {
        this.movement.reset();
        this.row = BOTTOM_ROW;
    }

    public get canMove(): boolean
    {
        return (this.canMoveUp && this.movement.hasElapsed);
    }

    public move()
    {
        this.row--;
        this.movement.update();
        // TODO send network event here
    }

    public get isDone(): boolean
    {
        return this.row < TOP_ROW;
    }

    public update(secondsPassed: number)
    {
        this.moveIfCan();
    }

    public onRowUpdated(newRow: number)
    {
        this.exitPlayfieldIfDone();
    }

    public onCollision(other: GameObject)
    {
        this.die();
    }

    private exitPlayfield()
    {
        this.enabled = false;
        this.dispatchOnExitPlayfield();
        // TODO send a network event here
    }

    private moveIfCan()
    {
        if (!this.canMove)
        {
            return;
        }

        this.move();
    }

    private exitPlayfieldIfDone()
    {
        if (this.isDone)
        {
            this.exitPlayfield();
        }
    }

    private die()
    {
        this.enabled = false;
        this.dispatchOnDead();
        // TODO send a network event here
    }
}
