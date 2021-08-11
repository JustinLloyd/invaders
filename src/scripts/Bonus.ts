// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {Sprite, utils} from "pixi.js";
import GameObject from "./GameObject";
import * as CONSTANTS from "./Constants";
import {COLLISION_BONUS, COLLISION_MISSILE, LEFT_COLUMN, RIGHT_COLUMN, TEXTURE_BONUS_01, TEXTURE_BONUS_02, TEXTURE_BONUS_HIT_01, TEXTURE_BONUS_HIT_02} from "./Constants";
import DifficultySetting from "./DifficultySetting";
import Random from "./Random";
import PlayfieldGameObject from "./PlayfieldGameObject";
import {MovementDirection} from './Enums';


let TextureCache = utils.TextureCache;

export default class Bonus extends PlayfieldGameObject
{
    isPatrolling: boolean;
    bonusSpaceship: Sprite;
    bonusExplosion: Sprite;
    movementDirection: MovementDirection;
    bonusSpaceshipTextureNames: Array<string>;
    bonusExplosionTextureNames: Array<string>;
    pointValue: number;

    public init()
    {
        this.isLockedToPlayfield = false;
        this.colOffset = CONSTANTS.BONUS_COL_OFFSET;
        this.colStep = CONSTANTS.BONUS_COL_STEP;
        this.rowOffset = CONSTANTS.BONUS_ROW_OFFSET;
        this.bonusSpaceshipTextureNames = [TEXTURE_BONUS_02, TEXTURE_BONUS_01, TEXTURE_BONUS_02];
        this.bonusExplosionTextureNames = [TEXTURE_BONUS_HIT_02, TEXTURE_BONUS_HIT_01, TEXTURE_BONUS_HIT_02];
        this.bonusSpaceship = new Sprite(TextureCache[this.bonusSpaceshipTextureNames[0]]);
        this.bonusSpaceship.anchor.set(0.5, 0);
        this.container.addChild(this.bonusSpaceship);
        this.bonusExplosion = new Sprite(TextureCache[this.bonusExplosionTextureNames[0]]);
        this.bonusExplosion.anchor.set(0.5, 0);
        this.bonusExplosion.y = CONSTANTS.BONUS_HIT_Y_OFFSET;
        this.bonusExplosion.visible = false;
        this.isPatrolling = false;
        this.container.addChild(this.bonusExplosion);
        this.col = 0;
        this.row = 0;
        this.isRowLocked = true;
        this.collisionFlags = COLLISION_BONUS;
        this.collisionMask = COLLISION_MISSILE;
    }

    public reset()
    {
        super.reset();
        this.movement.delay = DifficultySetting.difficulty.bonusMovementDelay;
        this.pointValue = DifficultySetting.difficulty.bonusPointValue;
        this.isPatrolling = false;
        this.movementDirection = MovementDirection.RightToLeft;
    }

    public exitPlayfield()
    {
        super.exitPlayfield();
        this.isPatrolling = false;
    }

    public enterPlayfieldOnLeft()
    {
        this.movementDirection = MovementDirection.LeftToRight;
        this.col = CONSTANTS.LEFT_COLUMN;
        // TODO send network event
    }

    public enterPlayfieldOnRight()
    {
        this.movementDirection = MovementDirection.RightToLeft;
        this.col = CONSTANTS.RIGHT_COLUMN;
        // TODO send network event
    }

    public get shouldEnterPlayfield(): boolean
    {
        if (this.isPatrolling || this.isDead)
        {
            return false;
        }

        return (Random.next() < DifficultySetting.difficulty.bonusChance);
    }

    public enterPlayfield()
    {
        super.enterPlayfield();
        (Random.boolean()) ? this.enterPlayfieldOnLeft() : this.enterPlayfieldOnRight();
        this.isPatrolling = true;
    }

    public get canMove(): boolean
    {
        return (super._canMove() && this.isPatrolling);
    }

    public update(secondsPassed: number)
    {
        if (this.exitPlayfieldIfDone())
        {
            this.isPatrolling = false;
            return;
        }

        this.moveIfCan();
    }

    private moveIfCan()
    {
        if (this.canMove)
        {
            this.move();
        }
    }

    public onColUpdated(newCol: number)
    {
        this.changeTexturesForColumn(newCol);
        this.exitPlayfieldIfDone();
    }

    public showDead()
    {
        this.bonusSpaceship.visible = false;
        this.bonusExplosion.visible = true;
    }

    private move()
    {
        if (this.movementDirection == MovementDirection.LeftToRight)
        {
            this.moveRight();
        }
        else if (this.movementDirection == MovementDirection.RightToLeft)
        {
            this.moveLeft();
        }

        this.dispatchOnMove();
        // TODO send network event
    }


    private changeTexturesForColumn(newCol: number)
    {
        if ((newCol < LEFT_COLUMN) || (newCol > RIGHT_COLUMN))
        {
            return;
        }

        this.bonusSpaceship.texture = TextureCache[this.bonusSpaceshipTextureNames[newCol]];
        this.bonusExplosion.texture = TextureCache[this.bonusExplosionTextureNames[newCol]];
    }

    public onCollision(other: GameObject)
    {
        this.die();
    }


    public showNormal()
    {
        this.bonusSpaceship.visible = true;
        this.bonusExplosion.visible = false;
    }

    public restartMission()
    {
        this.reset();
        this.enabled = false;
        this.hide();
    }
}
