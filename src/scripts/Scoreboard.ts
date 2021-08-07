import {Sprite, utils} from "pixi.js";
import GameObject from "./GameObject";
import {
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
import VFDGameObject from "./VFDGameObject";
import Validation from "./Validation";
import DifficultySetting, {DIFFICULTY_0_BONUS_POINT_VALUE} from "./DifficultySetting";

let TextureCache = utils.TextureCache;

export default class Scoreboard extends VFDGameObject
{
    protected _points: number;
    private digitSprites: Array<Sprite>;
    private digitTextures: Array<string>;
    public onPointsUpdated?: Array<(points: number) => void> = new Array<(points: number) => void>();
    public onMaximumPointsAchieved: Array<(points: number) => void> = new Array<(points: number) => void>();
    public onMaximumPointsUpdated: Array<(points: number) => void> = new Array<(points: number) => void>();
    protected _maximumPoints: number;

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
        this._points = 0;
        this.setDisplayDigits(this._points);
    }

    public set points(points: number)
    {
        Validation.gte(points, 0);

        this._points = Math.min(this._maximumPoints, points);
        this.setDisplayDigits(this._points);
        // TODO send server event
        this.dispatchOnPointsUpdated(this._points);
        if (this._points >= this._maximumPoints)
        {
            console.log("On maximum points reached, dispatching maximum pointsevent");
            this.dispatchOnMaximumPointsAchieved(this._points);
        }
    }

    public addPoints(points: number)
    {
        Validation.gt(points, 0);
        Validation.lte(points, DifficultySetting.difficulty.bonusPointValue);
        this.points += points;
        // TODO send server event
    }

    protected setDisplayDigits(points: number)
    {
        let divisor = 100;
        for (let digit = 0; digit < 3; digit++)
        {
            let result = Math.floor(points / divisor % 10);
            let remainder = points % divisor;
            divisor /= 10;
            this.digitSprites[digit].visible = (result > 0) || (digit == 2) || (points / divisor >= 10);
            this.digitSprites[digit].texture = TextureCache[this.digitTextures[result]];
        }
    }

    public get maximumPoints(): number
    {
        return (this._maximumPoints);
    }

    public set maximumPoints(maximumPoints: number)
    {
        Validation.gte(maximumPoints, 0);

        if (maximumPoints == this._maximumPoints)
        {
            return;
        }

        this._maximumPoints = maximumPoints;
        this.dispatchOnMaximumPointsUpdated();

    }

    public get points(): number
    {
        return this._points;
    }

    private dispatchOnPointsUpdated(points: number)
    {
        for (let callback of this.onPointsUpdated)
        {
            callback(points);
        }
    }

    private dispatchOnMaximumPointsAchieved(points: number)
    {
        for (let callback of this.onMaximumPointsAchieved)
        {
            callback(points);
        }
    }

    public dispatchOnMaximumPointsUpdated()
    {
        for (let callback of this.onMaximumPointsUpdated)
        {
            callback(this._maximumPoints);
        }
    }
}

