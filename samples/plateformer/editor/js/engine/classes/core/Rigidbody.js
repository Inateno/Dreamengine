/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* Rigidbody
**/

/**
** The Rigidbody add physics for a GameObject
**/

define( [ 'DE.Vector2', 'DE.CONFIG' ],
function( Vector2, CONFIG )
{
  function Rigidbody( gameObject, param )
  {
    this.DEName = "Rigidbody";
    
    param = param || {};
    
    this.gameObject  = gameObject;
    this.velocity  = param.velocity || new Vector2( param.initialVelocityX || 0, param.initialVelocityY || 0 );
    this.mass    = param.mass || 0;
    this.isKinetic  = false;
    this.isTrigger  = false;
    
    // this.
    
    this.addForce  = function(){}
    this.addForceTo  = function(){}
  }

  Rigidbody.prototype.update = function()
  {
    this.gameObject.position.y += this.mass;
  }
  
  if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
  {
    console.log( "Rigidbody loaded" );
  }
  return Rigidbody
} );