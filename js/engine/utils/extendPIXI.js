define( [],
function()
{
  return function( DE, PIXI )
  {
    PIXI.time = PIXI.ticker.shared;
    DE.pixtime = PIXI.ticker.shared;
    PIXI.utils.sayHello = function( type )
    {
      if ( type == 'WebGL' ) {
        type = type + ' ☺';
      }
      
      if ( navigator.userAgent.toLowerCase().indexOf('chrome') > -1 ) {
        var args = [
            '\n %c %c %c DreamEngine V2 > PIXI V4 ☃ - v' + DE.VERSION + ' - ✰ ' + type + ' ✰  %c ' +
              ' %c ' + ' http://dreamengine.dreamirl.com/ %c ' +
              ' %c ' + ' http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n'
            ,'background: #FF7C0A; padding:5px 0;','background: #FF7C0A; padding:5px 0;','color: #FF7C0A; background: #030307; padding:5px 0;','background: #FF7C0A; padding:5px 0;','background: #FFC18E; padding:5px 0;','background: #FF7C0A; padding:5px 0;','background: #ffc3dc; padding:5px 0;','background: #FF7C0A; padding:5px 0;','color: #ff2424; background: #fff; padding:5px 0;','color: #ff2424; background: #fff; padding:5px 0;','color: #ff2424; background: #fff; padding:5px 0;'
        ];
        
        window.console.log.apply( console, args ); //jshint ignore:line
      }
      else if ( window.console ) {
        window.console.log( 'DreamEngine V2 > PIXI V4 ☃ - v' + DE.VERSION + ' - ✰ ' + type + ' ✰ '
          + ' | http://dreamengine.dreamirl.com | http://www.pixijs.com' ); //jshint ignore:line
      }
    };
  };
} );