import GameWorld from "./GameWorld";

export class GameObject
{
    public x: number;
    public y: number;
    protected context;
    protected image:String;

    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.image = null;
    }

    public static CreateGameObject<Type extends GameObject>(goType:{new () : Type}) : Type
    {
        let go = new goType();
        GameWorld.instance.gameObjects.push(go);
        go.init();
        return go;
    }

    public initContext(context)
    {
        this.context = context;
    }

    public init()
    {
    }

    public start()
    {

    }

    public update(secondsPassed: number)
    {

    }

    public draw()
    {

    }
}
