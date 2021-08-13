// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import GameObject from "../lib/GameObject";
import {Sprite, utils} from "pixi.js";
import {TEXTURE_VFD_PLAYFIELD} from "./Constants";

let TextureCache = utils.TextureCache;

export default class Playfield extends GameObject
{
    playfieldSprite: Sprite;

    init()
    {
        this.playfieldSprite = new Sprite(TextureCache[TEXTURE_VFD_PLAYFIELD]);
        this.playfieldSprite.x = this.playfieldSprite.y = 0;
        this.container.addChild(this.playfieldSprite);
    }
}
