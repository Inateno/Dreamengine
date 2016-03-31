define( []
, function()
{
  var datas = {
    "enemies": {
      "one": { "spriteName": "enemies", "frame": 0, "bulletOffset": 50, "fireRate": false, "life": 3
              , "radius": 60, "colOffsetX": 0, "colOffsetY": 0, "offsetFire": 50, "scale": 0.4, "speed": 4 }
      ,"two": { "spriteName": "enemies", "frame": 1, "bulletOffset": 50, "fireRate": 1300, "life": 4
              , "radius": 70, "colOffsetX": 0, "colOffsetY": 0, "offsetFire": 50, "scale": 0.4, "speed": 6 }
      ,"three": { "spriteName": "enemies", "frame": 2, "bulletOffset": 50, "fireRate": 1000, "life": 10
              , "radius": 80, "colOffsetX": 0, "colOffsetY": 0, "offsetFire": 50, "scale": 0.4, "speed": 2 }
      ,"four": { "spriteName": "enemies", "frame": 3, "bulletOffset": 50, "fireRate": 600, "life": 4
              , "radius": 60, "colOffsetX": 0, "colOffsetY": 0, "offsetFire": 50, "scale": 0.4, "speed": 7 }
      ,"bench": { "spriteName": "enemies", "frame": 2, "bulletOffset": 50, "fireRate": 100, "life": 4
              , "radius": 60, "colOffsetX": 0, "colOffsetY": 0, "offsetFire": 50, "scale": 0.4, "speed": 2 }
    }
    
    , "waves": {
      "2000": {
        "enemies": [
          { "x": 200, "y": -200, "name": "one" }
          ,{ "x": 800, "y": -200, "name": "one" }
        ]
      }
      ,"2800": {
        "enemies": [
          { "x": 300, "y": -200, "name": "one" }
          ,{ "x": 700, "y": -200, "name": "one" }
        ]
      }
      ,"4000": {
        "enemies": [
          { "x": 100, "y": -200, "name": "one" }
          ,{ "x": 500, "y": -200, "name": "two" }
          ,{ "x": 900, "y": -200, "name": "one" }
        ]
      }
      ,"5300": {
        "enemies": [
          { "x": 300, "y": -200, "name": "two" }
          ,{ "x": 500, "y": -200, "name": "two" }
          ,{ "x": 400, "y": -200, "name": "two" }
        ]
      }
      ,"5900": {
        "enemies": [
          { "x": 800, "y": -200, "name": "two" }
          ,{ "x": 700, "y": -200, "name": "two" }
          ,{ "x": 600, "y": -200, "name": "two" }
        ]
      }
      ,"7000": {
        "enemies": [
          { "x": 350, "y": -200, "name": "three" }
          ,{ "x": 500, "y": -400, "name": "four" }
          ,{ "x": 650, "y": -200, "name": "three" }
        ]
      }
      ,"8000": {
        "enemies": [
          { "x": 250, "y": -300, "name": "three" }
          ,{ "x": 500, "y": -200, "name": "three" }
          ,{ "x": 750, "y": -300, "name": "three" }
        ]
      }
    }
    
    , "benchwaves": {
      "2000": {
        "enemies": [
          { "x": 100, "y": -200, "name": "one" }
          ,{ "x": 200, "y": -200, "name": "one" }
          ,{ "x": 300, "y": -200, "name": "one" }
          ,{ "x": 400, "y": -200, "name": "one" }
          ,{ "x": 500, "y": -200, "name": "one" }
          ,{ "x": 600, "y": -200, "name": "one" }
          ,{ "x": 700, "y": -200, "name": "one" }
          ,{ "x": 800, "y": -200, "name": "one" }
          ,{ "x": 900, "y": -200, "name": "one" }
          
          ,{ "x": 100, "y": -300, "name": "one" }
          ,{ "x": 200, "y": -300, "name": "one" }
          ,{ "x": 300, "y": -300, "name": "one" }
          ,{ "x": 400, "y": -300, "name": "one" }
          ,{ "x": 500, "y": -300, "name": "one" }
          ,{ "x": 600, "y": -300, "name": "one" }
          ,{ "x": 700, "y": -300, "name": "one" }
          ,{ "x": 800, "y": -300, "name": "one" }
          ,{ "x": 900, "y": -300, "name": "one" }
        ]
      }
      ,"2800": {
        "enemies": [
          { "x": 100, "y": -200, "name": "one" }
          ,{ "x": 200, "y": -200, "name": "one" }
          ,{ "x": 300, "y": -200, "name": "one" }
          ,{ "x": 400, "y": -200, "name": "one" }
          ,{ "x": 500, "y": -200, "name": "one" }
          ,{ "x": 600, "y": -200, "name": "one" }
          ,{ "x": 700, "y": -200, "name": "one" }
          ,{ "x": 800, "y": -200, "name": "one" }
          ,{ "x": 900, "y": -200, "name": "one" }
          
          ,{ "x": 100, "y": -300, "name": "one" }
          ,{ "x": 200, "y": -300, "name": "one" }
          ,{ "x": 300, "y": -300, "name": "one" }
          ,{ "x": 400, "y": -300, "name": "one" }
          ,{ "x": 500, "y": -300, "name": "one" }
          ,{ "x": 600, "y": -300, "name": "one" }
          ,{ "x": 700, "y": -300, "name": "one" }
          ,{ "x": 800, "y": -300, "name": "one" }
          ,{ "x": 900, "y": -300, "name": "one" }
        ]
      }
      ,"4000": {
        "enemies": [
          { "x": 100, "y": -200, "name": "two" }
          ,{ "x": 200, "y": -200, "name": "two" }
          ,{ "x": 300, "y": -200, "name": "two" }
          ,{ "x": 400, "y": -200, "name": "two" }
          ,{ "x": 500, "y": -200, "name": "two" }
          ,{ "x": 600, "y": -200, "name": "two" }
          ,{ "x": 700, "y": -200, "name": "two" }
          ,{ "x": 800, "y": -200, "name": "two" }
          ,{ "x": 900, "y": -200, "name": "two" }
          
          ,{ "x": 100, "y": -400, "name": "two" }
          ,{ "x": 200, "y": -400, "name": "two" }
          ,{ "x": 300, "y": -400, "name": "two" }
          ,{ "x": 400, "y": -400, "name": "two" }
          ,{ "x": 500, "y": -400, "name": "two" }
          ,{ "x": 600, "y": -400, "name": "two" }
          ,{ "x": 700, "y": -400, "name": "two" }
          ,{ "x": 800, "y": -400, "name": "two" }
          ,{ "x": 900, "y": -400, "name": "two" }
        ]
      }
      ,"5300": {
        "enemies": [
          { "x": 100, "y": -200, "name": "two" }
          ,{ "x": 200, "y": -200, "name": "two" }
          ,{ "x": 300, "y": -200, "name": "two" }
          ,{ "x": 400, "y": -200, "name": "two" }
          ,{ "x": 500, "y": -200, "name": "two" }
          ,{ "x": 600, "y": -200, "name": "two" }
          ,{ "x": 700, "y": -200, "name": "two" }
          ,{ "x": 800, "y": -200, "name": "two" }
          ,{ "x": 900, "y": -200, "name": "two" }
          
          ,{ "x": 100, "y": -400, "name": "two" }
          ,{ "x": 200, "y": -400, "name": "two" }
          ,{ "x": 300, "y": -400, "name": "two" }
          ,{ "x": 400, "y": -400, "name": "two" }
          ,{ "x": 500, "y": -400, "name": "two" }
          ,{ "x": 600, "y": -400, "name": "two" }
          ,{ "x": 700, "y": -400, "name": "two" }
          ,{ "x": 800, "y": -400, "name": "two" }
          ,{ "x": 900, "y": -400, "name": "two" }
        ]
      }
      ,"6500": {
        "enemies": [
          { "x": 100, "y": -200, "name": "two" }
          ,{ "x": 200, "y": -200, "name": "two" }
          ,{ "x": 300, "y": -200, "name": "two" }
          ,{ "x": 400, "y": -200, "name": "two" }
          ,{ "x": 500, "y": -200, "name": "two" }
          ,{ "x": 600, "y": -200, "name": "two" }
          ,{ "x": 700, "y": -200, "name": "two" }
          ,{ "x": 800, "y": -200, "name": "two" }
          ,{ "x": 900, "y": -200, "name": "two" }
        ]
      }
      ,"7000": {
        "enemies": [
          { "x": 50, "y": -200, "name": "bench" }
          ,{ "x": 150, "y": -200, "name": "bench" }
          ,{ "x": 250, "y": -200, "name": "bench" }
          ,{ "x": 350, "y": -200, "name": "bench" }
          ,{ "x": 450, "y": -200, "name": "bench" }
          ,{ "x": 550, "y": -200, "name": "bench" }
          ,{ "x": 650, "y": -200, "name": "bench" }
          ,{ "x": 750, "y": -200, "name": "bench" }
          ,{ "x": 850, "y": -200, "name": "bench" }
          ,{ "x": 950, "y": -200, "name": "bench" }
          
          ,{ "x": 100, "y": -500, "name": "bench" }
          ,{ "x": 200, "y": -500, "name": "bench" }
          ,{ "x": 300, "y": -500, "name": "bench" }
          ,{ "x": 400, "y": -500, "name": "bench" }
          ,{ "x": 500, "y": -500, "name": "bench" }
          ,{ "x": 600, "y": -500, "name": "bench" }
          ,{ "x": 700, "y": -500, "name": "bench" }
          ,{ "x": 800, "y": -500, "name": "bench" }
          ,{ "x": 900, "y": -500, "name": "bench" }
          
          ,{ "x": 50, "y": -800, "name": "bench" }
          ,{ "x": 150, "y": -800, "name": "bench" }
          ,{ "x": 250, "y": -800, "name": "bench" }
          ,{ "x": 350, "y": -800, "name": "bench" }
          ,{ "x": 450, "y": -800, "name": "bench" }
          ,{ "x": 550, "y": -800, "name": "bench" }
          ,{ "x": 650, "y": -800, "name": "bench" }
          ,{ "x": 750, "y": -800, "name": "bench" }
          ,{ "x": 850, "y": -800, "name": "bench" }
          ,{ "x": 950, "y": -800, "name": "bench" }
        ]
      }
      ,"8000": {
        "enemies": [
          { "x": 50, "y": -200, "name": "four" }
          ,{ "x": 150, "y": -200, "name": "four" }
          ,{ "x": 250, "y": -200, "name": "four" }
          ,{ "x": 350, "y": -200, "name": "four" }
          ,{ "x": 450, "y": -200, "name": "four" }
          ,{ "x": 550, "y": -200, "name": "four" }
          ,{ "x": 650, "y": -200, "name": "four" }
          ,{ "x": 750, "y": -200, "name": "four" }
          ,{ "x": 850, "y": -200, "name": "four" }
          ,{ "x": 950, "y": -200, "name": "four" }
        ]
      }
      ,"8500": {
        "enemies": [
          { "x": 50, "y": -200, "name": "four" }
          ,{ "x": 150, "y": -200, "name": "four" }
          ,{ "x": 250, "y": -200, "name": "four" }
          ,{ "x": 350, "y": -200, "name": "four" }
          ,{ "x": 450, "y": -200, "name": "four" }
          ,{ "x": 550, "y": -200, "name": "four" }
          ,{ "x": 650, "y": -200, "name": "four" }
          ,{ "x": 750, "y": -200, "name": "four" }
          ,{ "x": 850, "y": -200, "name": "four" }
          ,{ "x": 950, "y": -200, "name": "four" }
        ]
      }
      ,"9500": {
        "enemies": [
          { "x": 50, "y": -200, "name": "four" }
          ,{ "x": 150, "y": -200, "name": "four" }
          ,{ "x": 250, "y": -200, "name": "four" }
          ,{ "x": 350, "y": -200, "name": "four" }
          ,{ "x": 450, "y": -200, "name": "four" }
          ,{ "x": 550, "y": -200, "name": "four" }
          ,{ "x": 650, "y": -200, "name": "four" }
          ,{ "x": 750, "y": -200, "name": "four" }
          ,{ "x": 850, "y": -200, "name": "four" }
          ,{ "x": 950, "y": -200, "name": "four" }
        ]
      }
      ,"12000": {
        "enemies": [
          { "x": 50, "y": -200, "name": "four" }
          ,{ "x": 150, "y": -200, "name": "four" }
          ,{ "x": 250, "y": -200, "name": "four" }
          ,{ "x": 350, "y": -200, "name": "four" }
          ,{ "x": 450, "y": -200, "name": "four" }
          ,{ "x": 550, "y": -200, "name": "four" }
          ,{ "x": 650, "y": -200, "name": "four" }
          ,{ "x": 750, "y": -200, "name": "four" }
          ,{ "x": 850, "y": -200, "name": "four" }
          ,{ "x": 950, "y": -200, "name": "four" }
          
          ,{ "x": 50, "y": -400, "name": "four" }
          ,{ "x": 150, "y": -400, "name": "four" }
          ,{ "x": 250, "y": -400, "name": "four" }
          ,{ "x": 350, "y": -400, "name": "four" }
          ,{ "x": 450, "y": -400, "name": "four" }
          ,{ "x": 550, "y": -400, "name": "four" }
          ,{ "x": 650, "y": -400, "name": "four" }
          ,{ "x": 750, "y": -400, "name": "four" }
          ,{ "x": 850, "y": -400, "name": "four" }
          ,{ "x": 950, "y": -400, "name": "four" }
          
          ,{ "x": 50, "y": -600, "name": "four" }
          ,{ "x": 150, "y": -600, "name": "four" }
          ,{ "x": 250, "y": -600, "name": "four" }
          ,{ "x": 350, "y": -600, "name": "four" }
          ,{ "x": 450, "y": -600, "name": "four" }
          ,{ "x": 550, "y": -600, "name": "four" }
          ,{ "x": 650, "y": -600, "name": "four" }
          ,{ "x": 750, "y": -600, "name": "four" }
          ,{ "x": 850, "y": -600, "name": "four" }
          ,{ "x": 950, "y": -600, "name": "four" }
          
          ,{ "x": 50, "y": -800, "name": "four" }
          ,{ "x": 150, "y": -800, "name": "four" }
          ,{ "x": 250, "y": -800, "name": "four" }
          ,{ "x": 350, "y": -800, "name": "four" }
          ,{ "x": 450, "y": -800, "name": "four" }
          ,{ "x": 550, "y": -800, "name": "four" }
          ,{ "x": 650, "y": -800, "name": "four" }
          ,{ "x": 750, "y": -800, "name": "four" }
          ,{ "x": 850, "y": -800, "name": "four" }
          ,{ "x": 950, "y": -800, "name": "four" }
          
          ,{ "x": 100, "y": -1000, "name": "four" }
          ,{ "x": 200, "y": -1000, "name": "four" }
          ,{ "x": 300, "y": -1000, "name": "four" }
          ,{ "x": 400, "y": -1000, "name": "four" }
          ,{ "x": 500, "y": -1000, "name": "four" }
          ,{ "x": 600, "y": -1000, "name": "four" }
          ,{ "x": 700, "y": -1000, "name": "four" }
          ,{ "x": 800, "y": -1000, "name": "four" }
          ,{ "x": 900, "y": -1000, "name": "four" }
          
          ,{ "x": 100, "y": -1200, "name": "four" }
          ,{ "x": 200, "y": -1200, "name": "four" }
          ,{ "x": 300, "y": -1200, "name": "four" }
          ,{ "x": 400, "y": -1200, "name": "four" }
          ,{ "x": 500, "y": -1200, "name": "four" }
          ,{ "x": 600, "y": -1200, "name": "four" }
          ,{ "x": 700, "y": -1200, "name": "four" }
          ,{ "x": 800, "y": -1200, "name": "four" }
          ,{ "x": 900, "y": -1200, "name": "four" }
        ]
      }
    }
  };
  
  
  return datas;
} );