import {GameObject} from "./GameObject";
import {Invader} from "./Invader";
import {DifficultySetting} from "./DifficultySetting";
import {InvaderMissile} from "./InvaderMissile";
import {PlayerMissile} from "./PlayerMissile";
import {MissileBase} from "./MissileBase";
import {BonusSpaceship} from "./BonusSpaceship";
import {Scoreboard} from "./Scoreboard";
import {LivesIndicator} from "./LivesIndicator";
import {GameWorld} from "./GameWorld";
import * as $ from "jquery";
import "gsap";
import {GameObjectPool} from "./GameObjectPool";

class InvadersGame extends GameWorld
{
    invaderMissilesPool: GameObjectPool<InvaderMissile>;
    player: MissileBase;
    playerMissilesPool:GameObjectPool<PlayerMissile>;
    invadersPool: GameObjectPool<Invader>;
    bonusSpaceship: BonusSpaceship;
    difficulty:DifficultySetting;
    scoreboard:Scoreboard;
    livesIndicator:LivesIndicator;

    createWorld() {
        this.invaderMissilesPool = new GameObjectPool<InvaderMissile>();
        this.invadersPool =  new GameObjectPool<Invader>();
        this.playerMissilesPool = new GameObjectPool<PlayerMissile>();

        console.log("Creating game world");
        this.difficulty = new DifficultySetting();
        this.scoreboard = GameObject.CreateGameObject(Scoreboard);
        this.livesIndicator = GameObject.CreateGameObject(LivesIndicator);
        this.player=GameObject.CreateGameObject(MissileBase);
        this.bonusSpaceship = GameObject.CreateGameObject(BonusSpaceship);

        for (let i = 0; i < this.difficulty.invaderMissiles; i++)
        {
            this.invaderMissilesPool.push(GameObject.CreateGameObject(InvaderMissile));
        }

        for (let i = 0; i < this.difficulty.invaders; i++)
        {
            this.invadersPool.push(GameObject.CreateGameObject(Invader));
        }

        for (let i = 0; i < this.difficulty.playerMissiles; i++)
        {
            this.playerMissilesPool.push(GameObject.CreateGameObject(PlayerMissile));
        }

    }
}

var img_alien02 = new Image();
img_alien02.src = 'data:image/svg+xml,\
	<svg xmlns="http://www.w3.org/2000/svg" width="65.86" height="51.56" viewBox="0 0 65.86 51.56"><g class="alien-02"><path class="alien-02" d="M17.14,30.21a23.64,23.64,0,0,1-6.45-5.64A10,10,0,0,1,13.91,22l1-2.15a3.2,3.2,0,0,1,1.45,2.9c.42,1.71,1.81,3.07,3.54,4.3C18.32,27.7,17.17,28.59,17.14,30.21Z"/><path class="alien-02" d="M48.73,30.21a23.64,23.64,0,0,0,6.45-5.64A10,10,0,0,0,52,22l-1-2.15a3.2,3.2,0,0,0-1.45,2.9c-.41,1.71-1.81,3.07-3.54,4.3C47.54,27.7,48.69,28.59,48.73,30.21Z"/><path class="alien-02" d="M1.05,22.13a46.27,46.27,0,0,0,12.77-6.56,8.45,8.45,0,0,0-2.55-4.18l-3,.64A2.4,2.4,0,0,0,7.2,14.18l-5.15-.76A20.9,20.9,0,0,1,7.2,1.85C10.25-.42,14.66.79,18.92,1.08c.69,4.75-6.74,6.48-3.37,9.93C19.5,10.16,23.93,5.33,25,2.1h4.41c0,2.73,1.18,4.6,3.54,5.51,2.36-.91,3.51-2.78,3.55-5.51h4.41c1,3.23,5.48,8.06,9.42,8.91,3.38-3.45-4.06-5.18-3.37-9.93,4.27-.29,8.67-1.5,11.73.77a20.9,20.9,0,0,1,5.15,11.57l-5.16.76A2.37,2.37,0,0,0,57.56,12l-3-.64A8.48,8.48,0,0,0,52,15.57a46.18,46.18,0,0,0,12.78,6.56c.61,1.77.84,3.42,0,4.71L61.45,24.4c1.69,2.53,3.29,5,3.37,7-2.35,1.53-4.4,3.86-5.69,8.25L52.5,39.5l-.34,2.26,5.17,1.45c-3.85,2-7.5,4.16-9,7.26C47,48,44.39,47,41,47.05a20.21,20.21,0,0,1,5.16-6,6.36,6.36,0,0,0-3.65-3.89c.2-6.39.17-12.37-.88-16.56H24.22c-1,4.19-1.08,10.17-.87,16.56a2.87,2.87,0,0,1,2.09,3.51c-2.54,1.15-5.69,2-3.3,5.7-3.38,0-3.23,1.66-4.6,4.14-1.51-3.1-5.16-5.22-9-7.26l5.17-1.45-.35-2.26-6.62.17C5.44,35.28,3.39,33,1.05,31.42c.07-2,1.68-4.49,3.37-7L1.05,26.84C.21,25.55.44,23.9,1.05,22.13Z"/></g></svg>';

$(function() {
    var invaders = new InvadersGame('#canvas1');
    invaders.createWorld();
    invaders.go();

    var ratio   = window.devicePixelRatio || 1;
    console.log("game is ready!");
});

