import {Sprite, utils} from 'pixi.js';
import {PlayfieldGameObject} from "./PlayfieldGameObject";
import {
    COLLISION_DEATH_RAY,
    COLLISION_MISSILE_BASE,
    DEATH_RAY_COL_OFFSET,
    DEATH_RAY_COL_STEP,
    DEATH_RAY_ROW_OFFSET,
    DEATH_RAY_ROW_STEP,
    TEXTURE_DEATH_RAY_01,
    TEXTURE_DEATH_RAY_02
} from "./Constants";
import {DifficultySetting} from "./DifficultySetting";

let TextureCache = utils.TextureCache;

export class DeathRay extends PlayfieldGameObject
{
    deathRaySprite: Sprite;
    deathRayTextureNames: Array<string>;

    init()
    {
        this.rowOffset = DEATH_RAY_ROW_OFFSET;
        this.rowStep = DEATH_RAY_ROW_STEP;
        this.colOffset = DEATH_RAY_COL_OFFSET;
        this.colStep = DEATH_RAY_COL_STEP;
        this.movementDelay = DifficultySetting.difficulty.deathRayMovementDelay;
        this.deathRayTextureNames = [TEXTURE_DEATH_RAY_02, TEXTURE_DEATH_RAY_01, TEXTURE_DEATH_RAY_02, TEXTURE_DEATH_RAY_01, TEXTURE_DEATH_RAY_02];
        this.deathRaySprite = new Sprite(TextureCache[this.deathRayTextureNames[0]]);
        this.deathRaySprite.anchor.set(0.5, 0.5);
        this.container.addChild(this.deathRaySprite);
        this.collisionFlags = COLLISION_DEATH_RAY;
        this.collisionMask = COLLISION_MISSILE_BASE;
    }

    public onRowUpdated(newRow: number)
    {
        this.deathRaySprite.texture = TextureCache[this.deathRayTextureNames[newRow]];
    }

}



