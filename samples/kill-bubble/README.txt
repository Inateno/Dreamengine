Here is a sample to help you make a project with the DreamEngine.

When you work on the compiled engine, you have to require it by calling a file who call DREAM_ENGINE, then the engine will call your main file (named in files) and launch the function created by the main file.

When you will grunt your project, it'll create only a game.js file to require in your html file (instead of requiring file).

If you want to make your games for each platforms who need special includes / functions, you can do it in the same way I did it for Windows8.
Add your custom regex in compileSettings, it'll change the main.js before the grunt require, then restore the main.js.
I decided to use the commented line to detect the good place to inject my code, and I decided to inject custom OS dependencies after the required module DE.dictionnary.

You can do like me if you want, it'll be easier if you got problems and require help, but you can change it of course.

Try now to launch grunt here (you have to install all npm packages before).

If you have any improves to grunt project, I'll be very happy ! :)

Don't forget contribute the inateno/Dreamengine Github