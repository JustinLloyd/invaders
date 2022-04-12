// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {Sprite, utils} from 'pixi.js';
import {LIVES_INDICATOR_X_OFFSET, LIVES_INDICATOR_X_STEP, LIVES_INDICATOR_Y_OFFSET} from './Constants';
import LivesIndicator from '../lib/LivesIndicator';

let TextureCache = utils.TextureCache;

export default class InvaderLivesIndicator extends LivesIndicator
{
    indicatorSprites: Array<Sprite>;

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

    reset()
    {
        super.reset();
        this.indicatorSprites.forEach(value => value.visible = true);
    }

    public addLife()
    {
        super.addLife();
        this.indicatorSprites[this._lives].visible = true;
    }

    public deductLife()
    {
        super.deductLife()
        this.indicatorSprites[this._lives].visible = false;
    }

}
