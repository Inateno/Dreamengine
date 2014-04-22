/**
 * @author Inateno / http://inateno.com / http://dreamirl.com
 */

/* TODO - do it */

/**
 * @constructor RigidBody
 * @class <b>Work In Progress don't use it!!</b><br>
 * Will be used to add physic on a gameObject
 */
define( [ 'DE.Vector2', 'DE.CONFIG' ],
function( Vector2, CONFIG )
{
  function Rigidbody( gameObject, param )
  {
    param = param || {};
    
    this.gameObject = gameObject;
    this.velocity   = param.velocity || new Vector2( param.initialVelocityX || 0, param.initialVelocityY || 0 );
    this.mass       = param.mass || 0;
    this.isKinetic  = false;
    this.isTrigger  = false;
    
    // this.
    
    this.addForce  = function(){}
    this.addForceTo  = function(){}
  }
  Rigidbody.prototype = Rigidbody.prototype || {};
  
  Rigidbody.prototype.update = function()
  {
    // here update position with current scene forces and customized attributes
    // this.gameObject.position.y += this.mass;
    // get the triggered collision and apply physic on ?
  }
  Rigidbody.prototype.DEName = "Rigidbody";
  
  CONFIG.debug.log( "Rigidbody loaded", 3 );
  return Rigidbody
} );