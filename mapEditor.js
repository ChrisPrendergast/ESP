var sam_c = document.getElementById("myCanvas");
var context_s = sam_c.getContext("2d", { alpha: false });
var canvas_s = document.querySelector('canvas[id="myCanvas"]');

var first_time = false;
var cursor_biome = 1;
var mouse_down = false;
var brush_size = 5
var invis_brush = brush_size + 1
var square_lengths = 32
//canvas_s.width = 16384
//canvas_s.height = 16384
var x_length = 16384
var y_length = 16384

var editing = false;

function getMousePosition(canvas_s, event){
  if(editing && !dragging){
    var rect = canvas_s.getBoundingClientRect();
    return{
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
}

function getNearestGridSquare(position){
  var x = position.x;
  var y = position.y;
  if(x < 0 || y < 0) return null;
  x = (Math.floor(x / square_lengths) * square_lengths)
  y = (Math.floor(y / square_lengths) * square_lengths)
  return {
    x: x,
    y: y
  };
}

function compileCoord(x, y){
  return{
    x: x,
    y: y
  };
}

function brushArea(position){
  var square_steps = []
  for (var x = -brush_size; x < brush_size+1; x += square_lengths){
    for (var y = -brush_size; y < brush_size+1; y += square_lengths){
      square_steps.push(compileCoord(position.x + x, position.y + y))
    }
  }
  return square_steps;
}

function changeBiomePainter(biome){
  console.log("change bioee")
  if(biome == 1){
    cursor_biome = 1
  }
  else if (biome == 2){
    cursor_biome = 3
  }
  else if (biome == 3){
    cursor_biome = 4
  }
  else if (biome == 4){
    cursor_biome = 2
  }
}

function updateMapBiome(x, y, biome){
  x1 = Math.floor(x/square_lengths)
  y1 = Math.floor(y/square_lengths)
  current_map[x1][y1].setType(biome)
}


function newPaintSquare(x2, y2){
  x = Math.floor(x2/square_lengths);
  y = Math.floor(y2/square_lengths);
  let answer = "";
  let tempDefiner = new MapNode(0,0);
  let pixelList = [[tempDefiner,tempDefiner,tempDefiner],[tempDefiner,tempDefiner,tempDefiner],[tempDefiner,tempDefiner,tempDefiner]];
  for (let m = -1; m < 2; m++){
    for (let n = -1; n < 2; n++){
      if (x+m >= 0 && y+n >= 0 && y+n <= 512 && x+m <= 512){
        pixelList[m+1][n+1] = current_map[x+m][y+n];
      } else {
        pixelList[m+1][n+1] = new MapNode(0.004,4); //Defines nodes outside the bound to be water
      }
    }
  }
  answer = mapGen.decide(pixelList);
  img = document.getElementById(answer);
  //console.log(img + " " + answer);
  if (img != null){
    context_s.drawImage(img, x*32, y*32);
  }
}

window.addEventListener('mousedown', function(){
  if(editing){
    if (first_time == false){
      current_map = mapGen.pullMap()
      first_time = true
    }
    mouse_down = true
  }
});
window.addEventListener('mouseup', function(){
  if(editing){
    mouse_down = false
  }
});
window.addEventListener('mousemove', function(){
  if(editing){
    if (mouse_down == true){

      //positions = brushArea(mouse_pos);
      // for (var i = 0; i < positions.length; i++){
      //   var pos = getNearestGridSquare(positions[i]);
      //   if (pos != null){
      //     paintSquare(pos.x, pos.y, cursor_biome)
            
      //     updateMapBiome(pos.x, pos.y, cursor_biome)
      //     // if(i>5){
      //     //   paintSquare(pos.x, pos.y, 1)
      //     // }
      //   }
      // }
      
      var mouse_pos = getMousePosition(sam_c, event);
      var pos = getNearestGridSquare(mouse_pos);
      if (pos != null){
        updateMapBiome(pos.x, pos.y, cursor_biome)
        for (var i = -1; i < 2; i++){
          for (var j = -1; j < 2; j++){
            newPaintSquare(pos.x + i, pos.y + j)
          }
        }
        
      }
    }
  }
});


var current_map;