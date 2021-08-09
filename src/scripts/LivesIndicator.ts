import {Sprite, utils} from 'pixi.js';
import {LIVES_INDICATOR_X_OFFSET, LIVES_INDICATOR_X_STEP, LIVES_INDICATOR_Y_OFFSET} from "./Constants";
import VFDGameObject from "./VFDGameObject";
import Validation from "./Validation";

let TextureCache = utils.TextureCache;

export default class LivesIndicator extends VFDGameObject
{
    protected _lives: number;
    protected _maximumLives: number = 3;
    indicatorSprites: Array<Sprite>;
    public onLifeDeducted: Array<(livesIndicator: LivesIndicator, lives: number) => void> = new Array<(livesIndicator: LivesIndicator, lives: number) => void>();
    public onLifeAdded: Array<(livesIndicator: LivesIndicator, lives: number) => void> = new Array<(livesIndicator: LivesIndicator, lives: number) => void>();
    public onLivesUpdated: Array<(livesIndicator: LivesIndicator, lives: number) => void> = new Array<(livesIndicator: LivesIndicator, lives: number) => void>();
    public onOutOfLives: Array<(livesIndicator: LivesIndicator) => void> = new Array<(livesIndicator: LivesIndicator) => void>();
    public onMaximumLivesAchieved: Array<(livesIndicator: LivesIndicator) => void> = new Array<(livesIndicator: LivesIndicator) => void>();

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

        this._lives++;
        if (this._lives == this._maximumLives)
        {
            this.dispatchOnMaximumLivesAchieved();
        }

        this.dispatchOnLifeAdded();
        this.dispatchOnLivesUpdated();
    }

    public deductLife()
    {
        if (this._lives <= 0)
        {
            return;
        }

        this._lives--;
        this.indicatorSprites[this._lives].visible = false;
        this.dispatchOnLifeDeducted();
        this.dispatchOnLivesUpdated();
        if (this.isOutOfLives)
        {
            this.dispatchOnOutOfLives();
        }
    }

    public dispatchOnLifeDeducted()
    {
        for (let callback of this.onLifeDeducted)
        {
            callback(this, this._lives);
        }
    }

    public dispatchOnLifeAdded()
    {
        for (let callback of this.onLifeAdded)
        {
            callback(this, this._lives);
        }
    }

    public dispatchOnLivesUpdated()
    {
        for (let callback of this.onLivesUpdated)
        {
            callback(this, this._lives);
        }
    }


    public dispatchOnMaximumLivesAchieved()
    {
        for (let callback of this.onMaximumLivesAchieved)
        {
            callback(this);
        }
    }

    public dispatchOnOutOfLives()
    {
        for (let callback of this.onOutOfLives)
        {
            callback(this);
        }
    }

    public get lives(): number
    {
        return this._lives;
    }

    public get isOutOfLives(): boolean
    {
        return this._lives <= 0;
    }
}
