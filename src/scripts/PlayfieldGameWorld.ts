// (c) Copyright 2021 Justin Lloyd. All rights reserved.

import GameWorld from "./GameWorld";
import PlayfieldGameObject from "./PlayfieldGameObject";

export default abstract class PlayfieldGameWorld extends GameWorld
{
    protected isColliding(thisOne: PlayfieldGameObject, thatOne: PlayfieldGameObject)
    {
        if (thisOne.row != thatOne.row)
        {
            return false;
        }

        if (thisOne.col != thatOne.col)
        {
            return false;
        }

        return true;
    }

}
