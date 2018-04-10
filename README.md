## Project Name: bubbleshooter
## Project Description: Bubble Shooter game created with DevKit from Game Closure
## DevKit Location: https://github.com/gameclosure/devkit

### Dependencies: none

### Screens:
* TitleScreen - the splash title, where the player taps to start
* GameScreen - the screen that holds the gameplay

### Main Systems:
* GridView - holds all the grid locations for where bubbles are instantiated. This View does all hit calculation for where the player's shot collides with the bubble grid
* Shooter - stores the player's shooting object, and rotates it
* ParticleView - handles particles for explosions
* SoundController - handles all audio
* NextView - displays the current and next bubbles for the player to shoot

### Subsystems:
* GridPos - a location on the grid
* Bubble - a bubble graphic for the grid and the player's shot
* Shot - the object that the player fires
