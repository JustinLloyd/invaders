// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {Sprite, utils} from 'pixi.js';
import {
    BOTTOM_ROW,
    COLLISION_DEATH_RAY,
    COLLISION_MISSILE_BASE,
    DEATH_RAY_COL_OFFSET,
    DEATH_RAY_COL_STEP,
    DEATH_RAY_ROW_OFFSET,
    DEATH_RAY_ROW_STEP,
    INVADER_HIGHEST_ROW,
    TEXTURE_DEATH_RAY_01,
    TEXTURE_DEATH_RAY_02, TOP_ROW
} from "./Constants";
import DifficultySetting from "./DifficultySetting";
import PlayfieldGameObject from "./PlayfieldGameObject";
import GameObject from './GameObject';

let TextureCache = utils.TextureCache;

export default class DeathRay extends PlayfieldGameObject
{
    deathRaySprite: Sprite;
    deathRayTextureNames: Array<string>;

    init()
    {
        this.rowOffset = DEATH_RAY_ROW_OFFSET;
        this.rowStep = DEATH_RAY_ROW_STEP;
        this.colOffset = DEATH_RAY_COL_OFFSET;
        this.colStep = DEATH_RAY_COL_STEP;
        this.isLockedToPlayfield = false;
        this.maxRow=BOTTOM_ROW;
        this.deathRayTextureNames = [null, TEXTURE_DEATH_RAY_02,TEXTURE_DEATH_RAY_01, TEXTURE_DEATH_RAY_02, TEXTURE_DEATH_RAY_01, TEXTURE_DEATH_RAY_02,null];
        this.deathRaySprite = new Sprite(TextureCache[this.deathRayTextureNames[0]]);
        this.deathRaySprite.anchor.set(0.5, 0.5);
        this.container.addChild(this.deathRaySprite);
        this.collisionFlags = COLLISION_DEATH_RAY;
        this.collisionMask = COLLISION_MISSILE_BASE;
    }

    public reset()
    {
        super.reset();
        this.movement.delay = DifficultySetting.difficulty.deathRayMovementDelay;
    }

    public onRowUpdated(newRow: number)
    {
        if (this.exitPlayfieldIfDone())
        {
            return;
        }

        this.changeTexturesForRow(newRow)
    }

    public fire(col: number, row: number)
    {
        this.col = col;
        this.row = row;
        this.enabled = true;
        this.show();
        // TODO send network event
    }

    public shutdownGame(): void
    {
        this.enabled = false;
        // TODO send network event
    }

    private moveIfCan()
    {
        if (!this.canMove)
        {
            return;
        }

        this.move();
    }

    public move()
    {
        this.moveDownIfCan();
    }

    public update(secondsPassed: number)
    {
        this.moveIfCan();
    }


    public onCollision(other: GameObject)
    {
        this.exitPlayfield();
    }

    private changeTexturesForRow(newRow: number)
    {
        if ((newRow < INVADER_HIGHEST_ROW) || (newRow >= BOTTOM_ROW))
        {
            return;
        }

        this.deathRaySprite.texture = TextureCache[this.deathRayTextureNames[newRow]];
    }

}
