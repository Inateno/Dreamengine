main.js and folders custom + datas are only example.

files.js is used to list all custom files and the engine, it's a "ready to compile" for grunt with RequireJS.

We suggest you to copy them to make you a good start with DreamEngine, RequireJS.

Datas files are required like it's wrote inside (if you won't use RequireJS you can remove define part)
When the engine start, it need imagesDatas, a dictionnary, inputsLists and audiosList.
If you mess one parameters in one of theses files, it'll crash (except for dictionnary).

DreamEngine-min-require is a version working with RequireJS if you want to make modules and a good structure in your code, it's perfect for you.

The DreamEngine-min version is a standalone pushing it in the window. You need RequireJS only to require the engine.

If your website use RequireJS and you want push DreamEngine inside, I have only the first proposition for you right now.
Because there is no DreamEngine without Require.
You can override your "app.start" or something like that with the engine process.

I'll look up for a better solution, or if you have, tell me.