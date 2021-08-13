// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {utils} from 'pixi.js';
import VFDGameObject from "./VFDGameObject";
import Validation from "./Validation";

export default class LivesIndicator extends VFDGameObject
{
    protected _lives: number;
    protected _maximumLives: number = 3;
    public onLifeDeducted: Array<(livesIndicator: LivesIndicator, lives: number) => void> = new Array<(livesIndicator: LivesIndicator, lives: number) => void>();
    public onLifeAdded: Array<(livesIndicator: LivesIndicator, lives: number) => void> = new Array<(livesIndicator: LivesIndicator, lives: number) => void>();
    public onLivesUpdated: Array<(livesIndicator: LivesIndicator, lives: number) => void> = new Array<(livesIndicator: LivesIndicator, lives: number) => void>();
    public onOutOfLives: Array<(livesIndicator: LivesIndicator) => void> = new Array<(livesIndicator: LivesIndicator) => void>();
    public onMaximumLivesAchieved: Array<(livesIndicator: LivesIndicator) => void> = new Array<(livesIndicator: LivesIndicator) => void>();

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
