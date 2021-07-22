import {Invader} from "./Invader";
import {DifficultySetting} from "./DifficultySetting";
import {GameObject} from "./GameObject";
import {InvaderMissile} from "./InvaderMissile";
import {PlayerMissile} from "./PlayerMissile";
import {MissileBase} from "./MissileBase";
import {BonusSpaceship} from "./BonusSpaceship";
import {Scoreboard} from "./Scoreboard";
import {LivesIndicator} from "./LivesIndicator";

const MAX_PLAYER_MISSILES = 2 ;

class GameWorld
{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D ;
    oldTimestamp:number;
    gameObjects: Array<GameObject>;
    invaderMissiles: Array<InvaderMissile>;
    player: MissileBase;
    playerMissiles:Array<PlayerMissile>;
    invaders: Array<Invader>;
    bonusSpaceship: BonusSpaceship;
    difficulty:DifficultySetting;
    scoreboard:Scoreboard;
    livesIndicator:LivesIndicator;

    constructor(canvasId)
    {
        this.canvas = null;
        this.context = null;
        this.oldTimestamp = 0;
        this.gameObjects = [];

        this.init(canvasId);
    }

    init(canvasId)
    {
        this.canvas = $(canvasId)[0];
        this.context = this.canvas.getContext('2d');
        this.createWorld();
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)});
    }

    createWorld() {
        $("#playfield").append($("#alien")[0]);
        this.scoreboard = new Scoreboard();
        this.gameObjects.push(this.scoreboard);

        this.gameObjects =
            [
                new Scoreboard(),
                new MissileBase(),
                new LivesIndicator(),
                new Scoreboard(),
                // this.gameObjects = [
                //     new Square(this.context, 250, 50, 0, 50, 1),
                //     new Square(this.context, 250, 300, 0, -50, 200),
                //     new Square(this.context, 200, 0, 50, 50, 1),
                //     new Square(this.context, 250, 150, 50, 50, 1),
                //     new Square(this.context, 300, 75, -50, 50, 1),
                //     new Square(this.context, 300, 300, 50, -50, 1)
            ];

        this.invaderMissiles = new Array<InvaderMissile>();
        for (let i = 0; i < this.difficulty.invaderMissiles; i++)
        {
            let invaderMissile:InvaderMissile = new InvaderMissile();
            this.invaderMissiles.push(invaderMissile);
            this.gameObjects.push(invaderMissile);
        }

        this.invaders  = new Array<Invader>();
        for (let i = 0; i < this.difficulty.invaders; i++)
        {
            let invader:Invader = new Invader();
            this.invaders.push(invader);
            this.gameObjects.push(invader);
        }

        this.playerMissiles = new Array<PlayerMissile>();
        for (let i = 0; i < MAX_PLAYER_MISSILES; i++)
        {
            let playerMissile:PlayerMissile = new PlayerMissile();
            this.playerMissiles.push(playerMissile);
            this.gameObjects.push(playerMissile);
        }

        for (let i = 0; i < this.gameObjects.length; i++)
        {
            this.gameObjects[i].initContext(this.context);
        }

    }

    gameLoop(timestamp)
    {
        var elapsedTime = (timestamp - this.oldTimestamp) / 1000;
        this.oldTimestamp = timestamp;
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update(elapsedTime);
        }

        this.clearCanvas();
        for (var i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].draw();
        }

        window.requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    clearCanvas()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
