import {Sprite, utils} from 'pixi.js';
import {PlayfieldGameObject} from "./PlayfieldGameObject";
import {
    BOTTOM_ROW,
    COLLISION_INVADER,
    COLLISION_MISSILE,
    COLLISION_MISSILE_BASE,
    INVADER_COL_OFFSET,
    INVADER_COL_STEP,
    INVADER_EXPLOSION_OFFSET_X,
    INVADER_EXPLOSION_OFFSET_Y,
    INVADER_ROW_OFFSET,
    INVADER_ROW_STEP,
    TEXTURE_INVADER_01,
    TEXTURE_INVADER_02,
    TEXTURE_INVADER_HIT,
    TEXTURE_INVADER_LANDED,
    TOP_ROW
} from "./Constants";
import {GameObject} from "./GameObject";
import {DeathRay} from "./DeathRay";

let TextureCache = utils.TextureCache;

export class Invader extends PlayfieldGameObject
{
    rowPointValues: Array<number> = [3, 2, 1, 1, 0, 0];
    invaderTextureNames: Array<string>;
    invaderSprite: Sprite;
    invaderExplosionSprite: Sprite;
    lastMovementTime: number;
    deathRay: DeathRay;
    _isDead: boolean;

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
        this.deathRay = GameObject.CreateGameObject(DeathRay);
        this.collisionFlags = COLLISION_INVADER;
        this.collisionMask = COLLISION_MISSILE | COLLISION_MISSILE_BASE;
    }

    reset()
    {
        this.invaderSprite.visible = true;
        this.invaderExplosionSprite.visible = false;
        this.row = 1;
        this.col = 0;
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
            this.lastMovementTime = Date.now();
            // TODO send network event
        }

    }

    public moveRight()
    {
        if (this.canMoveRight)
        {
            this.col++;
            this.lastMovementTime = Date.now();
            // TODO send network event
        }

    }

    public moveDown()
    {
        if (this.canMoveDown)
        {
            this.row++;
            this.lastMovementTime = Date.now();
            // TODO send network event
        }

    }

    public get canMove(): boolean
    {
        if (this.isDead)
        {
            return false;
        }

        if (!this.isMovementTimeElapsed)
        {
            return false;
        }

        return true;
    }

    public get hasLanded(): boolean
    {
        throw Error("not implemented");
    }

    public shouldAppear(): boolean
    {
        throw Error("not implemented");
    }

    public moveIfCan()
    {
        throw Error("not implemented");
    }

    public move()
    {
        throw Error("not implemented");
        this.dispatchOnMove();
    }

    public appear()
    {
        this.activate();
        this.reset();
        this.row = Math.floor(1 + Math.random() * 2);
        this.col = Math.floor(Math.random() * 3);
        this.dispatchOnAppear();
    }

    public die()
    {
        this.invaderExplosionSprite.visible = true;
        this.invaderSprite.visible = false;
        this._isDead = true;
        this.dispatchOnDead();
    }

    public get pointValue(): number
    {
        return this.rowPointValues[this.row];
    }

    public get isDead(): boolean
    {
        return this._isDead;
    }

    public update()
    {
        if (!this.canMove)
        {
            return;
        }


        if (this.isDead)
        {
            this.exitPlayfield();
        }

    }

    public exitPlayfield()
    {
        this.container.visible = false;
        this.deactivate();
    }

    private changeTexturesForRow(newRow: number)
    {
        if ((newRow < TOP_ROW) || (newRow > BOTTOM_ROW))
        {
            return;
        }

        this.invaderSprite.texture = TextureCache[this.invaderTextureNames[newRow]];
    }
}

