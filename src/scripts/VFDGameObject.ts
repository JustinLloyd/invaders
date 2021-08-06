// let TextureCache = PIXI.utils.TextureCache;
import GameObject from "./GameObject";
import {GlowFilter} from "pixi-filters";

export default class VFDGameObject extends GameObject
{
    protected static blurFilter;
    protected static glowFilter;

    // public static createGameObject<Type extends GameObject>(goType: { new(): Type }): Type
    // {
    //     let go = super.createGameObject(goType);
    //     console.log("VFDGameObject createGameObject invoked");
    //     if (VFDGameObject.blurFilter == null)
    //     {
    //         VFDGameObject.blurFilter = new filters.BlurFilter();
    //         VFDGameObject.blurFilter.blur = 1;
    //         VFDGameObject.glowFilter = new GlowFilter();
    //         VFDGameObject.glowFilter.outerStrength = 1;
    //         VFDGameObject.glowFilter.color = 0x4080B0;
    //     }
    //
    //     go.container.filters = [VFDGameObject.blurFilter, VFDGameObject.glowFilter];
    //
    //     return (go);
    // }
}
