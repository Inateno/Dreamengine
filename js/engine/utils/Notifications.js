/**
* @author Inateno / http://inateno.com / http://dreamirl.com
*/
/**
 * <b>You have to write your own CSS to place it, of course I give you a sample to try it<br>
 * Don't use margins on "notification" element directly, that's why I use a div inside<br>
 * (and set padding on the parent to simulate a margin)</b>
 * @namespace Notifications
 */
define( [ 'DE.config' ],
function( config )
{
  var Notifications = new function()
  {
    this.DEName = "Notifications";
    this.notifs                = {}; // contain all notifications created
    this.notifsHeight          = 0;
    this.selector              = "notifsContainer";
    this.container             = null;
    this.templateName          = "notificationTemplate";
    this.template              = null;
    this.defaultExpirationTime = 3500;
    this.closeAnimationDuration= 400;
    this.notificationClassName = "notification";
    this.inited                = false;
    var _self = this;
    
    /**
     * Init Notifications, get template and container in the dom
     * @memberOf Notifications
     * @protected
     * @param {object} params - Optional parameters, you can change all default value (check out the main constructor)
     */
    this.init = function( params )
    {
      params = params || {};
      
      this.selector               = params.selector || this.selector;
      this.templateName           = params.templateName || this.templateName;
      this.closeAnimationDuration = params.closeAnimationDuration || this.closeAnimationDuration;
      this.notificationClassName  = params.notificationClassName || this.notificationClassName;
      
      this.container = params.container || document.getElementById( this.selector );
      
      var templateContainer = document.getElementById( this.templateName )
      this.template  = params.template || templateContainer ? templateContainer.innerHTML : null;
      
      if ( !this.container || !this.template ) {
        throw new Error( "Can't init Notifications without a container element AND a template -- "
            + "container selector:: " + this.selector + " -- templateName:: " + this.templateName );
      }
      
      this.inited = true;
      this.notifsHeight = this.container.offsetHeight || 0;
      
      if ( templateContainer ) {
        document.body.removeChild( templateContainer );
      }
    }
    
    /**
     * Create a notification
     * @memberOf Notifications
     * @public
     * @param {string} text - The title of the book.
     * @param {int} expirationTime - Optional parameters in milliseconds
     * @example DE.Notifications.create( "hello world", 1500 );
     */
    this.create = function( text, expirationTime ) // use this one
    {
      if ( !config.notifications.enable ) {
        return;
      }
      
      if ( !this.inited ) {
        console.log( "Notifications: You didn't called Notifications.init" );
        return;
      }
      
      this.notifsHeight = this.notifsHeight < 0 ? 0 : this.notifsHeight;
      
      var time = expirationTime || this.defaultExpirationTime;
      var id = Date.now() + "-" + ( ( Math.random() * 100 ) >> 0 );
      
      var notif = document.createElement( 'div' );
        notif.className = this.notificationClassName;
        notif.innerHTML = this.template;
        notif.getElementsByClassName( 'content' )[ 0 ].innerHTML = text;
        notif.id = 'notif' + id;
      this.container.appendChild( notif );
      
      this.notifs[ id ] = notif;
      this.notifs[ id ].getElementsByClassName( 'notifClose' )[ 0 ]
        .addEventListener( 'click', function()
        {
          _self.remove( id );
        } );
      
      var height = this.notifs[ id ].offsetHeight;
      this.notifsHeight += height;
      this.container.style.height = this.notifsHeight + 'px';
      
      this.bindRemove( id, time );
    }
    
    /**
     * bind the remove function
     * @memberOf Notifications
     * @protected
     * @param {string} id - Is the notification to bind
     * @param {int} time - is the time notification will stay on screen
     */
    this.bindRemove = function( id, time )
    {
      time = time || this.defaultExpirationTime;
      setTimeout( function()
      {
        _self.triggerRemove( id );
      }, time );
    }
    
    /**
     * launch animation to remove a notification
     * @memberOf Notifications
     * @protected
     * @param {string} id - Is the notification to animate
     */
    this.triggerRemove = function( id )
    {
      if ( !this.notifs[ id ] ) {
        return;
      }
      
      this.notifs[ id ].className = this.notifs[ id ].className + ' disapear';
      
      setTimeout( function()
      {
        _self.remove( id );
      }, this.closeAnimationDuration );
    }
    
    /**
     * remove a notification from dom and object container
     * @memberOf Notifications
     * @protected
     * @param {string} id - Is the notification to remove
     */
    this.remove = function( id )
    {
      var height = this.notifs[ id ].offsetHeight;
      this.notifsHeight -= height;
      this.container.style.height = this.notifsHeight + 'px';
      this.container.removeChild( this.notifs[ id ] );
      delete this.notifs[ id ];
      return;
    }
  };
  
  return Notifications;
} );