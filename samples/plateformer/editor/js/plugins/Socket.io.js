/***
* contributors
* @Inateno -> http://inabook.fr
***/

DREAM_ENGINE.Socket_io = function( IP, port, protocol )
{
  this.IP    = IP;
  this.port  = port;
  this.protocol  = protocol;
  this.socket  = null;
  
  this.isLocal= false;
  
  var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = this.protocol + '://' + this.IP + ':' + this.port + '/socket.io/socket.io.js';
    script.pointer = this;
  document.body.appendChild( script );
  script.onload = function(){ this.pointer.init(); };
  
  this.init = function()
  {
    this.socket = io.connect( this.protocol + '://' + this.IP + ':' + this.port );
    socketDeclaration();
  }
}