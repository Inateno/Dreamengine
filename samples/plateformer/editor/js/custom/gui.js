define( [ 'resources', 'DREAM_ENGINE' ],
function( resources, DE )
{
  var _textarea;
  function createGUI()
  {
    // LOADER
      _textarea = document.getElementById( "t_textarea" );
      
      document.getElementById( "t_loadjson" ).onclick = function( e ){ loadLevel(); e.preventDefault(); e.stopPropagation(); }
      document.getElementById( "t_ok" ).onclick = function( e ){ hideOut(); e.preventDefault(); e.stopPropagation(); }
      _textarea.area = document.getElementById( "load_textarea" );
    
    //
    // TOOLS
    //
      var gridsize = document.getElementById( "gridsize" );
        gridsize.onfocus = function( e ){ DE.Inputs.keyLocked = true; }
        gridsize.onblur = function( e ){ DE.Inputs.keyLocked = false; }
        gridsize.onkeyup = function( e )
        {
          if ( isNaN( gridsize.value * 2 ) )
          {
            alert( "Rentrez un nombre entier" );
            return false;
          }
          console.log( gridsize.value )
          resources.gridsize = gridsize.value;
        }
      document.getElementById( "getjson" ).onclick = function(){ getJson(); }
      document.getElementById( "loadjson" ).onclick = function( e ){ displayOut(); e.preventDefault(); }
    /////////////////////////
    
    //
    // ELGUI
    // quand un élément est selectionné
        resources.elGui = document.getElementById( "elGui" );
        resources.elGui.zindex = document.getElementById( "el_zindex" );
        resources.elGui.plus = document.getElementById( "el_zindex+" );
        resources.elGui.plus.onclick = changeZIndex;
        resources.elGui.less = document.getElementById( "el_zindex-" );
        resources.elGui.less.onclick = changeZIndex;
        resources.elGui.x = document.getElementById( "el_x" );
        resources.elGui.x.onfocus = function( e ){ DE.Inputs.keyLocked = true; }
        resources.elGui.x.onblur = function( e ){ DE.Inputs.keyLocked = false; }
        resources.elGui.x.onkeyup = function( e )
        {
          if ( isNaN( resources.elGui.x.value * 2 ) )
          {
            alert( "Rentrez un nombre entier" );
            return false;
          }
          resources.currentEl.position.x = parseInt( resources.elGui.x.value );
          e.preventDefault();
          e.stopPropagation();
        }
        resources.elGui.y = document.getElementById( "el_y" );
        resources.elGui.y.onfocus = function( e ){ DE.Inputs.keyLocked = true; }
        resources.elGui.y.onblur = function( e ){ DE.Inputs.keyLocked = false; }
        resources.elGui.y.onkeyup = function( e )
        {
          if ( isNaN( resources.elGui.y.value * 2 ) )
          {
            alert( "Rentrez un nombre entier" );
            return false;
          }
          resources.currentEl.position.y = parseInt( resources.elGui.y.value );
          e.preventDefault();
          e.stopPropagation();
        }
        resources.elGui.z = document.getElementById( "el_z" );
        resources.elGui.z.onfocus = function( e ){ DE.Inputs.keyLocked = true; }
        resources.elGui.z.onblur = function( e ){ DE.Inputs.keyLocked = false; }
        resources.elGui.z.onkeyup = function( e )
        {
          if ( isNaN( resources.elGui.y.value * 2 ) )
          {
            alert( "Rentrez un nombre entier" );
            return false;
          }
          resources.currentEl.position.z = parseInt( resources.elGui.z.value );
          e.preventDefault();
          e.stopPropagation();
        };
        
        resources.elGui.lock = document.getElementById( "el_lock" );
        resources.elGui.lock.onclick = function()
        {
          if ( resources.currentEl.isLocked )
          {
            resources.currentEl.isLocked = false;
            resources.elGui.lock.innerHTML = "Lock";
          }
          else
          {
            resources.currentEl.isLocked = true;
            resources.elGui.lock.innerHTML = "Unlock";
          }
        }
        resources.elGui.remove = document.getElementById( "el_delete" );
        resources.elGui.remove.onclick = function( e )
        {
          var r = confirm( "Vous allez supprimer le GameObject " + resources.currentEl.name + ", sûr ?" );
          if ( r )
          {
            resources.scene.remove( resources.currentEl );
            resources.currentEl = null;
          }
        }
        
    ////////////////
    
    var components = document.getElementById( "components" );
    for ( var i in resources.components )
    {
      var cp = resources.components[ i ];
      
      if ( cp.sprite && !DE.ImageManager.images[ cp.sprite ] )
      {
        throw new Error( "ERROR - noob! you write a sprite that doesn't exist :: " + cp.sprite );
        return;
      }
      
      // create buffer for this components
      cp.buffer = document.createElement( "canvas" );
      cp.buffer.ctx = cp.buffer.getContext( '2d' );
      cp.buffer.width = cp.w || 150;
      cp.buffer.height = cp.h || 150;
      // cp.buffer.style.width = "100%";
      cp.buffer.style.height = "100px";
      cp.buffer.setAttribute( "id", i );
      cp.buffer.style.position = "relative";
      cp.buffer.style.bottom = 0;cp.buffer.style.left = 0;
      cp.buffer.style.marginBottom = "-5px";
      if ( !cp.sprite )
      {
        console.log( cp.name )
        if ( cp.name == "event_trigger" )
        {
          cp.buffer.ctx.fillStyle = "rgb(0,200,0)";
          cp.buffer.ctx.font = "30pt Calibri";
          cp.buffer.ctx.fillText( "Event", cp.buffer.width / 5 >> 0, cp.buffer.height / 2 >> 0 );
        }
        else if ( cp.name == "end_trigger" )
        {
          cp.buffer.ctx.fillStyle = "red";
          cp.buffer.ctx.font = "30pt Calibri";
          cp.buffer.ctx.fillText( "END", cp.buffer.width / 3.5 >> 0, cp.buffer.height / 2 >> 0 );
        }
        else
          cp.buffer.ctx.fillRect( 0, 0, cp.w, cp.h )
      }
      else if ( cp.isTile )
      {
        cp.buffer.ctx.drawImage( DE.ImageManager.images[ cp.sprite ]
                              , cp.sx || 1, cp.sy || 1, cp.tw || cp.w, cp.th || cp.h
                              , 0, 0, cp.w, cp.h );
      }
      else
        cp.buffer.ctx.drawImage( DE.ImageManager.images[ cp.sprite ]
                                , 0, 0
                                , cp.tw || DE.ImageManager.images[ cp.sprite ].widthFrame
                                , cp.th || DE.ImageManager.images[ cp.sprite ].heightFrame
                                , 0, 0, cp.buffer.width, cp.buffer.height );
      
      var button = document.createElement( "div" );
      button.setAttribute( "id", i );button.style.textAlign = "center";button.style.width = "100%";
      
      var def = document.createElement( "div" );
        def.innerHTML = i;def.setAttribute( "id", i );
        def.style.backgroundColor = "rgba(0,0,0,0.8)";def.style.position = "relative"; def.style.zIndex = 10;
      button.appendChild( cp.buffer );
      button.appendChild( def );
      button.style.marginBottom = "5px";
      components.appendChild( button );
      button.onclick = chooseMe;
    }
  }
  
  /*****************************
  *  TOOLS
  */
  
  function chooseMe( e )
  {
    var el = resources.components[ e.target.getAttribute( "id" ) ];
    createComponent( resources.camera.scenePosition.x + 960
      , resources.camera.scenePosition.y + 500
      , e.target.getAttribute( "id" ), el.zindex || 0 );
  }
  function createComponent( x, y, name, zindex, rotation )
  {
    var el = resources.components[ name ];
    var sprite = null;
    if ( !el.sprite )
    {
      if ( el.name == "event_trigger" )
        sprite = new DE.TextRenderer( { fillColor: "rgb(0,200,0)", fontSize: "30" }, 200, 200, "Event" );
      else if ( el.name == "end_trigger" )
        sprite = new DE.TextRenderer( { fillColor: "red", fontSize: "30" }, 200, 200, "END" );
    }
    else if ( el.sx != undefined )
      sprite = new DE.TileRenderer( { "imageName": el.sprite
                                       , "w": el.w, "h": el.h
                                       , "tilesizes": { "w": el.tw || el.w, "h": el.th || el.h }
                                       , "tileposition":{ "x": el.sx, "y": el.sy } } );
    else
      sprite = new DE.SpriteRenderer( { "spriteName": el.sprite, "w": el.w, "h": el.h } );
    
    var collider = undefined;
    if ( !el.collider )
      collider = new DE.CircleCollider( 35 );
    else if ( el.collider.type == "box" )
      collider = new DE.FixedBoxCollider( el.collider.w, el.collider.h, { "offsetLeft": el.collider.l, "offsetTop": el.collider.t } );
    else if ( el.collider.type == "circle" )
      collider = new DE.CircleCollider( el.collider.r );
    
    resources.currentEl = new DE.GameObject( { "name": name, "tag": "components"
                                          , "x": x,"y": y, "z": el.z || 0, "zindex": zindex
                                          , "cursorOnOver": true
                                          ,"renderer": sprite, "collider": collider } );
    resources.currentEl.position.setRotation( rotation || 0 );
    resources.scene.add( resources.currentEl );
    resources.currentEl.onMouseDown = SelectMe;
    displayElGui( resources.currentEl );
  }
  function SelectMe( mouse )
  {
    resources.currentEl = this;
    this.selected = true;
    this.isDragged = true;
    displayElGui( this );
    mouse.stopPropagation = true;
    return true;
  }
  
  /*********************************************
  *     LOADER
  */
    function displayOut( string )
    {
      DE.Inputs.keyLocked = true;
      _textarea.style.display = "block";
      _textarea.area.value = string;
    }
    function hideOut( e )
    {
      DE.Inputs.keyLocked = false;
      _textarea.style.display = "none";
    }
    function loadLevel()
    {
      DE.Inputs.keyLocked = false;
      var string = _textarea.area.value;
      var json = JSON.parse( string );
      if ( !json )
        throw new Error( "Fail durant le loading du niveau" );
      
      resources.scene.gameObjects = new Array();
      for ( var i = 0, g; g = json[ i ]; ++i )
        createComponent( g.x, g.y, g.name, g.zindex, g.rotation );
    }
    function getJson()
    {
      DE.Inputs.keyLocked = true;
      var objects = resources.scene.gameObjects;
      var packet = new Array();
      for ( var i = 0, o; i < objects.length; ++i )
      {
        o = objects[ i ];
        if ( o.tag != "components" )
          continue;
        packet.push( { "x": o.position.x, "y": o.position.y, "z": o.position.z, "name": o.name, "zindex": o.zindex, "rotation": o.position.rotation } );
      }
      
      var string = JSON.stringify( packet );
      displayOut( string );
    }
  
  /***************************************
  *  TOOLS ElGui
  */
    // elGui - Block de GUI de la gestion des components
    function displayElGui( el )
    {
      resources.elGui.style.display = "block";
      resources.elGui.zindex.value = el.zindex;
      resources.elGui.x.value = el.position.x;
      resources.elGui.y.value = el.position.y;
      resources.elGui.z.value = el.position.z || 0;
      if ( el.isLocked )
        resources.elGui.lock.innerHTML = "Unlock";
      else
        resources.elGui.lock.innerHTML = "Lock";
    }
    
    function changeZIndex( e )
    {
      if ( e.target.className == "plus" )
        resources.currentEl.zindex++;
      else
        resources.currentEl.zindex--;
      resources.elGui.zindex.value = resources.currentEl.zindex;
      resources.scene.sortGameObjects();
    }

  return createGUI;
} );