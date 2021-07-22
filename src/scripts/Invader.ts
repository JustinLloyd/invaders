import {GameObject} from "./GameObject";

const INVADER_COL_STEP = 100;
const INVADER_ROW_STEP = 100;
const INVADER_COL_OFFSET = 10;
const INVADER_ROW_OFFSET = 0;

export class Invader extends GameObject
{
    row: number;
    col: number;

    public draw()
    {
        this.x = this.col * INVADER_COL_STEP + INVADER_COL_OFFSET;
        this.y = this.row * INVADER_ROW_STEP + INVADER_ROW_OFFSET;
        super.draw();
    }
}

