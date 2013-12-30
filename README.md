HTML5 Games Dreamengine - What is it
===========

The Dreamengine is a library to create HTML5 games. It's not a "button click software" or "quick code" or things like that, you have to programming everytime with it (but it's very easy to create editors, I made one simple and I will push soon). Dreamengine is more "how to make games fast, cross-platform, with good perfs, and without doing boring stuff".

I tried to focus on the main engine, with tools (like inputs, renderers), and now it's very simple to create plugins, advanced tools, editors...

So I don't say it's the best HTML5 engine, I know that I can write a complex prototype in few hours, and it'll work well everywhere.

By Rogliano Antoine, [Dreamirl](http://dreamirl.com) - [Inateno](http://inateno.com)
The official website [HTML5-Dreamengine](http://dreamengine.dreamirl.com)
Follow on [Twitter](http://twitter.com/dreamirlgames)
Or [Facebook](https://www.facebook.com/Dreamirl)


A little word about "story" (and why I did it)
-------

I pushed this engine on github after one work year at very part time, I worked mainly during Game-Jams because I didn't wanted to create a "theoric" engine (think about it during a time then make it) but I built this engine around my needs, when you make a games and you know what you would like in the engine.

Inputs are boring things, gamepads, calculate positions and rotations, or to think game's objects architecture and components.
I didn't make more complex stuff like physic, a good Gui (still wip), I don't care at the moment, I wanted a good architecture for all of my games, now adding features on the engine is not the most complicated.

Who can use it, why use it
-------

If you are looking for a "clicking game factory" or if you fear programming, or can't/don't want thinking about "code architecture" this engine isn't for you.
I built it around RequireJS, I think always about "DRY" (don't repeat yourself) and architecture, I wanted to create something I could sustain and make it grow with no limit, but at the same time, providing the lightest stuff, with which you can do as much as possible.

Here we aren't talking about "I take the engine and I code my game" it's rather "this is a library, now you add your stuff on it and make your games", by using the engine like this, you'll be very productive at the end.

Of course you can make a game directly (like most of examples) and it works well like that, but this will not maintainable and you'll not be able to make "big games" (you'll suicide before lol).

So finally I think this engine is for people who want to make "big games" with a base providing useful stuff.
But of course, everyone can use it!

Cool features
-------

Ok so there is some cool features
* gamepad's API for Chrome and a compatible one with Windows8 (if you bring the XInput component on you project and use the SystemDetection), it should work on Firefox but I tried to use it and it never worked for me :(
* multi-quality (you need no more stuff than write your qualities settings in the imagesDatas file)
* Inputs triggering are very simple (keyboard and mouse/touch, compatible with multi-touch, and possible to work with interval) just write a settings file
* nice Game Objects, with a hierarchy system, and with components (renderers, collider, events triggering)
* it's think to inherit from base class as you want (so it's very easy to make plugins for everyone)
* a simple image loader with configuration through a basic list (but it don't manages complex sprite sheets yet)
* it work with an intern dictionary (LangSystem) to provide an easy way for the localisation
* easy to bring on new platforms with the SystemDetection (you have to override what you want in the system file, and bind stuff on init)

When I speak about "bring on platform" I mean, include in a wrapper to make an executable (apk, etc..)

Compatible with "native" platforms
-------

This part is in early release, I won't push stuff that's not working well.
* Windows8 - 8.1 - VS Express - OK
* WP8 - VS Express - WIP (soon)
* KindleFire (amazon appstore) - Webapp - WIP (soon)
* Tizen - Tizen SDK - WIP (soon)
* Android - Phonegap - not yet
* iOS - not yet (I don't have device to do it)

Documentation
-------

[The "ig" how to here](http://dreamengine.dreamirl.com/#howto).
I didn't wrote a documentation yet, I'll use jsdoc or something like that. I just finished the "how to" (it's big enough to make a complete game).

Contributing
-------

You wrote a game ? A plugin ? An editor ? Or other stuff ?
You know a better way to do something in the engine (physics, loops, inputs, gui...) ?
Feel free to contact me: inateno@gmail.com
Or send us a tweet/pm, or simply a pull request.

License
-------

The Dreamengine is released under the [MIT License](http://opensource.org/licenses/MIT).

Finally it's here for everyone, feel free to use it, share it and contribute.

Feel free to contact me, I'm on Twitter @Inateno or the team @DreamirlGames (Dreamirl on Facebook)