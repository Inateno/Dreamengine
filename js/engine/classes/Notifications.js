/**
* Author
 @Inateno / http://inateno.com / http://dreamirl.com

* ContributorsList
 @Inateno

***
* singleton@Notifications
 make Notifications poping in the window (bottom-left as default)
 you can override template in the default index.html and override animation in the default style.css
**/
define( [],
function()
{
  var Notifications = new function()
  {
    this.DEName                = "Notifications";
    this.notifs                = {};
    this.heightNotifs          = 0;
    this.selector              = "notifsContainer";
    this.el                    = null;
    this.templateName          = "notificationTemplate";
    this.template              = null;
    this.defaultExpirationTime = 3500;
    this.inited                = false;
    var _self = this;
    
    /****
     * init@void
     */
    this.init = function( params )
    {
      if ( this.inited )
        return;
      params = params || {};
      params.notifications = params.notifications || {};
      
      this.selector = params.notifications.selector || this.selector;
      this.templateName = params.notifications.templateName || this.templateName;
      
      this.el = document.getElementById( this.selector );
      this.template = document.getElementById( this.templateName ).innerHTML;
      
      if ( !this.el || !this.template )
        throw new Error( "FATAL ERROR: Can't init Notifications without an element AND a template -- "
                        + "selector:: " + this.selector + " -- templateName:: " + this.templateName );
      this.inited = true;
      document.body.removeChild( document.getElementById( this.templateName ) );
    }
    
    /****
     * create@void( text@String, params@object )
      create a Notification
      TODO - WIP - add notification fx sound in params
     */
    this.create = function( text, params )
    {
      if ( !this.inited )
        return;
      this.heightNotifs = this.heightNotifs < 0 ? 0 : this.heightNotifs;
      
      params = params || {};
      var time = params.expire || this.defaultExpirationTime;
      var id = Date.now() + "-" + ( ( Math.random() * 100 ) >> 0 );
      
      var notif = document.createElement( 'div' );
        notif.innerHTML = this.template;
        notif.getElementsByClassName( 'content' )[ 0 ].innerHTML = text;
        notif.id = 'notif' + id;
      this.el.appendChild( notif );
      
      this.notifs[ id ] = notif;
      this.notifs[ id ].getElementsByClassName( 'notifClose' )[ 0 ].addEventListener( 'click', function()
      {
        _self.remove( id, true );
      } );
      
      var height = this.notifs[ id ].offsetHeight;
      this.heightNotifs += height;
      this.el.style.height = this.heightNotifs + 'px';
      
      this.bindRemove( id, time );
    }
    
    /****
     * bindRemove@void
      bind a setTimeout to remove the notification
     */
    this.bindRemove = function( id, time )
    {
      time = time || this.defaultExpirationTime;
      setTimeout( function()
      {
        _self.remove( id );
      }, time );
    }
    
    /****
     * remove@void
      remove a notification in the page, called by callback time
     */
    this.remove = function( id, ignoreFade )
    {
      if ( !this.notifs[ id ] )
        return;
      
      if ( ignoreFade )
      {
        var newHeight = this.el.offsetHeight - this.notifs[ id ].offsetHeight;
        this.el.style.height = newHeight + 'px';
        this.el.removeChild( this.notifs[ id ] );
        delete this.notifs[ id ];
        return;
      }
      
      var height = this.notifs[ id ].offsetHeight;
      this.notifs[ id ].className = this.notifs[ id ].className + ' disapear';
      _self.heightNotifs -= height;
      _self.el.style.height = _self.heightNotifs + 'px';
      
      setTimeout( function()
      {
        _self.el.removeChild( _self.notifs[ id ] );
        delete _self.notifs[ id ];
      }, 110 );
    }
  };
  
  return Notifications;
} );