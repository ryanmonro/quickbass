var WIDTH = 78;

// var patterns = [];
var interface = document.querySelector('#quickbass');
var x = 3, y = 4;
var pattern = 0, step = 0;

// function reset(){
//   patterns = [];
//   patterns.push([]);
// }

function draw(){
  var row = makeRow("QuickBass 5.0");
  row += makeRow("Pattern Queue");
  for(var p = 0; p < 8; p++){
    row += "| " + p + " ";
  }
  row += "| loop |<br>";
  row += makeRow("Play");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  for(var r = 0; r < 8; r++){
    row += leftAlign("Thirteen", 13);
    for(var i = 0; i < 16; i++){
      row += "&#179";
      if (i === step) {
        row += "<span class='selected'>";
      }
      row += " &#3 ";
      if (i === step) {
        row += "</span>";
      }
    }
    row += "|<br>";
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";

  row += makeRow("Edit");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  for(var r = 0; r < 8; r++){
    row += leftAlign("Kick", 13);
    for(var i = 0; i < 16; i++){
      row += "&#179";
      if (i === x && r === y) {
        row += "<span class='selected'>";
      }
      row += "---";
      if (i === x && r === y) {
        row += "</span>";
      }
    }
    row += "&#179<br>";
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";
  row += makeRow('')
  row += makeButtons('These are some buttons'.split(' '));
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
      y++;
      break;
    case "ArrowUp":
      y--;
      break;
    case "ArrowLeft":
      x--;
      break;
    case "ArrowRight":
      x++;
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