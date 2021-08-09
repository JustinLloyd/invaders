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
        this.missileSprite = new Sprite(TextureCache[TEXTURE_MISSILE]);
        this.missileSprite.anchor.set(0.5, 1);
        this.container.addChild(this.missileSprite);
        this.col = 0;
        this.row = 0;
        this.collisionFlags = COLLISION_MISSILE;
        this.collisionMask = COLLISION_INVADER | COLLISION_BONUS;
    }

    public shutdownGame()
    {
        this.enabled = false;
        // TODO send network event
    }

    public move()
    {
        this.moveUp();
        // TODO send network event here
    }

    public fire(col: number)
    {
        this.col = col;
        this.row = BOTTOM_ROW;
        this.enterPlayfield();
        // TODO send network event
    }

    public update(secondsPassed: number)
    {
        this.moveUpIfCan();
    }

    public onRowUpdated(newRow: number)
    {
        this.exitPlayfieldIfDone();
    }

    public onCollision(other: GameObject)
    {
        this.exitPlayfield();
    }

    public reset()
    {
        super.reset();
        this.movement.delay = DifficultySetting.difficulty.missileMovementDelay;
    }
    public restartMission()
    {
        this.reset();
        this.enabled = false;
        this.hide();
        // TODO send network event
    }
}
