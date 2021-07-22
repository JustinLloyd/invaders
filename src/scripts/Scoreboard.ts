import {GameObject} from "./GameObject";

export class Scoreboard extends GameObject
{
    score: number;
    constructor()
    {
        super();
        this.score = 0;
    }
}

