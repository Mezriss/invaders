# Invaders
Invaders (I really need a better name) is a shoot-'em-up game inspired
by Space Invaders (well, obviously), Galaga and a number of other games.

But there is a twist - everything is procedurally generated. Not only
ship sprites, but also weapons, enemy ship formations and attack patterns.
Players will have to learn and adapt to this in each playthrough, in
almost a roguelike fashion.

This game is developed with two self imposed limitations:
* there should be no external dependencies (otherwise it would have made
much more sense to use something like pixi.js), everything should be
written from scratch, adapted or generated if at all feasible
* final package should be small, no more than 64kb minified (at this
moment I'm already over this limit, but I'll keep 100kb in mind as
absolute maximum)

[Play it here](https://mezriss.github.io/invaders/)

## Current state
Game is playable, but lacks content - promised generated
formations/patterns. Anyway, you can score points by killing same enemy
formation over and over again.

## Roadmap
* up next: generator for AI behavior
* content for minimal interesting-to-play version
* better name
* destructible obstacles as another element on the field
* ship capturing
* content for level generator
* intro sequence
* an ability to record gameplay as gifs/video
* social media buttons for easier highscore boasting
* dev docs for easier contribution