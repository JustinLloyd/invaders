import * as PIXI from 'pixi.js';
import GameObject from "./GameObject";
import {Sprite, utils} from "pixi.js";
import {LIVES_INDICATOR_X_OFFSET, LIVES_INDICATOR_X_STEP, LIVES_INDICATOR_Y_OFFSET} from "./Constants";
import VFDGameObject from "./VFDGameObject";
import Validation from "./Validation";

let TextureCache = utils.TextureCache;

export default class LivesIndicator extends VFDGameObject
{
    protected _lives: number;
    protected _maximumLives: number=3;
    indicatorSprites: Array<Sprite>;
    public onLifeDeducted?: (lives: number) => void;
    public onLifeAdded?: (lives: number) => void;
    public onLivesUpdated?: (lives: number) => void;
    public onOutOfLives?: () => void;
    public onMaximumLivesAchieved?: () => void;

    public init()
    {
        this.indicatorSprites = new Array<Sprite>();
        this.container.x = LIVES_INDICATOR_X_OFFSET;
        this.container.y = LIVES_INDICATOR_Y_OFFSET;
    }

    public start()
    {
        for (let i = 0; i < this._maximumLives; i++)
        {
            let indicatorSprite = new Sprite(TextureCache['lives-indicator']);
            indicatorSprite.x = i * LIVES_INDICATOR_X_STEP;
            indicatorSprite.y = 0;
            //indicatorSprite.anchor.set(0, 0);
            this.container.addChild(indicatorSprite);
            this.indicatorSprites.push(indicatorSprite);
        }
    }

    public get maximumLives(): number
    {
        return this._maximumLives;
    }

    public set maximumLives(maximumLives: number)
    {
        Validation.gte(maximumLives, 1);
        this._maximumLives = maximumLives;
    }

    reset()
    {
        this._lives = this._maximumLives;
        this.indicatorSprites.forEach(value => value.visible = true);
    }

    public addLife()
    {
        if (this._lives >= this._maximumLives)
        {
            return;
        }

        if (this._lives == this._maximumLives)
        {
            this.dispatchOnMaximumLivesAchieved();
        }

        this.dispatchOnLifeAdded();
        this.dispatchOnLivesUpdated();
    }

    public deductLife()
    {
        if (this._lives > 0)
        {
            this._lives--;
            this.indicatorSprites[this._lives].visible = false;
            this.dispatchOnLifeDeducted();
            this.dispatchOnLivesUpdated();
            if (this.isOutOfLives)
            {
                this.dispatchOnOutOfLives();
            }

        }
    }

    public dispatchOnLifeDeducted()
    {
        if (this.onLifeDeducted)
        {
            this.onLifeDeducted(this._lives);
        }
    }

    public dispatchOnLifeAdded()
    {
        if (this.onLifeAdded)
        {
            this.onLifeAdded(this._lives);
        }
    }

    public dispatchOnLivesUpdated()
    {
        if (this.onLivesUpdated)
        {
            this.onLivesUpdated(this._lives);
        }
    }


    public dispatchOnMaximumLivesAchieved()
    {
        if (this.onMaximumLivesAchieved)
        {
            this.onMaximumLivesAchieved();
        }
    }

    public dispatchOnOutOfLives()
    {
        if (this.onOutOfLives)
        {
            this.onOutOfLives();
        }
    }

    public get lives(): number
    {
        return this._lives;
    }

    public get isOutOfLives(): boolean
    {
        return this._lives == 0;
    }
}
