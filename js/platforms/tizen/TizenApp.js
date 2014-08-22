define( [ 'DREAM_ENGINE', 'customizeTizen' ],
function( DE, customizeTizen )
{
  var TizenApp = new function()
  {
    var _self = null;
    this.init = function( params )
    {
      _self = this;
      customizeTizen( this );
    }
  };
  
  return TizenApp;
} );