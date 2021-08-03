export const BONUS_COL_STEP = 148;
export const BONUS_COL_OFFSET = 74;
export const BONUS_ROW_OFFSET = 92;
export const BONUS_EXPLOSION_ROW_OFFSET = 52;



export const RIGHT_COLUMN = 2;
export const LEFT_COLUMN = 0;
export const CENTER_COLUMN = 1;
export const TOP_ROW = 0;
export const BOTTOM_ROW = 6;

export const DIFFICULTY_MAX = 2;
export const DIFFICULTY_MIN = 0;

// recognized keycodes
export const KEY_CODE_MOVE_LEFT: number = 90; // Z
export const KEY_CODE_MOVE_RIGHT = 88; // X
export const KEY_CODE_FIRE = 13; // ENTER
export const KEY_CODE_DIFFICULTY_1 = 49; // 1
export const KEY_CODE_DIFFICULTY_2 = 50; // 2
export const KEY_CODE_DIFFICULTY_3 = 51; // 3
export const KEY_CODE_RESET = 82; // R

// recognized actions
export const ACTION_MOVE_LEFT: number = 1 << 0;
export const ACTION_MOVE_RIGHT = 1 << 1;
export const ACTION_MOVE_UP = 1 << 2;
export const ACTION_MOVE_DOWN = 1 << 3;
export const ACTION_FIRE = 1 << 4;
export const ACTION_RESET = 1 << 5;
export const ACTION_DIFFICULTY_1 = 1 << 6;
export const ACTION_DIFFICULTY_2 = 1 << 7;
export const ACTION_DIFFICULTY_3 = 1 << 8;

export const INVADER_COL_STEP = 144;
export const INVADER_COL_OFFSET = 10;
export const INVADER_ROW_STEP = 198;
export const INVADER_ROW_OFFSET = 88;
export const INVADER_EXPLOSION_OFFSET_X = 6;
export const INVADER_EXPLOSION_OFFSET_Y = 100;

export const DEATH_RAY_ROW_OFFSET = 364;
export const DEATH_RAY_ROW_STEP = 198;
export const DEATH_RAY_COL_OFFSET = 76;
export const DEATH_RAY_COL_STEP = 144;

export const MAX_LIVES = 3;
export const LIVES_INDICATOR_X_OFFSET = 8;
export const LIVES_INDICATOR_X_STEP = 145;
export const LIVES_INDICATOR_Y_OFFSET = 1488;

export const MISSILE_BASE_COL_OFFSET = 72;
export const MISSILE_BASE_COL_STEP = 148;
export const MISSILE_BASE_ROW_OFFSET = 1362;


export const MISSILE_ROW_OFFSET = 270;
export const MISSILE_ROW_STEP = 198;
export const MISSILE_COL_OFFSET = 76;
export const MISSILE_COL_STEP = 144;

export const MAX_SCORE: number = 30;
export const SCOREBOARD_OFFSET_X = 190;
export const SCOREBOARD_OFFSET_Y = 4;
export const SCOREBOARD_STEP_X = 54;

export const SOCKET_UPDATE = 'update';
export const SOCKET_NEW_PLAYER = 'new-player';
export const SOCKET_DISCONNECT = 'disconnect';
export const SOCKET_KEYS = 'keys';
export const SOCKET_BONUS_APPEAR = 'bonus-appear';
export const SOCKET_BONUS_APPEAR_ON_RIGHT = 'bonus-appear-on-right';
export const SOCKET_BONUS_APPEAR_ON_LEFT = 'bonus-appear-on-left';
export const SOCKET_BONUS_EXIT_PLAYFIELD = 'bonus-exit-playfield';
export const SOCKET_BONUS_MOVE_RIGHT = 'bonus-move-right';
export const SOCKET_BONUS_MOVE_LEFT = 'bonus-move-left';
export const SOCKET_BONUS_DIE = 'bonus-die';
export const SOCKET_BONUS_MOVE = 'bonus-move';
export const SOCKET_MISSILE_BASE_DIE = 'missible-base-die';
export const SOCKET_MISSILE_BASE_MOVE_LEFT = 'missible-base-move-left';
export const SOCKET_MISSILE_BASE_MOVE_RIGHT = 'missible-base-move-right';
export const SOCKET_MISSILE_BASE_MOVE_CENTER = 'missible-base-move-center';
export const SOCKET_MISSILE_BASE_REPLENISH_MISSILE = 'missible-base-replenish-missile';
export const SOCKET_MISSILE_BASE_ARM_MISSILE = 'missible-base-arm-missile';
export const SOCKET_MISSILE_BASE_FIRE_MISSILE = 'missible-base-fire-missile';


export const TEXTURE_MISSILE = 'missile';
export const TEXTURE_INVADER_01 = 'invader-01';
export const TEXTURE_INVADER_02 = 'invader-02';
export const TEXTURE_INVADER_LANDED = 'invader-landed';
export const TEXTURE_DEATH_RAY_01 = 'death-ray-01';
export const TEXTURE_DEATH_RAY_02 = 'death-ray-02';
export const TEXTURE_INVADER_HIT = 'invader-hit';
export const TEXTURE_BONUS_01 = 'bonus-01';
export const TEXTURE_BONUS_02 = 'bonus-02';
export const TEXTURE_BONUS_HIT_01 = 'bonus-hit-01';
export const TEXTURE_BONUS_HIT_02 = 'bonus-hit-02';
export const TEXTURE_MISSILE_BASE = 'missile-base';
export const TEXTURE_MISSILE_BASE_ARMED = 'missile-base-armed';
export const TEXTURE_LIVES_INDICATOR = 'lives-indicator';
export const TEXTURE_MISSILE_BASE_HIT = 'missile-base-hit';
export const TEXTURE_DIGIT_00 = 'digit-00';
export const TEXTURE_DIGIT_01 = 'digit-01';
export const TEXTURE_DIGIT_02 = 'digit-02';
export const TEXTURE_DIGIT_03 = 'digit-03';
export const TEXTURE_DIGIT_04 = 'digit-04';
export const TEXTURE_DIGIT_05 = 'digit-05';
export const TEXTURE_DIGIT_06 = 'digit-06';
export const TEXTURE_DIGIT_07 = 'digit-07';
export const TEXTURE_DIGIT_08 = 'digit-08';
export const TEXTURE_DIGIT_09 = 'digit-09';
export const TEXTURE_VFD_PLAYFIELD = 'vfd-playfield';

export const COLLISION_MISSILE_BASE = 1 << 0;
export const COLLISION_MISSILE = 1 << 1;
export const COLLISION_DEATH_RAY = 1 << 2;
export const COLLISION_INVADER = 1 << 3;
export const COLLISION_BONUS = 1 << 4;
