$( window ).load( init );

function init()
{
  $( ".btn-default.about" ).click( function( e )
  {
    var parent = $( e.currentTarget ).parent();
    while ( !parent.hasClass( "card" ) )
      parent = parent.parent();
    
    parent.toggleClass( 'reverse' );
  } );
  
  var $pages = $( '.page' );
  $pages.hide( 0 );
  
  var $links = $( 'a[data-target]' );
  var currentPage = "home";
  $links.click( function( e )
  {
    var $el = $( "a[data-target=" + $( e.currentTarget ).attr( "data-target" ) + "]" );
    $links.parent().removeClass( "active" );
    $el.parent().addClass( "active" );
    
    if ( currentPage == $el.attr( "data-target" ) )
      return;
    currentPage = $el.attr( "data-target" );
    $pages.hide( 200 );
    $( '.page.' + currentPage ).show( 200 );
  } );
  
  $( $links[ 0 ] ).click();
  
  $( '.learnMore' ).click( function( e )
  {
    $( 'li>a.more' ).click();
  } );
  
  $( window ).on( 'scroll', function()
  {
    if ( $( 'body' ).scrollTop() > 130 )
    {
      $( '.navbar-fixed-top' ).addClass( "onscreen" );
    }
    else
    {
      $( '.navbar-fixed-top' ).removeClass( "onscreen" );
    }
  } );
  
  var hash = window.location.hash.replace('#','').toLowerCase();
  var routes = [ "engine", "games", "howto", "doc" ];
  if ( routes.indexOf( hash ) == -1 )
    hash = routes[ 0 ];
  $pages.hide( true );
  $( '.page.' + hash ).show( true );
  currentPage = hash;
  $( "a[data-target=" + hash + "]" ).click();
}