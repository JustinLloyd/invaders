import {Sprite, utils} from "pixi.js";
import GameObject from "./GameObject";
import * as CONSTANTS from "./Constants";
import {COLLISION_BONUS, COLLISION_MISSILE, LEFT_COLUMN, RIGHT_COLUMN, TEXTURE_BONUS_01, TEXTURE_BONUS_02, TEXTURE_BONUS_HIT_01, TEXTURE_BONUS_HIT_02} from "./Constants";
import DifficultySetting from "./DifficultySetting";
import Random from "./Random";
import PlayfieldGameObject from "./PlayfieldGameObject";


let TextureCache = utils.TextureCache;

enum BonusStates
{
    Sleeping,
    Hovering,
    Dead
}

enum MovementDirection
{
    LeftToRight,
    RightToLeft
}

export default class Bonus extends PlayfieldGameObject
{
    state: BonusStates;
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
        this.bonusExplosion.y = CONSTANTS.BONUS_EXPLOSION_ROW_OFFSET;
        this.bonusExplosion.visible = false;
        this.state = BonusStates.Sleeping;
        this.container.addChild(this.bonusExplosion);
        this.col = 0;
        this.row = 0;
        this.isRowLocked = true;
        this.collisionFlags = COLLISION_BONUS;
        this.collisionMask = COLLISION_MISSILE;
        this.movement.delay = DifficultySetting.difficulty.bonusMovementDelay;
        this.pointValue = DifficultySetting.difficulty.bonusPointValue;
    }

    public reset()
    {
        this.movement.reset();
        this.death.reset();
        this.state = BonusStates.Sleeping;
        this.movementDirection = MovementDirection.RightToLeft;
    }

    public moveLeft()
    {
        if (this.canMoveLeft)
        {
            this.col--;
            this.movement.update();
            // TODO send network event
        }
    }

    public moveRight()
    {
        if (this.canMoveRight)
        {
            this.col++;
            this.movement.update();
            // TODO send network event
        }
    }

    public exitPlayfield()
    {

        this.hide();
        this.state = BonusStates.Sleeping;
        this.dispatchOnExitPlayfield();
        // TODO send network event
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
        if (this.state != BonusStates.Sleeping)
        {
            return false;
        }

        // TODO change this hard-coded number to a difficult setting value
        if (Random.next() > DifficultySetting.difficulty.bonusChance)
        {
            return false;
        }

        return true;
    }

    public enterPlayfield()
    {
        (Random.boolean()) ? this.enterPlayfieldOnLeft() : this.enterPlayfieldOnRight();
        this.resetVisibility();
        this.state = BonusStates.Hovering;
        this.movement.update();
        this.enabled=true;
        this.dispatchOnEnterPlayfield();
        // TODO send network event
    }

    private resetVisibility()
    {
        this.show();
        this.showNormal();
        // TODO send network event
    }

    public get canMove(): boolean
    {
        if (this.state != BonusStates.Hovering)
        {
            return false;
        }

        if (!this.movement.hasElapsed)
        {
            return false;
        }

        return true;
    }

    public update(secondsPassed: number)
    {
        if (this.state == BonusStates.Hovering)
        {
            this.moveIfCan();
        }
        else if (this.state == BonusStates.Dead)
        {
            if (this.death.hasElapsed)
            {
                this.enabled=false;
                this.state = BonusStates.Sleeping;
            }
        }
    }

    public get isDone(): boolean
    {
        return ((this.col < CONSTANTS.LEFT_COLUMN) || (this.col > CONSTANTS.RIGHT_COLUMN));
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

    public die()
    {
        this.state = BonusStates.Dead;
        this.showExplosion();
        this.death.update();
        this.dispatchOnDead();

        // change the explosion texture depending on which column the bonus spaceshp was displaying on
        // TODO start a timer here, switch to sleeping state once the timer has elapsed
        // TODO blink the spaceship
        //this.bonusSpaceship.visible = false;
        // TODO send network event

    }

    private showExplosion()
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

    private exitPlayfieldIfDone()
    {
        if (this.isDone)
        {
            this.exitPlayfield();
        }

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


    private showNormal()
    {
        this.bonusSpaceship.visible = true;
        this.bonusExplosion.visible = false;
    }
}
