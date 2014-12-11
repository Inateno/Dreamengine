define( [ 'DREAM_ENGINE', 'shared', 'data' ],
function( DE, shared, data )
{
  var generateEnvironment = function( levelId, scene, camera, params )
  {
    params = params || {
      limits: {}
    };
    
    if ( params.limits.maxX == true )
      camera.limits.maxX = 0;
    if ( params.limits.minX == true )
      camera.limits.minX = 0;
    if ( params.limits.maxY == true )
      camera.limits.maxY = 0;
    if ( params.limits.minY == true )
      camera.limits.minY = 0;
    
    scene.collideObjects = [];
    // add other collide (example barrel)
    
    // clean the scene
    scene.deleteAll();
    
    if ( !shared.levels[ levelId ] )
    {
      console.log( "%cGive a levelId not found in levels: " + levelId, "colors:red" );
      return;
    }
    var level = shared.levels[ levelId ];
    var ldata = level.components;
    
    for ( var i = 0; i < ldata.length; ++i )
    {
      var el = ldata[ i ];
      var component = shared.components[ el.name ];
      // you can do ice blocks :D
      if ( component.tag.match( "ice" ) )
      {
        component.physicCoefReductor = data.coefIceReductor;
        component.physicCoefImpulsion= data.coefIceImpulsion;
      }
      // AI / monsters or whatever you like
      if ( component.tag == "character" )
      {
        throw new Error ( "no character in code" );
        /*var character = null;
        switch( component.name )
        {
          character = new AI( "super-monster" )
        }
        scene.mobs.push( character );
        scene.add( character );*/
      }
      else
      {
        var sprite = null;
        if ( !component.sprite )
        {}
        else if ( component.isTile )
          sprite = new DE.TileRenderer( {
            "imageName": component.sprite
            , "w": component.w, "h": component.h
            , "tilesizes": { "w": component.tw || component.w, "h": component.th || component.h }
            , "tileposition": { "x": component.sx, "y": component.sy }
          } );
        else
          sprite = new DE.SpriteRenderer( { "spriteName": component.sprite, "w": component.w, "h": component.h } );
        
        // sprite = new DE.BoxRenderer( { "fillColor": "green" }, component.w, component.h );
        var collider = undefined;
        if ( component.collider && el.zindex >= 0 )
        {
          if ( component.collider.type == "circle" )
            collider = new DE.CircleCollider( component.collider.r,
                { "offsetLeft": component.collider.l, "offsetTop": component.collider.t } );
          else
            collider = new DE.FixedBoxCollider( component.collider.w, component.collider.h,
                { "offsetLeft": component.collider.l, "offsetTop": component.collider.t } );
        }
        
        var o;
        switch( component.tag )
        {
          // example how to made "custom component"
          /*case "door":
            o = new entities.Door( {
              "name": el.name, "tag": component.tag
              , "x": el.x >> 0,"y": el.y >> 0, "zindex": el.zindex || component.zindex
              ,"renderer": sprite, "collider": collider
              ,"destination": el.destination || component.defaultDestination
            } );
            scene.doors.push( o );
            break;*/
          default:
            o = new DE.GameObject( {
              "name": el.name, "tag": component.tag
              , "x": el.x >> 0,"y": el.y >> 0
              , "z": el.z || component.z || 0
              , "zindex": el.zindex || component.zindex
              , "renderer": sprite, "collider": collider
            } );
        }
        o.physicCoefReductor = component.physicCoefReductor || data.coefFloorReductor;
        o.physicCoefImpulsion = component.physicCoefImpulsion || data.coefFloorImpulsion;
        
        scene.add( o );
        
        // if the tag of the object match with those you can collide with, push inside
        if ( data.environmentCollidersTag.indexOf( o.tag ) !== -1 )
          scene.collideObjects.push( o );
        
        // setting limits on camera if asked
          if ( params.limits.maxY == true && ( !params.limits.colliderOffset || !o.collider )
            && o.position.y > camera.limits.maxY )
            camera.limits.maxY = o.position.y;
          else if ( params.limits.maxY == true && params.limits.colliderOffset && o.collider )
          {
            if ( o.collider.radius && o.position.y + o.collider.radius >> 0 > camera.limits.maxY )
              camera.limits.maxY = o.position.y + o.collider.radius;
            else if ( o.collider.height && o.position.y + o.collider.height * 0.5 >> 0 > camera.limits.maxY )
              camera.limits.maxY = o.position.y + o.collider.height * 0.5 >> 0;
          }
          
          if ( params.limits.minY == true && ( !params.limits.colliderOffset || !o.collider )
            && o.position.y < camera.limits.minY )
            camera.limits.minY = o.position.y;
          else if ( params.limits.minY == true && params.limits.colliderOffset && o.collider )
          {
            if ( o.collider.radius && o.position.y - o.collider.radius >> 0 < camera.limits.minY )
              camera.limits.minY = o.position.y - o.collider.radius;
            else if ( o.collider.height && o.position.y - o.collider.height * 0.5 >> 0 < camera.limits.minY )
              camera.limits.minY = o.position.y - o.collider.height * 0.5 >> 0;
          }
          
          if ( params.limits.maxX == true && ( !params.limits.colliderOffset || !o.collider )
            && o.position.x > camera.limits.maxX )
            camera.limits.maxX = o.position.x;
          else if ( params.limits.maxX == true && params.limits.colliderOffset && o.collider )
          {
            if ( o.collider.radius && o.position.x + o.collider.radius >> 0 > camera.limits.maxX )
              camera.limits.maxX = o.position.x + o.collider.radius;
            else if ( o.collider.width && o.position.x + o.collider.width * 0.5 >> 0 > camera.limits.maxX )
              camera.limits.maxX = o.position.x + o.collider.width * 0.5 >> 0;
          }
          
          // min x value
          if ( params.limits.minX == true && ( !params.limits.colliderOffset || !o.collider )
            && o.position.x < camera.limits.minX )
            camera.limits.minX = o.position.x;
          else if ( params.limits.minX == true && params.limits.colliderOffset && o.collider )
          {
            if ( o.collider.radius && o.position.x - o.collider.radius >> 0 < camera.limits.minX )
              camera.limits.minX = o.position.x - o.collider.radius;
            else if ( o.collider.width && o.position.x - o.collider.width * 0.5 >> 0 < camera.limits.minX )
              camera.limits.minX = o.position.x - o.collider.width * 0.5 >> 0;
          }
      }
    }
    
    if ( params.limits.maxX != true && !isNaN( params.limits.maxX ) )
      camera.limits.maxX = params.limits.maxX;
    if ( params.limits.minX != true && !isNaN( params.limits.minX ) )
      camera.limits.minX = params.limits.minX;
    if ( params.limits.maxY != true && !isNaN( params.limits.maxY ) )
      camera.limits.maxY = params.limits.maxY;
    if ( params.limits.minY != true && !isNaN( params.limits.minY ) )
      camera.limits.minY = params.limits.minY;
    
    DE.trigger( "map-loaded", levelId, scene, camera );
  };
  
  return generateEnvironment;
} );
