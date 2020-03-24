var WIDTH = 78;
var STEPS = 16;
var ROWS = 8;

var patterns = [];
var interface = document.querySelector('#quickbass');
var cursor = {x: 3, y: 4};
var pattern = 0, step = 0, editing = 0;

function reset(){
  patterns = [];
  var newPattern = [];
  for(var r = 0; r < ROWS; r++){
    var newRow = []
    for(var i = 0; i < STEPS; i++){
      newRow.push(Math.floor(Math.random() * 2));
    }
    newPattern.push(newRow);
  }
  patterns.push(newPattern);
}
reset();

function draw(){
  var row = makeRow("QuickBass 5.0");
  row += makeRow("Pattern Queue");
  for(var p = 0; p < ROWS; p++){
    row += "| " + p + " ";
  }
  row += "| loop |<br>";
  row += makeRow("Play");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  for(var r = 0; r < ROWS; r++){
    row += leftAlign("Thirteen", 13);
    for(var i = 0; i < STEPS; i++){
      row += "&#179";
      if (i === step) {
        row += "<span class='selected'>";
      }
      if (patterns[editing][r][i] === 1) {
        row += " &#4 ";
      } else {
        row += "   ";
      }

      if (i === step) {
        row += "</span>";
      }
    }
    row += "&#179<br>";
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";

  row += makeRow("Edit");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  for(var r = 0; r < ROWS; r++){
    row += leftAlign("Kick", 13);
    for(var i = 0; i < STEPS; i++){
      row += "&#179";
      if (i === cursor.x && r === cursor.y) {
        row += "<span class='selected'>";
      }
      if (patterns[editing][r][i] === 1) {
        row += " &#4 ";
      } else {
        row += "   ";
      }
      if (i === cursor.x && r === cursor.y) {
        row += "</span>";
      }
    }
    row += "&#179<br>";
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";
  row += makeRow('')
  row += makeButtons('[C]lear are some buttons'.split(' '));
  interface.innerHTML = row;
}

function makeRow(input, char="&#205"){
  var output = char.repeat(Math.ceil((WIDTH - input.length) / 2));
  output += input;
  output += char.repeat(Math.floor((WIDTH - input.length) / 2));
  output += "<br>"
  return output;
}

function makeButtons(arr){
  var output = "";
  for(name of arr){
    output += "&#218" + "&#196".repeat(name.length + 2) + "&#191";
  }
  output += "<br>";
  for(name of arr){
    output += "&#179" + " " + name + " " + "&#179";
  }
  output += "<br>";
  for(name of arr){
    output += "&#192" + "&#196".repeat(name.length + 2) + "&#217";
  }
  output += "<br>";
  return output;
}

function leftAlign(input, length){
  return input + " ".repeat(length - input.length);
}

function handleKeyboard(e){
  switch(e.key){
    case "ArrowDown":
      if(cursor.y < ROWS - 1){
        cursor.y++;
      }
      break;
    case "ArrowUp":
      if(cursor.y > 0){
        cursor.y--;
      }
      break;
    case "ArrowLeft":
      if(cursor.x > 0){
        cursor.x--;
      }
      break;
    case "ArrowRight":
      if(cursor.x < STEPS - 1){
        cursor.x++;
      }
      break;
    case " ":
      patterns[editing][cursor.y][cursor.x] = Math.abs(patterns[editing][cursor.y][cursor.x] - 1);
      if(cursor.x < STEPS - 1){
        cursor.x++;
      }
      break;
    case "Backspace":
      patterns[editing][cursor.y][cursor.x] = 0;
      if(cursor.x < STEPS - 1){
        cursor.x++;
      }
      break;
    default:
      console.log(e);
      break;
  }
  draw();
}
document.addEventListener('keydown', handleKeyboard);

// draw();

var loop = new Tone.Sequence(function(time, step){
  // piano.triggerAttackRelease(reggie, "16n", time);
  window.step = step;
  draw(step);
}, range(0, 15), "16n").start(0);

// document.querySelector("#start").onclick = function(e){
  Tone.Transport.start();
// };



function range(from, to){
  var output = [];
  for(var i = from; i <= to; i++){
    output.push(i);
  }
  return output;
}