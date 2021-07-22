import {GameObject} from "./GameObject";

const MISSILE_BASE_COL_OFFSET = 10;
const MISSILE_BASE_COL_STEP = 100;
const MISSILE_BASE_Y = 800;

export class MissileBase extends GameObject
{
    public col: number;

    public update()
    {
        this.x = this.col * MISSILE_BASE_COL_STEP + MISSILE_BASE_COL_OFFSET;
        this.y = MISSILE_BASE_Y;
    }

}

