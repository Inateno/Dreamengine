HTML5 Games Dreamengine - What is it
===========

The Dreamengine is a library to create HTML5 games by coding. It's not "easy make" or things like that, it's more about "how to make games fast, running everywhere, with good perfs, and without doing boring stuff".

So I don't say it's the best HTML5 engine, I know that I can wrote a complex prototype in few hours, and it'll run well everywhere.

By Rogliano Antoine, [Dreamirl](http://dreamirl.com) [Inateno](http://inateno.com)
The official website [HTML5-Dreamengine](http://dreamengine.dreamirl.com)
Follow on [Twitter](http://twitter.com/dreamirlgames)
Or [Facebook](https://www.facebook.com/Dreamirl)


A little word about "story" (and why)
-------

I push this engine on github after one year to work on it at very part time, I worked mainly during GameJams because I didn't wanted to create a "theoric" engine (you think it's great then you code it) but I build the engine around my needs, when you make a games and you know what you would like in the engine.

Inputs are boring things, gamepad to, calculating positions and rotations, or thinking about gameObjects and components.
I didn't make more complex stuff like physic, good Gui (still wip), I don't care at the moment, I wanted a good architecture for all of my games, now adding features on it is not the most complicated.

Who can use it, why use it
-------

If you are looking for a "clicking game factory" or if you fear coding, or can't/don't want thinking about "code architecture" this engine isn't for you.
I builded it around RequireJS, I think always about "DRY" and architecture, I wanted to create something I will be able to maintain and make it grow with no limit, but at the same time, providing the lightest stuff, to do the most possible.

Here we aren't talking about "I take the engine and code my game" but more about "this is a library, now add your stuff on it and make your games", by using the engine like this, you'll be productive at the end.

Of course you can make a game directly (like most of examples) and this work well, but this will not maintainable and you'll not be able to make "big games" (you'll suicide before).

Si finally I think this engine is for people who want to make "big games" with a base that provide usefull stuff.
But of course, everyone can use it!

Cool features
-------

Ok so there is some cool features
* gamepad API for Chrome and compatible with Windows8 (if you bring the XInput component on you project and use the SystemDetection), it should work on Firefox but I tried to use it and it never worked :(
* multi-quality (no more stuff required than write you quality settings in the imagesDatas file)
* simple Inputs trigger (keyboard and mouse/touch, compatible with multi-touch, and possible to work with interval)
* nice GameObjects with hierarchy system, and components (renderers, collider)
* thinked to herit from base class as you want (so make plugins for everyone, is very easy)
* simple images loader/configuration trough a basic list (but don't manage complex spritesheet yet)
* work with an intern dictionnary (LangSystem) to provide an easy way for the localisation
* easy to bring on new platforms with the SystemDetection (let you override what you want, and bind stuff on init)

When a speak about "bring on platform" I mean, include in a wrapper to make an executable (apk, etc..)

Compatible with "native" platforms
-------

This part is in early release, I wont make public stuff that's not working well.
* Windows8 - 8.1 - VS Express - OK
* WP8 - VS Express - WIP (soon)
* KindleFire (amazon appstore) - Webapp - WIP (soon)
* Tizen - Tizen SDK - WIP (soon)
* Android - Phonegap - not yet
* iOS - not yet (I don't have stuff for this)

Documentation
-------

I didn't wrote a documentation, this take lot of time and I preferred use my time to clean and debug the engine as possible.
But now it's on Github, I'll did it on the dreamengine website.

Contributing
-------

You wrote a game ? A plugins ? An editor ? Or other stuff ?
You know a better to do something in the engine (physics, loop, inputs, gui...) ?
Feel free to contact me: inateno@gmail.com
Or send us tweet/pm, or simply pull request.

License
-------

The Dreamengine is released under the [MIT License](http://opensource.org/licenses/MIT).

Finally it's here, for everyone, feel free to use it, share it and contribute.

Feel free to contact me, I'm on Twitter @Inateno or the team @DreamirlGames (Dreamirl on Facebook)