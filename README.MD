# Invader's Game - Space Invaders Game 🚀

This repository contains a space invaders game I created as a fun side project and portfolio piece. The game is built with TypeScript, CSS, and HTML, and uses the PIXI.js framework for displaying graphics. The aesthetic is reminiscent of a 1980's handheld video game with Vacuum Fluorescent Display (VFD) technology.

Check out a live demo of the game on my website: [justin-lloyd.com](https://www.justin-lloyd.com). Scroll to the bottom and look to the right to find the game.

## Game Screenshot 📸

![Game Screenshot](image_link_here)

## Features 🎮

The game includes the following features:

* Retro-styled invaders and spacecrafts 🚀.
* VFD-like glow effects ✨.
* Scoreboard for tracking high scores 📝.
* Multiple difficulty settings 🎚️.

## Codebase Overview 👨‍💻

The code is organized into several TypeScript modules, each of which handles a specific aspect of the game:

* `InvadersGame.ts`: The main game module that manages the game state and initializes game objects.
* `GameObject.ts`: A class for generic game objects with properties like position and speed.
* `Invader.ts`, `DeathRay.ts`, `Missile.ts`, `MissileBase.ts`: Specific game objects representing entities in the game.
* `DifficultySetting.ts`, `Scoreboard.ts`, `InvaderLivesIndicator.ts`: UI components for displaying game status.
* `Playfield.ts`, `PlayfieldGameWorld.ts`: Classes managing the game area and the world in which the game occurs.
* `InvaderSpawner.ts`, `BonusController.ts`, `MissileBaseController.ts`: Controllers for spawning and managing game objects.

## Installation 🛠️

To run the game locally:

1. Clone the repository:

```bash
git clone https://github.com/username/InvadersGame.git

2. Install the dependencies:
```bash
npm install

3. Start the development server:
```bash
npm run start

The game will be available at http://localhost:8080.

## License ⚖️

This project is Copyright (c) 2023 Justin Lloyd. All rights reserved.
