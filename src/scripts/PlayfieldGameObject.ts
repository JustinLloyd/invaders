import GameObject from "./GameObject";
import {BOTTOM_ROW, DEFAULT_DEATH_DELAY, DEFAULT_MOVEMENT_DELAY, LEFT_COLUMN, RIGHT_COLUMN, TOP_ROW} from "./Constants";
import Interval from "./Interval";
import Validation from "./Validation";
import VFDGameObject from "./VFDGameObject";

export default class PlayfieldGameObject extends VFDGameObject
{
    protected isRowLocked: boolean;
    protected isColLocked: boolean;
    protected isLockedToPlayfield: boolean;
    protected rowOffset: number = 0;
    protected rowStep: number = 0;
    protected colOffset: number = 0;
    protected colStep: number = 0;
    protected _row: number = 0;
    protected _col: number = 0;
    protected _isDead: boolean = false;

    public onEnterPlayfield?: (GameObject) => void;
    public onDead?: (GameObject) => void;
    public onMove?: (GameObject) => void;
    public onExitPlayfield?: (GameObject) => void;
    protected movement: Interval = new Interval(DEFAULT_MOVEMENT_DELAY);
    protected death: Interval = new Interval(DEFAULT_DEATH_DELAY);

    public get isDead(): boolean
    {
        return this._isDead;
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

        if (this.isLockedToPlayfield == true)
        {
            Validation.range(newRow, TOP_ROW, BOTTOM_ROW);
            // if ((newRow < TOP_ROW) || (newRow > BOTTOM_ROW))
            // {
            //     throw new RangeError("Row value must be between 0 and 6");
            // }
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

        if (this.isLockedToPlayfield == true)
        {
            Validation.range(newCol, LEFT_COLUMN, RIGHT_COLUMN);
            // if ((newCol < LEFT_COLUMN) || (newCol > RIGHT_COLUMN))
            // {
            //     throw new RangeError("Column value must be between 0 and 2");
            // }
        }

        this._col = newCol;
        this.container.x = this._col * this.colStep + this.colOffset;
        this.onColUpdated(newCol);
    }

    protected get canMoveLeft(): boolean
    {
        return (this._col > LEFT_COLUMN || !this.isLockedToPlayfield);
    }

    protected get canMoveRight(): boolean
    {
        return (this._col < RIGHT_COLUMN || !this.isLockedToPlayfield);
    }

    protected get canMoveUp(): boolean
    {
        return (this._row > TOP_ROW || !this.isLockedToPlayfield);
    }

    protected get canMoveDown(): boolean
    {
        return (this._row < BOTTOM_ROW || !this.isLockedToPlayfield);
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
            this.onDead(this);
        }

    }

    protected dispatchOnExitPlayfield()
    {
        if (this.onExitPlayfield)
        {
            this.onExitPlayfield(this);
        }

    }

    protected dispatchOnEnterPlayfield()
    {
        if (this.onEnterPlayfield)
        {
            this.onEnterPlayfield(this);
        }

    }

    protected dispatchOnMove()
    {
        if (this.onMove)
        {
            this.onMove(this);
        }

    }
}
