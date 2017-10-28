/**
 * This provide you a way to make your custom update / logic<br>
 * You have to set a name on your automatism (to be able to remove it/change it later)
 * if you provide a name already used you automatism will be overred<br>
 * - if you set an interval, this automatism will be called each MS given<br>
 * - if you set persistent to false, it will be removed after the first call<br>
 *<b>This method call only a protected/public method member of your GameObject</b>
 * @public
 * @memberOf GameObject
 * @param {String} id unique id to be able to remove it later
 * @param {String} methodName the method to call each time
 * @param {Object} [params] parameters see below
 * @property {Int} [interval] delay between 2 calls
 * @property {Boolean} [persistent] if false, your automatism will be called only once
 * @property {Undefined} [value1] you can provide a first value
 * @property {undefined} [value2] you can provide a second value
 * @example
 * // this will call myObject.gameLogic() each updates
 * myObject.addAutomatism( "logic", "gameLogic" );
 * @example
 * // this will call myObject.checkInputs() each 500ms
 * myObject.addAutomatism( "inputs", "checkInputs", { "interval": 500 } );
 * @example
 * // this will call myObject.translate() once in 2.5 seconds
 * myObject.addAutomatism( "killMeLater", "askToKill", {
 *   "interval": 2500
 *   , "args": [ { x: 10, y: 10 } ] // we want prevent the kills events fired when die
 *   , "persistent": false
 * } );
*/
GameObject.prototype.addAutomatism = function( id, methodName, params )
{
  params = params || {};
  methodName = methodName || id;
  
  // if using the old way - TODO - remove it on version 0.2.0
  if ( methodName.type ) {
    console.error( "You use the old way to call addAutomatism, check the doc please" );
    params = methodName;
    methodName = params.type;
  }
  if ( !this[ methodName ] ) {
    console.warn( "%cCouldn't found the method " + methodName + " in your GameObject prototype", 1, "color:red" );
    return false;
  }
  params.interval = params.interval || Time.frameDelay;
  if ( params.interval ) {
    params.lastCall = Time.currentTime;
  }
  
  params.methodName = methodName;
  params.value1     = params.value1 || undefined;
  params.value2     = params.value2 || undefined;
  params.args       = params.args || undefined;
  params.persistent = ( params.persistent != false ) ? true : false;
  this._automatisms[ id ] = params;
};

/**
 * remove the automatism by id (the one you provided on creation)
 * @public
 * @memberOf GameObject
 * @param {String} id automatism id to remove
 * @example
 * myObject.removeAutomatism( "logic" );
 */
GameObject.prototype.removeAutomatism = function( id )
{
  if ( !this._automatisms[ id ] ) {
    console.warn( "%c[RemoveAutomatism] Automatism " + id + " not found", 1, "color:orange" );
    return;
  }
  delete this._automatisms[ id ];
};

/**
 * remove all automatisms
 * @public
 * @memberOf GameObject
 */
GameObject.prototype.removeAutomatisms = function()
{
  for ( var i in this._automatisms )
  {
    delete this._automatisms[ i ];
  }
};

/**
 * inverse values of an automatism
 * useful for "ping-pong" moves, fades, snaking, and patrols logics
 * this works with args OR value1 and value2
 * @public
 * @memberOf GameObject
 * @example
 * myObject.inverseAutomatism( "translateY" ); // this will inverse the value applied on the automatized translateY action
 */
GameObject.prototype.inverseAutomatism = function( autoName )
{
  var at = this._automatisms[ autoName ];
  
  if ( at.args ) {
    for ( var i = 0; i < at.args.length; ++i )
    {
      at.args[ i ] = -at.args[ i ];
    }
  }
  else {
    at.value1 = -at.value1;
    at.value2 = -at.value2;
  }
};