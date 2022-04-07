var timer = new Date().getTime()

var canvas = document.querySelector('canvas[id="pinCanvas"]');
var mapCanvas = document.querySelector('canvas[id="myCanvas"]');

var c = canvas.getContext('2d');

var mouse = {
  x: undefined,
  y: undefined
}

const pinColours = ["#ff00d0", "#c800ff", "#ff9eb6", "#ff0000", "#8f70ff", "#00b3ff", "#00ff04", "#00a814", "#eeff00", "#ffae00"];
const moveColours = ["#99007d", "#740094", "#9c5466", "#a30000", "#190094", "#0a6b94", "#048106", "#13621b", "#686f01", "#92680c"];

class Pin {
  constructor(x, y, radius, index, isChar){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.defaultRadius = radius;
    this.largeRadius = radius * 3;
    this.colour = 0;
    this.openCol = "#ffffff";
    this.moving = false;
    this.open = false;
    this.index = index;
  
    this.title = "Title";
    this.content = "";

    this.dead = false;
  
    this.isCharacter = isChar;
    //character info. . .
    this.name = "";
    this.race = "";
    this.pronounA = "";
    this.pronounB = "";
    this.height = "";
    this.weight = "";
    this.scores = [-100, 0, 0, 0,0, 0];
    this.notes = "";
    this.ideals = "";
    this.bonds = "";
    this.flaws = "";
    this.traits = "";
  }

  draw(){
    c.beginPath();
  
    if(this.isCharacter){
      c.moveTo(this.x, this.y - this.radius * 1.3);
      c.lineTo(this.x - this.radius, this.y);
      c.lineTo(this.x, this.y + this.radius * 1.3);
      c.lineTo(this.x + this.radius, this.y);
      c.closePath();
    }
    else{
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    }
    
    if(this.open){
      c.strokeStyle = "#969696";
      c.fillStyle = this.openCol;       
    }
    else if(this.moving){
      c.strokeStyle = moveColours[this.colour];
      c.fillStyle = moveColours[this.colour];       
    }
    else{
      c.strokeStyle = pinColours[this.colour];
      c.fillStyle = pinColours[this.colour]; 
    }
    c.lineWidth = 5;
    c.strokeStyle = "#cccccc";
    c.stroke();
    c.fill();
  }

  isHovered(){
    if(mouse.x - this.x < this.radius && mouse.x - this.x > -this.radius && mouse.y - this.y < this.radius && mouse.y - this.y > -this.radius){
      return true;
    }
    return false;
  }   
  
  update(){
    if(this.moving == true){
      //update position
      this.x = mouse.x;
      this.y = mouse.y;
    }
    else{
      //Hovering!
      if(mouse.x - this.x < this.radius && mouse.x - this.x > -this.radius
        && mouse.y - this.y < this.radius && mouse.y - this.y > -this.radius){
        if(this.radius < this.largeRadius){
          this.radius += 1;
          if(this.radius > this.largeRadius){
            this.radius = this.largeRadius;
          }
        }
      }
      else{
        if(this.radius > this.defaultRadius){
          this.radius -= 1;
          if(this.radius < this.defaultRadius){
            this.radius = this.defaultRadius;
          }
        }
      }
    }
    if(!this.dead){
      this.draw();
    }
  }
}

var pins = [];

var heldPin = null;

window.addEventListener('mousemove', function(event){
  //hover over pin
  var bound = canvas.getBoundingClientRect();
  mouse.x = event.clientX - bound.left;
  mouse.y = event.clientY - bound.top;
});

window.addEventListener('mousedown', function(event){
  //Click on pin
  if(dragging == false){
    var hoveredPins = [];
    var closestPin = null;
    var shortDist = 10000;
    for (let i = 0; i < pins.length; i++) {
      if(pins[i].isHovered()){
        hoveredPins.push(pins[i]);
        if(closestPin == null){
          closestPin = pins[i];
          shortDist = Math.sqrt(Math.pow(mouse.x - pins[i].x, 2) + Math.pow(mouse.y - pins[i].y, 2));
        }else{
          //check if closer
          let newDist = Math.sqrt(Math.pow(mouse.x - pins[i].x, 2) + Math.pow(mouse.y - pins[i].y, 2));
          if(newDist < shortDist){
            try {
              shortDist = newDist;
              closestPin = pin[i];
            } catch (error) {
              //Just take one of the pins if we have an error.
            }
          }
        }
      }
    }
    if(closestPin != null){
      timer = new Date().getTime();
      heldPin = closestPin;
      setTimeout(holdDownPin, 200, closestPin);
    }
  }
});

function holdDownPin(pin){
  if(pin == heldPin){
    if(mouse.x - pin.x < pin.radius && mouse.x - pin.x > -pin.radius && mouse.y - pin.y < pin.radius && mouse.y - pin.y > -pin.radius){
      pin.moving = true;
    }
  }
}

window.addEventListener('mouseup', function(){
  if(heldPin != null){
    if(heldPin.moving == false && heldPin.open == false){
      //the pin has been clicked: open a pin
      if(mouse.x - heldPin.x < heldPin.radius && mouse.x - heldPin.x > -heldPin.radius && mouse.y - heldPin.y < heldPin.radius && mouse.y - heldPin.y > -heldPin.radius){
        heldPin.open = true;
        openPin(heldPin.x, heldPin.y, heldPin.index);
      }
    }
    heldPin.moving = false;
    heldPin = null;
  }
});

function spawnPin(isChar, x, y){
  var radius = 10;
  pins.push(new Pin(x, y, radius, pins.length, isChar)); //Add pin to worldspace
  openPin(mouse.x,mouse.y + 80,pins.length-1);
  //var x = document.body.querySelectorAll('div[class="pin"]');
  //closePin(x[x.length-1].querySelector('button[id="charClose"]'));
}

function animate(){
  requestAnimationFrame(animate);
  c.clearRect(0,0,canvas.width, canvas.height);

  //loop through pins and update.
  for(var i = 0; i < pins.length; i++){
    pins[i].update();
  }
}

animate();