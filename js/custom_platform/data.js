define( [],
function()
{
  var data = {
    coefAirReductor   : 0.99
    , coefFloorReductor : 0.5
    , coefFloorImpulsion: 0.7
    , coefIceReductor   : 0.98
    , coefIceImpulsion  : 0.05
    , coefAirFriction   : 0.9
    , maxAttractionForce: 100
    , maxGravityX       : 20
    , maxGravityY       : 20
    , attractionForce   : 0.1
    , coefAirControlX   : 0.1
    , coefAirControlY   : 0.01
    
    , environmentCollidersTag: [ 'block' ]
    
    ,character: {
      moveSpeed: 8
      ,jumpForce: -3.2
      ,jumpImpulsion: 5
      ,mass: 10
    }
  };
  
  return data;
} );