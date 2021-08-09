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
    public minRow: number = TOP_ROW;
    public maxRow: number = BOTTOM_ROW;
    public minCol: number = LEFT_COLUMN;
    public maxCol: number = RIGHT_COLUMN;

    public onEnterPlayfield: Array<(GameObject) => void> = new Array<(GameObject) => void>();
    public onDead: Array<(GameObject) => void> = new Array<(GameObject) => void>();
    public onMove: Array<(GameObject) => void> = new Array<(GameObject) => void>();
    public onExitPlayfield: Array<(GameObject) => void> = new Array<(GameObject) => void>();
    protected movement: Interval = new Interval(DEFAULT_MOVEMENT_DELAY);
    protected death: Interval = new Interval(DEFAULT_DEATH_DELAY);

    public reset()
    {
        this._isDead = false;
        this.movement.reset();
        this.death.reset();
    }

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
        }

        this._col = newCol;
        this.container.x = this._col * this.colStep + this.colOffset;
        this.onColUpdated(newCol);
    }

    protected _canMoveLeft(): boolean
    {
        return (this._canMove() && (this._col > LEFT_COLUMN || !this.isLockedToPlayfield));
    }

    public get canMoveLeft(): boolean
    {
        return (this._canMoveLeft());
    }

    public get canMoveRight(): boolean
    {
        return (this._canMoveRight());
    }

    protected _canMoveRight(): boolean
    {
        return (this._canMove() && (this._col < RIGHT_COLUMN || !this.isLockedToPlayfield));
    }

    public _canMoveUp(): boolean
    {
        return (this._canMove() && (this._row > TOP_ROW || !this.isLockedToPlayfield));
    }

    public get canMoveUp(): boolean
    {
        return (this._canMoveUp());
    }

    protected _canMoveDown(): boolean
    {
        return (this._canMove() && (this._row < BOTTOM_ROW || !this.isLockedToPlayfield));
    }

    public get canMoveDown(): boolean
    {
        return this._canMoveDown();
    }

    public set col(value: number)
    {
        this.setCol(value);
    }

    public onColUpdated(newCol: number)
    {
        // do nothing
    }

    protected _canMove(): boolean
    {
        return this.movement.hasElapsed && !this.isDead;
    }

    public get canMove(): boolean
    {
        return this._canMove();
    }

    protected _isDone(): boolean
    {
        return this.row < this.minRow
            || this.row > this.maxRow
            || this.col < this.minCol
            || this.col > this.maxCol
            || (this.isDead && this.death.hasElapsed);

    }

    public get isDone(): boolean
    {
        return this._isDone();
    }

    public exitPlayfieldIfDone()
    {
        if (!this.isDone)
        {
            return false;
        }

        this.exitPlayfield();
        return true;
    }

    public enterPlayfield()
    {
        this.enabled = true;
        this.resetVisibility();
        this.dispatchOnEnterPlayfield();
        this.movement.update();
        this.death.reset();
        this._isDead = false;

        // TODO send a network event here
    }

    public exitPlayfield()
    {
        this.enabled = false;
        this.hide();
        this.dispatchOnExitPlayfield();
        this._isDead = false;
        // TODO send a network event here
    }


    public moveLeftIfCan():boolean
    {
        if (!this.canMoveLeft)
        {
            return false;
        }

        this.moveLeft();
        return true;

    }

    public moveRightIfCan() :boolean
    {
        if (!this.canMoveRight)
        {
            return false;
        }

        this.moveRight();
        return true;
    }

    public moveLeft()
    {
        this.col--;
        this.movement.update();
        // TODO send network event
    }

    public moveRight()
    {
        this.col++;
        this.movement.update();
        // TODO send network event
    }

    public moveUpIfCan():boolean
    {
        if (!this.canMoveUp)
        {
            return false;
        }

        this.moveUp();
        return true;
    }

    public moveUp()
    {
        this.row--;
        this.movement.update();
        // TODO send network event
    }

    public moveDownIfCan():boolean
    {
        if (!this.canMoveDown)
        {
            return false;
        }

        this.moveDown();
        return true;
    }

    public moveDown()
    {
        this.row++;
        this.movement.update();
        // TODO send network event

    }

    protected dispatchOnDead()
    {
        for (let callback of this.onDead)
        {
            callback(this);
        }

    }

    protected dispatchOnExitPlayfield()
    {
        for (let callback of this.onExitPlayfield)
        {
            callback(this);
        }

    }

    protected dispatchOnEnterPlayfield()
    {
        for (let callback of this.onEnterPlayfield)
        {
            callback(this);
        }

    }

    protected dispatchOnMove()
    {
        for (let callback of this.onMove)
        {
            callback(this);
        }

    }

    public die()
    {
        this._isDead = true;
        this.death.update();
        this.showDead();
        this.dispatchOnDead();
        // TODO send network event
    }

    public resetVisibility()
    {
        this.show();
        this.showNormal();
        // TODO send network event
    }

    public showDead()
    {
        // do nothing
    }

    public showNormal()
    {
        // do nothing
    }


}
