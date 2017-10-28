define( [
 'EventEmitter'
],
function( EventEmitter )
{
  var Events = new EventEmitter();
  Events.DEName = "Events";
  
  return Events;
} );