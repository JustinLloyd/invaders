import {GameObject} from "./GameObject";

export class GameWorld
{
    public static instance:GameWorld;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D ;
    oldTimestamp:number;
    gameObjects: Array<GameObject>;

    constructor(canvasId)
    {
        this.canvas = null;
        this.context = null;
        this.oldTimestamp = 0;
        this.gameObjects = [];

        GameWorld.instance=this;
        this.init(canvasId);
    }

    init(canvasId)
    {
        console.log("Initializing game world");
        this.canvas = $(canvasId)[0];
        this.context = this.canvas.getContext('2d');
    }

    go()
    {
        this.gameObjects.forEach(value => {value.initContext(this.context)});
        this.gameObjects.forEach(value => {value.init()});
        console.log("Starting game loop")
        window.requestAnimationFrame((timeStamp) => {this.gameLoop(timeStamp)});
    }

    createWorld() {

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

export default GameWorld
