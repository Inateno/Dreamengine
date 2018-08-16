![DreamEngine Logo](http://dreamengine.dreamirl.com/assets/imgs/logo.png)

Dream-Engine V2 - a simple and powerful 2D game engine using PIXI V4
===========
The Dream-Engine is a free open source engine to create HTML5 games.
This brand new version is based on [PIXI V4](http://www.pixijs.com/).

It give you a powerful and simple declaration, logic, inputs binding, achievements management, audio library and so on.

If you want to use PIXI but don't want to code everything you need aside, you should try the DreamEngine.

Instead of the others engine, the DreamEngine is a little bit harder to start with, but it worth it.


New version, pretty stable
===========
Early 2018 I decided to make my engine from scratch again to be able to use 100% of what PIXI have to offer.
Right now the engine can be unstable because of the re-work, I'm doing a lot of experimentation to maximize the efficiency of the engine while keeping everything simple and fast to use.

I will update readme as I code it (again).


Even if this version is quite "new" it's still running, you can check this game as a good example: [Hexamaster](https://inateno.itch.io/hexamaster-tb)

This game is using few PIXI plugin like particles.


*_What is missing/not good:_*
- camera, because we have to use a PIXI Container on top, the positions are not good and when you want to do some camera movement it feel weird, also no crop/sizing on the camera
- CollisionSystem, I would like to do something as simple as the previous version but maybe using more PIXI stuff instead of re-writing everything
- SystemDetection this was used to make different build and allow to load a script specific to this OS/System
- Screen this was used to detect the size and DPI of the player's screen and choose if it should load an other quality. Despite the first algorithm is quite simple this require a tons of work on all the rendering process because it should load lower quality image, keeping the same rendering, and not touching the logic at all


Contributing
-------

Check issues if you want to contribute.

You wrote a game ? A plugin ? An editor ? Or other stuff ?
You know a better way to do something in the engine (physics, loops, inputs, gui...) ?
Open an issue or send a pull request !

Credits
===========

The website [HTML5-Dreamengine](http://dreamengine.dreamirl.com)
You can also follow me on [Twitter](http://twitter.com/inateno) but I do not tweet only about coding ^^

License
-------

The Dreamengine is released under the [MIT License](http://opensource.org/licenses/MIT).

I would love to get some advices, feedbacks, I need other points of view!
