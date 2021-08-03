import * as PIXI from 'pixi.js';
import {GameObject} from "./GameObject";
import {Sprite, utils} from "pixi.js";
import {LIVES_INDICATOR_X_OFFSET, LIVES_INDICATOR_X_STEP, LIVES_INDICATOR_Y_OFFSET, MAX_LIVES} from "./Constants";

let TextureCache = utils.TextureCache;

export class LivesIndicator extends GameObject
{
    protected lives: number;
    indicatorSprites: Array<Sprite>;

    public init()
    {
        this.indicatorSprites = new Array<Sprite>();
        this.container.x=LIVES_INDICATOR_X_OFFSET;
        this.container.y=LIVES_INDICATOR_Y_OFFSET;
        for (let i = 0; i < MAX_LIVES; i++)
        {
            let indicatorSprite = new Sprite(TextureCache['lives-indicator']);
            indicatorSprite.x = i * LIVES_INDICATOR_X_STEP;
            indicatorSprite.y = 0;
            //indicatorSprite.anchor.set(0, 0);
            this.container.addChild(indicatorSprite)
            this.indicatorSprites.push(indicatorSprite);
        }
    }

    reset()
    {
        this.lives = 3;
        this.indicatorSprites.forEach(value => value.visible = true);
    }

    public decrementLives()
    {
        if (this.lives > 0)
        {
            this.lives--;
            this.indicatorSprites[this.lives].visible = false;
        }
    }

    public isOutOfLives(): boolean
    {
        return this.lives == 0;
    }
}
