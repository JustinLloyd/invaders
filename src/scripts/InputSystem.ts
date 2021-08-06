import {ACTION_FIRE, ACTION_MOVE_DOWN, ACTION_MOVE_LEFT, ACTION_MOVE_RIGHT, ACTION_MOVE_UP, ACTION_RESET, KEY_CODE_FIRE, KEY_CODE_MOVE_LEFT, KEY_CODE_MOVE_RIGHT, KEY_CODE_RESET} from "./Constants";

export default class InputSystem
{
    public isDown: number;
    public isUp: number;
    public wasPressed: number;
    public wasReleased: number;

    protected keyToAction: Array<number>;

    constructor()
    {
        this.keyToAction = new Array<number>();
        this.keyToAction[KEY_CODE_MOVE_LEFT] = ACTION_MOVE_LEFT;
        this.keyToAction[KEY_CODE_MOVE_RIGHT] = ACTION_MOVE_RIGHT;
        this.keyToAction[KEY_CODE_FIRE] = ACTION_FIRE;
        this.keyToAction[KEY_CODE_RESET] = ACTION_RESET;
        this.isDown = 0;
        this.isUp = ACTION_FIRE | ACTION_MOVE_DOWN | ACTION_MOVE_LEFT | ACTION_MOVE_RIGHT | ACTION_MOVE_UP | ACTION_RESET;
        this.wasPressed = 0;
        this.wasReleased = 0;
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    public removeEventListeners()
    {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    public isKeyDown(action: number): boolean
    {
        return ((this.isDown & action) == action);
    }

    public wasKeyPressed(action: number): boolean
    {
        return ((this.wasPressed & action) == action);
    }


    private onKeyDown(key): boolean
    {
        if (this.keyToAction[key.keyCode] === undefined)
        {
            return false;
        }

        let action = this.keyToAction[key.keyCode];
        let previousUp = this.isUp;
        this.isDown |= action;
        this.isUp &= ~action;
        this.wasPressed &= ~action;
        this.wasPressed |= (previousUp & action);
        this.wasReleased &= ~action;
        return true;

    }

    private onKeyUp(key)
    {
        if (this.keyToAction[key.keyCode] === undefined)
        {
            return false;
        }

        let action = this.keyToAction[key.keyCode];
        this.isUp |= action;
        this.isDown &= ~action;
        this.wasReleased &= ~action;
        this.wasReleased |= action;
        this.wasPressed &= ~action;
        return true;
    }

    public isDownMoveLeft(): boolean
    {
        return this.isKeyDown(ACTION_MOVE_LEFT);
    }

    public isDownMoveRight(): boolean
    {
        return this.isKeyDown(ACTION_MOVE_RIGHT);
    }


    public update()
    {
        this.wasPressed = 0;
        this.wasReleased = 0;
        // TODO dispatch network event here
    }

    public status()
    {
        console.log(this.isDown, this.isUp, this.wasPressed, this.wasReleased);
    }

    public isDownFire()
    {
        return this.isKeyDown(ACTION_FIRE);
    }
    public isDownReset()
    {
        return this.isKeyDown(ACTION_RESET);
    }
}
