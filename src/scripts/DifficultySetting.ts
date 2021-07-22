import {DifficultyData} from "./DifficultyData";
import {GameObject} from "./GameObject";

export class DifficultySetting extends GameObject {
    private _currentDifficulty: number;
    private difficultyData: ReadonlyArray<DifficultyData> =
        [
            {
                invaders: 2,
                bonusSpaceshipMovementSpeed: 1,
                invaderDescentSpeed: 1,
                invaderMissiles: 2,
                invaderLowestStartingRow: 1
            },
            {
                invaders: 2,
                bonusSpaceshipMovementSpeed: 1,
                invaderDescentSpeed: 1,
                invaderMissiles: 3,
                invaderLowestStartingRow: 2
            },
            {
                invaders: 3,
                bonusSpaceshipMovementSpeed: 1,
                invaderDescentSpeed: 1,
                invaderMissiles: 3,
                invaderLowestStartingRow: 3
            },
        ];

    constructor() {

        super();
        this._currentDifficulty = 0;
    }

    get currentDifficulty(): number {
        return this._currentDifficulty;
    }

    set currentDifficulty(value: number) {
        value = Math.min(2, Math.max(0, value));
        this._currentDifficulty = value;
    }

    get invaderMissiles(): number {
        return this.difficultyData[this._currentDifficulty].invaderMissiles;
    }

    get invaders(): number {
        return this.difficultyData[this._currentDifficulty].invaders;
    }
}
