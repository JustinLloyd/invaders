// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import GameObject from "./GameObject";
import {GlowFilter} from "pixi-filters";
import {filters} from 'pixi.js';
import "gsap";

export default class VFDGameObject extends GameObject
{
    protected static blurFilter;
    protected static glowFilter;
    protected static alphaFilter;
    protected pulseTween: gsap.core.Tween;
    protected flickerTween: gsap.core.Tween;

    public static createGameObject<Type extends GameObject>(goType: { new(): Type }): Type
    {
        let go = super.createGameObject(goType);
        if (VFDGameObject.blurFilter == null)
        {
            VFDGameObject.blurFilter = new filters.BlurFilter();
            VFDGameObject.blurFilter.blur = 1;
            VFDGameObject.glowFilter = new GlowFilter();
            VFDGameObject.glowFilter.outerStrength = 2;
            VFDGameObject.glowFilter.color = 0x4080B0;
        }

        go.container.filters = [VFDGameObject.blurFilter, VFDGameObject.glowFilter];

        (go as unknown as VFDGameObject).flicker();
        return (go);
    }

    public flicker()
    {
        if (this.flickerTween != null)
        {
            this.flickerTween.pause();
        }

        if (this.pulseTween == null)
        {
            this.pulseTween = gsap.to(this.container, 0.05, {yoyo: true, repeat: -1, pixi: {alpha: .65}});
        }
        else
        {
            this.pulseTween.resume();
        }
    }

    public fastblink()
    {
        if (this.pulseTween != null)
        {
            this.pulseTween.pause();
        }
        if (this.flickerTween == null)
        {
            this.flickerTween = gsap.to(this.container, 0.1, {yoyo: true, repeat: -1, pixi: {alpha: .10}});
        }
        else
        {
            this.flickerTween.resume();
        }
    }
}
