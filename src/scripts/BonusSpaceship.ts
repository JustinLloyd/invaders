import {GameObject} from "./GameObject";

const BONUS_SPACESHIP_COL_STEP = 100;
const BONUS_SPACESHIP_COL_OFFSET = 10;
const BONUS_SPACESHIP_Y = 10;

export class BonusSpaceship extends GameObject
{
    col: number;

    public update()
    {

        this.x = this.col * BONUS_SPACESHIP_COL_STEP + BONUS_SPACESHIP_COL_OFFSET;
        this.y = BONUS_SPACESHIP_Y;
    }

    public draw()
    {
    }

}
