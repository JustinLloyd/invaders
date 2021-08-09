import {Sprite, utils} from 'pixi.js';
import {
    BOTTOM_ROW,
    COLLISION_INVADER,
    COLLISION_MISSILE,
    COLLISION_MISSILE_BASE, COLUMN_COUNT,
    INVADER_COL_OFFSET,
    INVADER_COL_STEP,
    INVADER_HIT_OFFSET_X,
    INVADER_HIT_OFFSET_Y,
    INVADER_HIGHEST_ROW,
    INVADER_POINT_VALUE_ROW_1,
    INVADER_POINT_VALUE_ROW_2,
    INVADER_POINT_VALUE_ROW_3,
    INVADER_POINT_VALUE_ROW_4,
    INVADER_POINT_VALUE_ROW_5,
    INVADER_ROW_OFFSET,
    INVADER_ROW_STEP,
    LEFT_COLUMN,
    RIGHT_COLUMN,
    TEXTURE_INVADER_01,
    TEXTURE_INVADER_02,
    TEXTURE_INVADER_HIT,
    TEXTURE_INVADER_LANDED
} from "./Constants";
import GameObject from "./GameObject";
import DeathRay from "./DeathRay";
import Random from "./Random";
import DifficultySetting from "./DifficultySetting";
import PlayfieldGameObject from "./PlayfieldGameObject";
import Interval from "./Interval";
import InvaderSpawner from './InvaderSpawner';
import Missile from './Missile';
import {MovementDirection} from './Enums';
import VFDGameObject from './VFDGameObject';

let TextureCache = utils.TextureCache;

export default class Invader extends PlayfieldGameObject
{
    rowPointValues: Array<number> = [
        0,
        INVADER_POINT_VALUE_ROW_1,
        INVADER_POINT_VALUE_ROW_2,
        INVADER_POINT_VALUE_ROW_3,
        INVADER_POINT_VALUE_ROW_4,
        INVADER_POINT_VALUE_ROW_5,
        0
    ];
    invaderTextureNames: Array<string>;
    invaderSprite: Sprite;
    invaderExplosionSprite: Sprite;
    deathRay: DeathRay;
    protected firingInterval: Interval;


    public onLanded: Array<(Invader) => void> = new Array<(Invader) => void>();
    public index: number;
    public controller: InvaderSpawner;

    init()
    {
        this.isLockedToPlayfield = true;
        this.rowOffset = INVADER_ROW_OFFSET;
        this.rowStep = INVADER_ROW_STEP;
        this.colOffset = INVADER_COL_OFFSET;
        this.colStep = INVADER_COL_STEP;
        this.invaderTextureNames = [null, TEXTURE_INVADER_02, TEXTURE_INVADER_01, TEXTURE_INVADER_02, TEXTURE_INVADER_01, TEXTURE_INVADER_02, TEXTURE_INVADER_LANDED];
        this.invaderSprite = new Sprite(TextureCache[this.invaderTextureNames[0]]);
        this.container.addChild(this.invaderSprite);
        this.invaderExplosionSprite = new Sprite(TextureCache[TEXTURE_INVADER_HIT]);
        this.container.addChild(this.invaderExplosionSprite);
        this.invaderExplosionSprite.x = INVADER_HIT_OFFSET_X;
        this.invaderExplosionSprite.y = INVADER_HIT_OFFSET_Y;
        this.collisionFlags = COLLISION_INVADER;
        this.collisionMask = COLLISION_MISSILE | COLLISION_MISSILE_BASE;
        this.deathRay = VFDGameObject.createGameObject(DeathRay);
        this.showNormal();
    }

    reset()
    {
        this.resetVisibility();
        this.firingInterval = new Interval(DifficultySetting.difficulty.invaderFiringDelay);
        this.movement.delay = DifficultySetting.difficulty.invaderMovementDelay;
        this.row = 1;
        this.col = 0;
        this.movement.update();
        this.deathRay.enabled = false;
        this.deathRay.hide();
    }

    public onRowUpdated(newRow: number)
    {
        this.changeTexturesForRow(newRow);
        if (this.hasLanded)
        {
            this.dispatchOnLanded();
        }
    }

    public onCollision(other: GameObject)
    {
        if (other instanceof Missile)
        {
            this.die();
        }
    }

    public get hasLanded(): boolean
    {
        return (this.row == BOTTOM_ROW);
    }

    protected get isDeathRayAvailable(): boolean
    {
        return !this.deathRay.enabled;
    }

