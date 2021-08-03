import {Sprite, utils} from "pixi.js";
import {GameObject} from "./GameObject";
import {
    MAX_SCORE,
    SCOREBOARD_OFFSET_X,
    SCOREBOARD_OFFSET_Y,
    SCOREBOARD_STEP_X,
    TEXTURE_DIGIT_00,
    TEXTURE_DIGIT_01,
    TEXTURE_DIGIT_02,
    TEXTURE_DIGIT_03,
    TEXTURE_DIGIT_04,
    TEXTURE_DIGIT_05,
    TEXTURE_DIGIT_06,
    TEXTURE_DIGIT_07,
    TEXTURE_DIGIT_08,
    TEXTURE_DIGIT_09
} from "./Constants";

let TextureCache = utils.TextureCache;

export class Scoreboard extends GameObject
{
    _score: number;
    private digitSprites: Array<Sprite>;
    private digitTextures: Array<string>;
    public onScoreUpdated?: (score: number) => void;

    init()
    {
        this.digitTextures = [
            TEXTURE_DIGIT_00,
            TEXTURE_DIGIT_01,
            TEXTURE_DIGIT_02,
            TEXTURE_DIGIT_03,
            TEXTURE_DIGIT_04,
            TEXTURE_DIGIT_05,
            TEXTURE_DIGIT_06,
            TEXTURE_DIGIT_07,
            TEXTURE_DIGIT_08,
            TEXTURE_DIGIT_09
        ];
        this.digitSprites = new Array<Sprite>();
        for (let digit = 0; digit < 3; digit++)
        {
            let digitSprite = new Sprite(TextureCache[TEXTURE_DIGIT_00]);
            digitSprite.x = SCOREBOARD_STEP_X * digit;
            digitSprite.y = 0;
            digitSprite.anchor.set(1, 0);
            this.digitSprites.push(digitSprite);
            this.container.addChild(digitSprite);
            this.container.x = SCOREBOARD_OFFSET_X;
            this.container.y = SCOREBOARD_OFFSET_Y;
        }

    }

    reset()
    {
        this.digitSprites.forEach(value =>
        {
            value.visible = true;
            value.texture = TextureCache[TEXTURE_DIGIT_00];
        });

        this.score = 0;
    }

    public set score(value: number)
    {
        if (value < 0)
        {
            throw new RangeError("Score is out of range");
        }

        this._score = Math.min(MAX_SCORE, value);
        this.setDisplayDigits(this._score);
        // TODO send server event
        this.dispatchOnScoreUpdated(this._score);
    }

    public addPoints(points: number)
    {
        this.score += points;
        // TODO send server event
    }

    protected setDisplayDigits(score: number)
    {
        let divisor = 100;
        for (let digit = 0; digit < 3; digit++)
        {
            let result = Math.floor(score / divisor % 10);
            let remainder = score % divisor;
            divisor /= 10;
            this.digitSprites[digit].visible = (result > 0) || (digit == 2) || (score / divisor >= 10);
            this.digitSprites[digit].texture = TextureCache[this.digitTextures[result]];
        }
    }

    public get score(): number
    {
        return this._score;
    }

    private dispatchOnScoreUpdated(score: number)
    {
        if (this.onScoreUpdated)
        {
            this.onScoreUpdated(score);
        }
    }
}

