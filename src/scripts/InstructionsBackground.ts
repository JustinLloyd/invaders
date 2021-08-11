// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import GameObject from './GameObject';
import {Sprite, utils} from 'pixi.js';
import {INSTRUCTIONS_X_OFFSET, INSTRUCTIONS_Y_OFFSET, TEXTURE_INSTRUCTIONS_BACKGROUND} from './Constants';

let TextureCache = utils.TextureCache;
export class InstructionsBackground extends GameObject
{
    backgroundSprite: Sprite;

    public init()
    {
        this.backgroundSprite = new Sprite(TextureCache[TEXTURE_INSTRUCTIONS_BACKGROUND]);
        this.container.addChild(this.backgroundSprite);
        this.container.x = INSTRUCTIONS_X_OFFSET;
        this.container.y = INSTRUCTIONS_Y_OFFSET;

    }
}
