// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import VFDGameObject from './VFDGameObject';
import {Sprite, utils} from 'pixi.js';
import {INSTRUCTIONS_X_OFFSET, INSTRUCTIONS_Y_OFFSET, TEXTURE_INSTRUCTIONS} from './Constants';

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
    }

}