    protected _canMoveLeft(): boolean
    {
        return (super._canMoveLeft() && this.controller.isPlayfieldSpotEmpty(this.col - 1, this.row));
    }

    protected _canMoveRight(): boolean
    {
        return (super._canMoveRight() && this.controller.isPlayfieldSpotEmpty(this.col + 1, this.row));
    }

    protected _canMoveDown(): boolean
    {
        return (super._canMoveDown() && this.controller.isPlayfieldSpotEmpty(this.col, this.row + 1));
    }

    public get canFireDeathRay(): boolean
    {
        return (!this.isDead && this.firingInterval.hasElapsed && this.isDeathRayAvailable);
    }

    public moveHorizontally()
    {
        let direction = Random.leftOrRight();
        if (direction == MovementDirection.Left)
        {
            if (!this.moveLeftIfCan())
            {
                this.moveRightIfCan();
            }
        }
        else
        {
            if (!this.moveRightIfCan())
            {
                this.moveLeftIfCan();
            }
        }
    }

    public get shouldFireDeathRay(): boolean
    {
        return (Random.next() < DifficultySetting.difficulty.invaderFiringChance);
    }

    public get shouldStepSideways(): boolean
    {
        return (Random.next() < DifficultySetting.difficulty.invaderStepSidewaysChance);
    }

    public get shouldStepDown(): boolean
    {
        return (Random.next() < DifficultySetting.difficulty.invaderStepDownChance);
    }

    public fireIfCan()
    {
        if (!this.canFireDeathRay || !this.shouldFireDeathRay)
        {
            return;
        }

        this.fireDeathRay();
    }

    public fireDeathRay()
    {
        this.deathRay.fire(this.col, this.row);
    }

    public moveIfCan()
    {
        if (!this.canMove)
        {
            return;
        }

        this.move();
    }

    public move()
    {
        if (this.shouldStepSideways)
        {
            this.moveHorizontally();
        }
        else if (this.shouldStepDown)
        {
            this.moveDownIfCan();
        }

        this.dispatchOnMove();
    }

    public enterPlayfield()
    {
        super.enterPlayfield();
        // NOTE clever algorithm to determine invader starting position that ultimately proved to be unnecessary.
        // let possiblePositions = COLUMN_COUNT * DifficultySetting.difficulty.invaderLowestStartingRow / DifficultySetting.difficulty.invaderCount;
        // let randomPosition = Random.nextIntExclusive(0, Math.floor(possiblePositions));
        // let invaderStartingPosition = randomPosition * DifficultySetting.difficulty.invaderCount + this.index;
        // let col = Math.floor(invaderStartingPosition % COLUMN_COUNT);
        // let row = Math.floor(invaderStartingPosition / COLUMN_COUNT)+ INVADER_HIGHEST_ROW;

        // determine a valid, random starting location for the invader that isn't occupied by another invader
        let col;
        let row;
        do
        {
            col = Random.between(LEFT_COLUMN, RIGHT_COLUMN);
            row = Random.between(INVADER_HIGHEST_ROW, DifficultySetting.difficulty.invaderLowestStartingRow);
        } while (!this.controller.isPlayfieldSpotEmpty(col, row));

        this.row = row;
        this.col = col;
    }

    public get pointValue(): number
    {
        return this.rowPointValues[this.row];
    }

    public update()
    {
        if (this.exitPlayfieldIfDone())
        {
            return;
        }

        this.moveIfCan();
        this.fireIfCan();

    }

    private changeTexturesForRow(newRow: number)
    {
        if ((newRow < INVADER_HIGHEST_ROW) || (newRow > BOTTOM_ROW))
        {
            return;
        }

        this.invaderSprite.texture = TextureCache[this.invaderTextureNames[newRow]];
    }

    private dispatchOnLanded()
    {
        for (let callback of this.onLanded)
        {
            callback(this);
        }
    }

    public showNormal()
    {
        this.invaderSprite.visible = true;
        this.invaderExplosionSprite.visible = false;
        // TODO send network event
    }

    public showDead()
    {
        this.invaderExplosionSprite.visible = true;
        this.invaderSprite.visible = false;
        // TODO send network event
    }

    public shutdownGame(): void
    {
        this.enabled = false;
        this.deathRay.shutdownGame();
    }

    public restartMission()
    {
        this.reset();
        this.enabled = false;
        this.hide();
        this.deathRay.reset();
    }

}
