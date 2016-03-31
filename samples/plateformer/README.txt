This is a sample project to make any platform game.

In editor there is a simple map compatible with the given levelGenerator.
Of course you can use whatever you want (like Tiled) by settings the outside format matching with the levelGenerator.

There is tons of parameters to change gravity of the world (but there is few bugs with collisions if you set maxGravity higher, current parameters are already really fast, more than your eyes ^^)

The class Character work as well for a player or IA or items (it's more about a "physical" object, but because there is jump and bindInputs methods it's a character, you can make your own really easy)

The levelGenerator file is a function that create the level. You can create new kind of elements with tags, and filling the "switch".
There is already an if for tags matching character (but noting in) do your logic to instantiate your entities inside it's really easy !

You can create new kind of surfaces, I let an example with tag matching "ice", you have to write your components inside shared.js
I don't have any good editor to do this faster than typing (I created one but it's slower) btw if you create one tell me I'll try it !

To run the editor, just paste your components list inside js/custom/resources.js and you can customize the editor with your custom needs (like ice parameters as example) by editing the gui.js file (this file create inputs and out JSON for final map)

Have fun and let me know about any issue.

Please don't forget contribute the inateno/Dreamengine Github