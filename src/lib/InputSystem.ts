// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import {
    ACTION_DIFFICULTY_1, ACTION_DIFFICULTY_2, ACTION_DIFFICULTY_3,
    ACTION_FIRE,
    ACTION_MOVE_DOWN,
    ACTION_MOVE_LEFT,
    ACTION_MOVE_RIGHT,
    ACTION_MOVE_UP,
    ACTION_RESET, KEY_CODE_DIFFICULTY_1, KEY_CODE_DIFFICULTY_2, KEY_CODE_DIFFICULTY_3,
    KEY_CODE_FIRE,
    KEY_CODE_MOVE_LEFT,
    KEY_CODE_MOVE_RIGHT,
    KEY_CODE_RESET
} from "../scripts/Constants";

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
        this.keyToAction[KEY_CODE_DIFFICULTY_1] = ACTION_DIFFICULTY_1;
        this.keyToAction[KEY_CODE_DIFFICULTY_2] = ACTION_DIFFICULTY_2;
        this.keyToAction[KEY_CODE_DIFFICULTY_3] = ACTION_DIFFICULTY_3;
        this.isDown = 0;
        this.isUp = ACTION_FIRE | ACTION_MOVE_DOWN | ACTION_MOVE_LEFT | ACTION_MOVE_RIGHT | ACTION_MOVE_UP | ACTION_RESET | ACTION_DIFFICULTY_1 | ACTION_DIFFICULTY_2 | ACTION_DIFFICULTY_3;
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

    public isDownDifficulty1(): boolean
    {
        return this.isKeyDown(ACTION_DIFFICULTY_1);
    }

    public isDownDifficulty2(): boolean
    {
        return this.isKeyDown(ACTION_DIFFICULTY_2);
    }

    public isDownDifficulty3(): boolean
    {
        return this.isKeyDown(ACTION_DIFFICULTY_3);
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
