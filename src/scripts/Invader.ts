import {Sprite, utils} from 'pixi.js';
import {
    BOTTOM_ROW,
    COLLISION_INVADER,
    COLLISION_MISSILE,
    COLLISION_MISSILE_BASE, COLUMN_COUNT,
    INVADER_COL_OFFSET,
    INVADER_COL_STEP,
    INVADER_EXPLOSION_OFFSET_X,
    INVADER_EXPLOSION_OFFSET_Y,
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
import InvaderController from './InvaderController';

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
    stepSidewaysInterval: Interval = new Interval();
    stepDownInterval: Interval = new Interval();

    public onLanded?: (Invader) => void;
    public index: number;
    public controller: InvaderController;

    init()
    {
        this.rowOffset = INVADER_ROW_OFFSET;
        this.rowStep = INVADER_ROW_STEP;
        this.colOffset = INVADER_COL_OFFSET;
        this.colStep = INVADER_COL_STEP;
        this.invaderTextureNames = [null, TEXTURE_INVADER_02, TEXTURE_INVADER_01, TEXTURE_INVADER_02, TEXTURE_INVADER_01, TEXTURE_INVADER_02, TEXTURE_INVADER_LANDED];
        this.invaderSprite = new Sprite(TextureCache[this.invaderTextureNames[0]]);
        this.container.addChild(this.invaderSprite);
        this.invaderExplosionSprite = new Sprite(TextureCache[TEXTURE_INVADER_HIT]);
        this.container.addChild(this.invaderExplosionSprite);
        this.invaderExplosionSprite.visible = false;
        this.invaderExplosionSprite.x = INVADER_EXPLOSION_OFFSET_X;
        this.invaderExplosionSprite.y = INVADER_EXPLOSION_OFFSET_Y;
        this.deathRay = GameObject.createGameObject(DeathRay);
        this.collisionFlags = COLLISION_INVADER;
        this.collisionMask = COLLISION_MISSILE | COLLISION_MISSILE_BASE;
        this.stepSidewaysInterval.delay = DifficultySetting.difficulty.invaderStepSidewaysDelay;
        this.stepDownInterval.delay = DifficultySetting.difficulty.invaderStepDownDelay;
    }

    reset()
    {
        this.resetVisibility();
        this.row = 1;
        this.col = 0;
        this.movement.reset();
    }

    public onRowUpdated(newRow: number)
    {
        this.changeTexturesForRow(newRow);
    }

    public onCollision(other: GameObject)
    {
        this.die();
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

    public moveDown()
    {
        if (this.canMoveDown)
        {
            this.row++;
            this.movement.update();
            // TODO send network event
        }

    }

    public get canMove(): boolean
    {
        return (!this.isDead && this.movement.hasElapsed);
    }

    public get hasLanded(): boolean
    {
        throw Error("not implemented");
    }

    public moveIfCan()
    {
        if (!this.canMove)
        {
            return;
        }

        let shouldStepSideways = Random.next() < DifficultySetting.difficulty.invaderStepSidewaysChance;
        let shouldStepDown = Random.next() < DifficultySetting.difficulty.invaderStepDownChance;

        // throw Error("not implemented");
    }

    public move()
    {
        throw Error("not implemented");
        this.dispatchOnMove();
    }

    public enterPlayfield()
    {
        this.resetVisibility();
        this._isDead = false;
        this.enabled = true;
        //throw new Error("Fix this shit dude!");
        // for (;;)
        let possiblePositions = COLUMN_COUNT * DifficultySetting.difficulty.invaderLowestStartingRow / DifficultySetting.difficulty.invaderCount;
        let randomPosition = Random.nextIntExclusive(0, Math.floor(possiblePositions));
        let invaderStartingPosition = randomPosition * DifficultySetting.difficulty.invaderCount + this.index;
        let col = Math.floor(invaderStartingPosition % COLUMN_COUNT);
        let row = Math.floor(invaderStartingPosition / COLUMN_COUNT)+ INVADER_HIGHEST_ROW;

        // let row = Random.between(INVADER_HIGHEST_ROW, DifficultySetting.difficulty.invaderLowestStartingRow);
        // let col = Random.between(LEFT_COLUMN, RIGHT_COLUMN);
        // console.log("invaderLowestStartingRow", DifficultySetting.difficulty.invaderLowestStartingRow, row);
        this.row = row;
        this.col = col;
        console.log("randomPosition", randomPosition, "invaderStartingPosition", invaderStartingPosition, "col", col, "row", row);

        this.dispatchOnEnterPlayfield();
    }

    public die()
    {
        this.showExplosion();
        this._isDead = true;
        this.death.update();
        this.dispatchOnDead();
    }

    public get pointValue(): number
    {
        return this.rowPointValues[this.row];
    }

    public update()
    {
        if (this.isDead && this.death.hasElapsed)
        {
            this.exitPlayfield();
            return;
        }

        this.moveIfCan();

    }

    public exitPlayfield()
    {
        this.enabled = false;
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
        if (this.onLanded)
        {
            this.onLanded(this);
        }
    }

    private resetVisibility()
    {
        this.show();
        this.showNormal();
        // TODO send network event

    }

    private showNormal()
    {
        this.invaderSprite.visible = true;
        this.invaderExplosionSprite.visible = false;
    }

    private showExplosion()
    {
        this.invaderExplosionSprite.visible = true;
        this.invaderSprite.visible = false;
    }
}

