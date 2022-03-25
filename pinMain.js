dragElement(document.getElementById("characterWindow"));
dragElement(document.getElementById("pinWindow"));
dragElement(document.getElementById("dirWindow"));
dragElement(document.getElementById("calendarWindow"));
dragElement(document.getElementById("paintWindow"));

var dragging = false;

var previousSelected = false;
var prevZ = 10;

var request = new XMLHttpRequest();
request.open("GET","characters.json", false);
request.send(null);
var names = JSON.parse(request.responseText);

var scoreInputs = document.getElementsByName('scr');
for (let i = 0; i < scoreInputs.length; i++) {
  scoreInputs[i].addEventListener('input', updateMod);
}

function dragElement(element) {
  var p1 = 0, p2 = 0, p3 = 0, p4 = 0;
  var success = false;
  for(let i =0; i<element.children.length; i++){
    if (element.children[i].id == element.id + "Header") {
      success = true;
      element.children[i].onmousedown = dragMouseDown;
    }
  }
  if(success == false) {
    //Drag by any position in the window if header is non existent
    element.onmousedown = dragMouseDown;
  }

  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    dragging = true;
    //Move to front of screen (occurs on click not drag)
    if(previousSelected == false){previousSelected = element;}
    if (element != previousSelected) { 
      //previousSelected.style.zIndex = 1;
      prevZ++;
      element.style.zIndex = prevZ;
      previousSelected = element;
    }
    
    // get the mouse cursor position at startup:
    p3 = e.clientX;
    p4 = e.clientY;
    document.onmouseup = closeDragElement;

    // call when cursor moves
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    
    // find mouse pos
    p1 = p3 - e.clientX;
    p2 = p4 - e.clientY;
    p3 = e.clientX;
    p4 = e.clientY;
    
    // set new position:
    element.style.top = (element.offsetTop - p2) + "px"; //move y
    element.style.left = (element.offsetLeft - p1) + "px"; //move X
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    dragging = false;
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function openCloseEditor(){
  if(editing){
    //close editor
    openCloseWindow(1, "paintWindow");
    editing = false;
  }
  else{
    //open editor
    openCloseWindow(0, "paintWindow");
    editing = true;
  }
}

function openPinFromDir(button){
  var i = button.getAttribute("index");
  for (let index = 0; index < pins.length; index++) {
    if(pins[index].index == i){
      if(pins[index].open == false){
        pins[index].open = true;
        openPin(pins[index].x, pins[index].y, i);
      }
    }
  }
}

function deletePin(button){
  var index = button.getAttribute("index");
  //Remove pin from array
  pins[index].dead = true;
  //Remove pin from directory
  var dirBut = findPinInDir(index)
  dirBut.parentNode.removeChild(dirBut);
}

function openPin(x, y, i){
  var pin;
  var newPin;
  //openCloseWindow(0, "dirWindow");
  //Set content:
  if(pins[i].isCharacter){
    pin = document.getElementById("characterWindow");
    newPin = pin.cloneNode(true);
    var scoreInputs = newPin.querySelectorAll('input[name="scr"]');
    
    for (let i = 0; i < scoreInputs.length; i++) {
      scoreInputs[i].addEventListener('change', function(event){
        updateMod(newPin);
      });
    }  
  
    if(pins[i].scores[0] == -100){
      //new character: randomise!
      randomiseCharacter(newPin);
    }
    else{
      //fill character sheet with character data
      newPin.querySelector('input[name="name"]').value = pins[i].name;
      newPin.querySelector('input[name="race"]').value = pins[i].race;
      newPin.querySelector('input[name="pronounA"]').value = pins[i].pronounA;
      newPin.querySelector('input[name="pronounB"]').value = pins[i].pronounB;
      newPin.querySelector('input[name="height"]').value = pins[i].height;
      newPin.querySelector('input[name="weight"]').value = pins[i].weight;
      
      var scores = newPin.querySelectorAll('input[name="scr"]');
      for (let index = 0; index < scores.length; index++) {
        scores[index].value = pins[i].scores[index];
        scores[index].addEventListener('change', function(event){
          updateMod(newPin);
        });
        updateMod(newPin);
      }
      
      newPin.querySelector('textArea[name="notes"]').value = pins[i].notes;
      newPin.querySelector('textArea[name="ideals"]').value = pins[i].ideals;
      newPin.querySelector('textArea[name="bonds"]').value = pins[i].bonds;
      newPin.querySelector('textArea[name="flaws"]').value = pins[i].flaws;
      newPin.querySelector('textArea[name="traits"]').value = pins[i].traits;
    }
  }
  else{
    pin = document.getElementById("pinWindow");
    newPin = pin.cloneNode(true);
    newPin.querySelector('input[name="pinTitle"]').value = pins[i].title ;
    newPin.querySelector('textArea[name="notes"]').value = pins[i].content;
  
    newPin.querySelector('input[name="pinTitle"]').style.width = (newPin.querySelector('input[name="pinTitle"]').value.length + 2) + 'ch';
  }
  
  //set button colour
  newPin.querySelector('button[id="col"]').style.background = pinColours[pins[i].colour];   
  
  document.body.appendChild(newPin);
  newPin.style.display = 'block';
  dragElement(newPin);
  //bring to top:
  prevZ++;
  newPin.style.top = y + "px";
  newPin.style.left = x + "px";
  newPin.style.zIndex = prevZ;
  newPin.setAttribute("index", i);
}

function createPin(index){
  //Add pin to directory
  var directory = document.getElementById("dirWindowBody");
  var pinButton = document.getElementById("dirButton");
  var newPin = pinButton.cloneNode(true);
  newPin.style.display = 'block';

  directory.querySelectorAll('div[id = "category"]')[pins[index].colour].appendChild(newPin);
  if(pins[index].isCharacter){
    newPin.querySelector('button').innerText = "> " + pins[index].name + " <";
  }
  else{
    newPin.querySelector('button').innerText = pins[index].title;
  }
  newPin.querySelector('button').style.background = pinColours[pins[index].colour];
  newPin.setAttribute("index", index);
}

function changeColour(button){
  //Update the colour of a pin. - first decide the colour:
  var index = button.parentNode.getAttribute("index");
  pins[index].colour += 1;
  if(pins[index].colour >= pinColours.length){
    pins[index].colour = 0;
  }
  button.style.background = pinColours[pins[index].colour];
}

function openCloseWindow(open, windowName){ //open = 0 or 1 - 0 open, 1 close
  var window = document.getElementById(windowName);
  if(open == 1){
    window.style.display = "none";
  }
  else{
    prevZ++;
    window.style.display = "block";
    window.style.top = mouse.y + "px";
    window.style.left = mouse.x + "px";
    window.style.zIndex = prevZ;
  }
}

function findPinInDir(index){
  var directory = document.getElementById("dirWindowBody");
  var list = directory.querySelectorAll('div[index]');
  for (let i = 0; i < list.length; i++) {
    if(list[i].getAttribute("index") == index){
      return list[i];
    }
  }
  return null;
}

function closePin(button){
  var pin;
  var index = 0;
  try{
    pin = button.parentNode;
    index = pin.getAttribute("index");
    pins[index].open = false;
  }
  catch (error){
    pin = button.parentNode.parentNode;
    index = pin.getAttribute("index");
    pins[index].open = false;
  }
  
  if(pins[index].isCharacter){
    //Save character info
    console.log(button.parentNode.parentNode.id);
    pins[index].name = pin.querySelector('input[name="name"]').value;
    pins[index].race = pin.querySelector('input[name="race"]').value;
    pins[index].pronounA = pin.querySelector('input[name="pronounA"]').value;
    pins[index].pronounB = pin.querySelector('input[name="pronounB"]').value;
    pins[index].height = pin.querySelector('input[name="height"]').value;
    pins[index].weight = pin.querySelector('input[name="weight"]').value;
    var scores = pin.querySelectorAll('input[name="scr"]');
    for (let i = 0; i < scores.length; i++) {
      pins[index].scores[i] = scores[i].value;
    }
    pins[index].notes = pin.querySelector('textArea[name="notes"]').value;
    pins[index].ideals = pin.querySelector('textArea[name="ideals"]').value;
    pins[index].bonds = pin.querySelector('textArea[name="bonds"]').value;
    pins[index].flaws = pin.querySelector('textArea[name="flaws"]').value;
    pins[index].traits = pin.querySelector('textArea[name="traits"]').value;
  }
  else{
      pins[index].title = pin.querySelector('input[name="pinTitle"]').value;
      pins[index].content = pin.querySelector('textArea[name="notes"]').value;
  }

  //And update directory:
  var dirButton = findPinInDir(index);
  if(dirButton != null){
    dirButton.parentNode.removeChild(dirButton);
    createPin(index);
    dirButton = findPinInDir(index);
    if(pins[index].isCharacter){
      dirButton.querySelector('button').innerText = "> " + pins[index].name + " <";
    }
    else{
      dirButton.querySelector('button').innerText = pins[index].title;
    }
    dirButton.querySelector('button').style.background = pinColours[pins[index].colour];
  }
  else{createPin(index)};
  pin.parentNode.removeChild(pin);
}

function updateMod(element){
  var modifierElements = element.querySelectorAll('td[name="mod"]');
  var scoreInputs = element.querySelectorAll('input[name="scr"]');
  console.log("----");
  console.log(modifierElements.length);
  console.log(scoreInputs.length);
  for (let i = 0; i < scoreInputs.length; i++) {
    modifierElements[i].textContent = Math.floor((scoreInputs[i].value - 10)/2);
  }
}

function randomiseCharacter(element){
  let name = element.querySelector('input[name="name"]');
  let race = element.querySelector('input[name="race"]');
  let height = element.querySelector('input[name="height"]');
  let weight = element.querySelector('input[name="weight"]');
  let scores = [];
  let scoreElements = element.querySelectorAll('input[name="scr"]');
  race.value = generateRace();
  for (var i = 0; i < 6; i++) {
    scores[i] = generateAbilityScore();
    scoreElements[i].value = scores[i];
  }
  updateMod(element);

  name.value = generateName(race.value);
  height.value = generateHeight(race.value, scores[1]);
  weight.value = generateWeight(race.value, scores[0], scores[2]);


  function generateName(race){
    if (names[race] !== null && names[race]["names"] !== null && names[race]["names"].length > 0) {
      return names[race]["names"][Math.floor((Math.random() * names[race]["names"].length))];
    }
    
    return "Bob";
  }
  
  function generateRace() {
    //Randomly choose a starting race (species) from a selection
    //This will only include races from the standard rules of D&D 5e which are under the open game licence.
    var races = Object.keys(names);
    return races[parseInt(Math.floor((Math.random() * races.length)))];
  }

  function getRange(high, low, mod){
    return Math.floor((Math.random() * (high - (low + Math.floor(mod/2)))) + (low + Math.floor(mod/2)));
  }
  
  function generateHeight(race, dex) {
    var inches = 60;

    if (names[race] !== null && names[race]["height"] !== null && Object.keys(names[race]["height"]).length === 2) {
      inches = getRange(names[race]["height"].max, names[race]["height"].min, dex);
    }
    
    return ((inches - (inches % 12))/12) + "ft " + (inches % 12);
  }
  
  function generateWeight(race, str, con) {
    //Some races will have preset weight ranges
    //Then their stats will increase this by a small degree - higher str and cons will increase this, while dex will decrease
    var weight = 200;

    if (names[race] !== null && names[race]["weight"] !== null && Object.keys(names[race]["weight"]).length == 2) {
      weight = getRange(names[race]["weight"].max, names[race]["weight"].min, Math.floor((str + con)/2));
    }
    
    return weight + " pounds";
  }
  
  function generateAbilityScore() {
    //Based off of how ability scores are typically generated in Dungeons and Dragons
    //This method involves rolling 4 six sided dice and totalling the 3 highest values
    //This creates a somewhat higher distribution that 3d6 would.
    var lowestVal = 6; //no value can be higher than this
    var score = 0;
    var roll = 0;
    for (var i = 0; i < 4; i++) {
      roll = Math.floor((Math.random() * 6) + 1);
      score += roll;
      if (roll < lowestVal) {
        lowestVal = roll;
      }
    }
    score -= lowestVal;
    console.log(score);
    return score;
  }
}