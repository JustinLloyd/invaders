import * as PIXI from 'pixi.js';
import {GameObject} from "./GameObject";
import {Sprite, Container, utils} from "pixi.js";
import {TEXTURE_VFD_PLAYFIELD} from "./Constants";

let TextureCache = utils.TextureCache;

export class Playfield extends GameObject
{
    playfieldSprite: Sprite;

    init()
    {
        this.playfieldSprite = new Sprite(TextureCache[TEXTURE_VFD_PLAYFIELD]);
        this.playfieldSprite.x = this.playfieldSprite.y = 0;
        this.container.addChild(this.playfieldSprite);
    }
}
