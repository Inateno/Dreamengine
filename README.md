![DreamEngine Logo](http://dreamengine.dreamirl.com/assets/imgs/logo.png)

Dream-Engine - a simple and powerful 2D game engine - PIXI Version
===========
The Dream-Engine is a free open source engine to create HTML5 games.
The renderer is based on PIXIJS, it's a fast light rendering engine, using WebGL for rendering 2D.

You may ask, why should I use the Dream-Engine if PIXI is the rendering engine ?
Well, the DE (Dream-Engine) is mainly focused on architecture, game logic and gaming features to enhance your productivity.
Spent less time on "low level tools", more time on the main stuff. Plus a complete architecture to keep a code maintainable along years.

If you are familiar with PIXI you'll find things inside the engine that aren't used because of an architecture choice, or differences like the events in PIXI.

Today it's very simple to create plugins, advanced tools, editors, logics... I add constantly new stuff and anyone can do it too.

Checkout the changelog.txt for updates details

PS: If you already made a game with the engine in Canvas2D version the migration is easy, you have to change your DE.Render declaration and each SpriteRenderer or TextRenderer.

Nb: because PIXI is using WebGL you have to run a local web-server on your computer to try your game, it was possible to do it without on the Canvas2D version, this is a security issue.

Last Update: 0.26.4 (checkout the changelog)
-------
Sample for z-projection test (todo fix it) + minor features
  * add Vector2.getAnglesDifference
  * add Render Events methods
  * add Render._drawRatio attribute and trigger an event when it change

Samples are here to help a lot
-------

Please check out samples, it take me around 10 to 30 minutes to wrote one like these ones.
I can't give you a better way to start with the engine.
The "Empty" one for starting a new project, kill-bubbles, defender, or waves are the most simple. Check plateformer and little-shmup for "class" and "inheritance" examples.


Who can use it, why use it
-------

Companies, indie, pro, students. No matters. I made this engine for those who want a lite powerful engine with the ability to go low-level at any time.
It's not a "clicking" software, starting with the engine may be hard, but the learning curve is fast.

I made a lot of professional and experimental games with it.
You can even do a game in "one big file" this will work ([like this one](http://pongarena.dreamirl.com/)).
Check [all the games made with](http://dreamengine.dreamirl.com/)

Now let's look at the "cool" features!

Cool features
-------

* gamepad's API for Chrome, Firefox, Edge and a compatible one with Windows8 (if you bring the XInput component on you project and use the SystemDetection)
* multi-quality (you need no more stuff than write your qualities settings in the imagesDatas file)
* Inputs triggering are very simple (keyboard and mouse/touch, compatible with multi-touch, and possible to work with interval) just write a settings file
* nice GameObject class, with a hierarchy system and with components (renderers, collider, events triggering), the addAutomatism is your new friend (very powerful for AI, timers, delay, it's like a setTimeout but with or without repeat and under control of the engine and the delta-time)
* it's think to inherit from base class as you want (so it's very easy to make plugins for everyone), but it's only an option you can also make your whole game in one file ;)
* a simple image loader with configuration through a basic list (handle simple and complex sheet loading)
* it work with an intern dictionary (LangSystem) to provide an easy way for the localisation
* Achievement API inside
* Audio file loading and API inside, split FX and musics
* powerfull mouse/touch events tree, from the render to the collider, you can handle event on each objects and shut it down at any time
* easy to bring on new platforms with the SystemDetection (you have to override what you want in the system file, and bind stuff on init)


Compatible with "native" platforms
-------

When I speak about "native platforms" I mean, include in a wrapper to make an executable (apk, etc..)
This part is in early release it's experimental and work well when it's finished (for w8 / 8.1 and wp)
* Windows8 - 8.1 - VS Express - OK
* WP8 - VS Express - OK
* KindleFire (amazon appstore) - Webapp - WIP (soon)
* Tizen - Tizen SDK - WIP (soon)
* Android - Phonegap - not yet
* iOS - not yet (I don't have device to do it)

Documentation
-------

[The "big" how to here](http://dreamengine.dreamirl.com/#howto).
I used jsdoc to generate documentation but it's not awesome (yet).
There is also a lot of code requiring documentation ^^'.

Contributing
-------

You wrote a game ? A plugin ? An editor ? Or other stuff ?
You know a better way to do something in the engine (physics, loops, inputs, gui...) ?
Open an issue or send a pull request !

Credits
===========

The website [HTML5-Dreamengine](http://dreamengine.dreamirl.com)
You can also follow me on [Twitter](http://twitter.com/inateno)

License
-------

The Dreamengine is released under the [MIT License](http://opensource.org/licenses/MIT).

Finally it's here for everyone, feel free to use it, share it and contribute.

I would love to get some advices or feedbacks. I'm on Twitter @Inateno
