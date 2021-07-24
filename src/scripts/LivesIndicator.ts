import {GameObject} from "./GameObject";

export class LivesIndicator extends GameObject
{
    lives: number;
    init() {
        this.lives = 3;

    }
    public draw()
    {
        // retrieve the number of lives from the player
        // draw however many lives the player has
    }

    public isOutOfLives():boolean
    {
        return false;
    }
}
