import {GameObject} from "./GameObject";

export class Scoreboard extends GameObject
{
    score: number;
    private digitSegments:Array<string>;

    init()
    {
        this.score = 0;
    }
}

