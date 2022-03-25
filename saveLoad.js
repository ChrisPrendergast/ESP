//Make download button interactive
function downloadListener(event) {
  var link = document.createElement("a");
  link.download = "dnd.json";
  link.href = window.URL.createObjectURL(new Blob([JSON.stringify(wrapUpData())], {type: "text/json;charset=utf-8"}));
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//Convert uploaded JSON file to database object
function fileToJSON(event) {
  try {
    unwrapData(JSON.parse(event.target.result));
  }
  catch (error) {
    console.log(error);
    alert("Uploaded file is not a valid world data file.");
  }
}

//Make upload button interactive
function uploadListener(event) {
  if (event.target.files !== null && event.target.files[0] !== null) {
    var reader = new FileReader();
    reader.onload = fileToJSON;
    reader.readAsText(event.target.files[0]);
  }
}

function wrapUpData(){
  var data = {};

  //Expell dead pins
  for (let i = 0; i < pins.length; i++) {
    if(pins[i].dead){
      pins.splice(i, 1);
      i--;
    }
  }
  for (let i = 0; i < pins.length; i++) {
    pins[i].index = i;
  }
  
  data["pins"] = pins;
  data["events"] = events;
  data["labels"] = getDirLabels();
  data["map"] = mapGen.pullMap();
  return data;
}

function unwrapData(data){
  setPins(data["pins"]);
  events = data["events"];
  closeModal();
  setDirLabels(data["labels"]);
  console.log(mapGen.pullMap());
  setSavedMap(data["map"]);
  console.log(mapGen.pullMap());
}


//Retrieve the custom directory labels for saving
function getDirLabels(){
  var cats = document.getElementById("dirWindow").querySelectorAll('input');
  console.log(cats);
  var labels = [];
  for (let index = 0; index < cats.length; index++) {
    labels.push(cats[index].value);
  }
  console.log(labels);
  return labels;
}

//Apply the downloaded labels to the directory
function setDirLabels(labels){
  console.log(labels);
  var cats = document.getElementById("dirWindow").querySelectorAll('input');
  for (let index = 0; index < cats.length; index++) {
    cats[index].value = labels[index];
  }
}

//Add the downloaded pins to the world
function setPins(newPins){
  var directory = document.getElementById("dirWindowBody");
  pins = []; //empty pins

  var buttons = directory.querySelectorAll('button');
  console.log(buttons);
  for (var i = 0; i < buttons.length; i++) {  
    buttons[i].parentNode.removeChild(buttons[i]);
  }
  buttons = null;
  
  for (var i = 0; i < newPins.length; i++) {
    var newPin = newPins[i];
    var pin = new Pin();
    
    Object.keys(newPin).map(key => (pin[key] = newPin[key]));
    pins.push(pin);
    openPin(0,0,i);
    var x = document.body.querySelectorAll('div[class="pin"]');
    closePin(x[x.length-1].querySelector('button[id="charClose"]'));
  }
}

function setSavedMap(newMap){
  //Need to convert saved map into viable format
  var map = mapGen.pullMap();
  for (var i = 0; i < newMap.length; i++) {
    for(var j = 0; j < newMap[0].length; j++){
      var newMapNode = newMap[i][j];
      var node = new MapNode(0, 0);
      Object.keys(newMapNode).map(key => (node[key] = newMapNode[key]));
      map[i][j] = node;
    }
  }
  mapGen.pushMap(map);


  
  var ctx = mapCanvas.getContext("2d", { alpha: false });
  let answer = "";
  
  //ctx.fillRect(0, 0, mapCanvas.width, mapCanvas.height);
  //mapGen = new MapGenerator(1200,[""]);
  let img = document.getElementById("grass");
  let tempDefiner = new MapNode(0,0);
  let pixelList = [[tempDefiner,tempDefiner,tempDefiner],[tempDefiner,tempDefiner,tempDefiner],[tempDefiner,tempDefiner,tempDefiner]];
  let mapFinal = mapGen.pullMap(); //map is pushed prior
  for (let i=0; i<512; i++){
    for (let j=0; j<512; j++){
      for (let m = -1; m < 2; m++){
        for (let n = -1; n < 2; n++){
          if (i+m >= 0 && j+n >= 0 && j+n <= 512 && i+m <= 512){
            pixelList[m+1][n+1] = mapFinal[i+m][j+n];
          } else {
            pixelList[m+1][n+1] = new MapNode(0.004,4); //Defines nodes outside the bound to be water
          }
        }
      }
      answer = mapGen.decide(pixelList);
      img = document.getElementById(answer);
      //console.log(img + " " + answer);
      if (img != null){
        ctx.drawImage(img, i*32, j*32);
      }
    }
  }
}

var download = document.getElementById("SaveButton").addEventListener("click", function(e) { downloadListener(e);}); //Create Upload Button

var upload = document.getElementById("loadHidden").addEventListener("change", function(e) { uploadListener(e);}); //Create Upload Button