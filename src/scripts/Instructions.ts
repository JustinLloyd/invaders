// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import VFDGameObject from '../lib/VFDGameObject';
import {Sprite, utils} from 'pixi.js';
import {INSTRUCTIONS_TEXT_X_OFFSET, INSTRUCTIONS_TEXT_Y_OFFSET, INSTRUCTIONS_X_OFFSET, INSTRUCTIONS_Y_OFFSET, TEXTURE_INSTRUCTIONS} from './Constants';

let TextureCache = utils.TextureCache;

export class Instructions extends VFDGameObject
{
    instructionsSprite: Sprite;

    public init()
    {
        this.instructionsSprite = new Sprite(TextureCache[TEXTURE_INSTRUCTIONS]);
        this.container.addChild(this.instructionsSprite);
        this.container.x = INSTRUCTIONS_X_OFFSET;
        this.container.y = INSTRUCTIONS_Y_OFFSET;
        this.instructionsSprite.x=INSTRUCTIONS_TEXT_X_OFFSET;
        this.instructionsSprite.y=INSTRUCTIONS_TEXT_Y_OFFSET;
    }

}
