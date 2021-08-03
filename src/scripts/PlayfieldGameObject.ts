import * as PIXI from 'pixi.js';
import {GameObject} from "./GameObject";
import {BOTTOM_ROW, LEFT_COLUMN, RIGHT_COLUMN, TOP_ROW} from "./Constants";

// let TextureCache = PIXI.utils.TextureCache;

export class PlayfieldGameObject extends GameObject
{
    protected isRowLocked: boolean;
    protected isColLocked: boolean;
    protected canMoveOutsidePlayfield: boolean;
    protected rowOffset: number = 0;
    protected rowStep: number = 0;
    protected colOffset: number = 0;
    protected colStep: number = 0;
    protected _row: number = 0;
    protected _col: number = 0;
    public onAppear?: () => void;
    public onDead?: () => void;
    public onMove?: () => void;
    public onExitPlayfield?: () => void;
    public lastMovementTime: number = 0;
    public movementDelay:number=100;

    public get isMovementTimeElapsed(): boolean
    {
        return (Date.now() - this.lastMovementTime) >= this.movementDelay;
    }

    public updateLastMovementTime()
    {
        this.lastMovementTime = Date.now();
    }

    public resetLastMovementTime()
    {
        this.lastMovementTime=0;
    }

    public get row(): number
    {
        return this._row;
    }

    protected getRow(): number
    {
        return this._row;
    }

    public setRow(newRow: number)
    {
        if (this.isRowLocked == true)
        {
            throw new RangeError("Row on this VFD game object is locked");
        }

        if (this.canMoveOutsidePlayfield == false)
        {
            if ((newRow < TOP_ROW) || (newRow > BOTTOM_ROW))
            {
                throw new RangeError("Row value must be between 0 and 6");
            }
        }

        this._row = newRow;
        this.container.y = this._row * this.rowStep + this.rowOffset;
        this.onRowUpdated(newRow);
//        this.onRowUpdated.call(this,newRow)
    }

    public set row(value: number)
    {
        this.setRow(value);
    }

    public onRowUpdated(newRow: number)
    {
        // do nothing
    }

    protected getCol(): number
    {
        return this._col;
    }

    public get col(): number
    {
        return this.getCol();
    }

    protected setCol(newCol: number)
    {
        if (this.isColLocked == true)
        {
            throw new RangeError("Column on this VFD game object is locked");
        }

        if (this.canMoveOutsidePlayfield == false)
        {
            if ((newCol < LEFT_COLUMN) || (newCol > RIGHT_COLUMN))
            {
                throw new RangeError("Column value must be between 0 and 2");
            }
        }

        this._col = newCol;
        this.container.x = this._col * this.colStep + this.colOffset;
        this.onColUpdated(newCol);
    }

    protected get canMoveLeft(): boolean
    {
        return (this._col > LEFT_COLUMN || this.canMoveOutsidePlayfield);
    }

    protected get canMoveRight(): boolean
    {
        return (this._col < RIGHT_COLUMN || this.canMoveOutsidePlayfield);
    }

    protected get canMoveUp(): boolean
    {
        return (this._row > TOP_ROW || this.canMoveOutsidePlayfield);
    }

    protected get canMoveDown(): boolean
    {
        return (this._row < BOTTOM_ROW || this.canMoveOutsidePlayfield);
    }

    public set col(value: number)
    {
        this.setCol(value);
    }

    public onColUpdated(newCol: number)
    {
        // do nothing
    }

    protected dispatchOnDead()
    {
        if (this.onDead)
        {
            this.onDead();
        }

    }

    protected dispatchOnExitPlayfield()
    {
        if (this.onExitPlayfield)
        {
            this.onExitPlayfield();
        }

    }

    protected dispatchOnAppear()
    {
        if (this.onAppear)
        {
            this.onAppear();
        }

    }

    protected dispatchOnMove()
    {
        if (this.onMove)
        {
            this.onMove();
        }

    }
}
