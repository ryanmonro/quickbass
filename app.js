var WIDTH = 80;
var STEPS = 16;
var ROWS = 8;
var CONTEXTS = {QUEUE: "queue", PLAY: "play", EDIT: "edit"};

var instruments = ["Kick", "Snare", "Rim", "Clap", "Open Hat", "Closed Hat", "Crash", "Cowbell"].map(function(name){
    return {name: name, mute: false, player: new Tone.Player("sounds/" + name + ".WAV").toMaster()};
});

var quickbass = {
  playing: false,
  context: 2,
  cursor: {
    x: 0,
    y: 0,
    down: function(){
      if(this.y < ROWS - 1){
        this.y++;
      }
    },
    up: function(){
      if(this.y > 0){
        this.y--;
      }
    },
    left: function(){
      this.x += STEPS - 1;
      this.x %= STEPS;
    },
    right: function(){
      this.x += 1;
      this.x %= STEPS;
    }
  },
  togglePlay: function(){
    if (Tone.Transport.state == "started") {
      this.playing = false;
      Tone.Transport.stop();
      this.queue.cursor = 0;
      this.queue.next = this.queue.array;
    } else {
      this.playing = true;
      Tone.Transport.start();
    }
  },
  patterns: [],
  editing: 0,
  queue: {
    array: [0],
    cursor: 0,
    next: [0],
    now: false
  },
  editPattern: function(index){
    if (index < this.patterns.length) {
      this.editing = index;
    }
  },
  playStep: function(step){
    // returns array of indices to play on this step
    var rows = [];
    for(row in this.pattern()){
      if (this.pattern()[row][step] === 1) {
        rows.push(row)
      }
    }
    if (step === STEPS - 1) {
      this.nextPattern();
    }
    return rows;
  },
  editStep: function(){
    this.patterns[this.editing][this.cursor.y][this.cursor.x] = Math.abs(this.patterns[this.editing][this.cursor.y][this.cursor.x] - 1);
    this.cursor.right();
  },
  deleteStep: function(){
    this.patterns[this.editing][this.cursor.y][this.cursor.x] = 0;
    this.cursor.right();
  },
  clearRow: function(){
    this.patternEditing()[this.cursor.y] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  },
  clearPattern: function(){
    this.patterns[this.editing] = this.createPattern();
  },
  duplicate: function(){
    this.patterns.push(JSON.parse(JSON.stringify(this.patternEditing())));
    this.editing = this.patterns.length - 1;
  },
  deletePattern: function(){
    if(this.playing == this.editing){
      this.playing -= 1;
    }
    this.patterns.splice(this.editing, 1);
    this.editing = this.editing - 1;
  },
  startQueue: function(){
    this.context = CONTEXTS.QUEUE;
    this.queue.new = [];
  },
  queueStep: function(index){
    // add to queue if editing queue
    if (index < this.patterns.length) {
      this.queue.new.push(index);
    }
  },
  endQueue: function(){
    if(this.context == CONTEXTS.QUEUE){
      this.context = CONTEXTS.PLAY;
      if(this.queue.new.length > 0) {
        this.queue.next = this.queue.new;
      }
    }
  },
  cancelQueue: function(){
    this.context = CONTEXTS.PLAY;
  },
  queueOne: function(index){
    if (index < this.patterns.length) {
      this.queue.next = [index];
      this.queue.now = true;
    }
  },
  pattern: function(){
    return this.patterns[this.queue.array[this.queue.cursor]];
  },
  patternEditing: function(){
    return this.patterns[this.editing];
  },
  hasPattern: function(pattern){
    return (pattern < this.patterns.length);
  },
  step: function(step){

  },
  newPattern: function(random=false){    
    this.patterns.push(this.createPattern());
    this.editing = this.patterns.length - 1;
  },
  createPattern: function(random=false){
    var pattern = [];
    for(var r = 0; r < ROWS; r++){
      var row = []
      for(var i = 0; i < STEPS; i++){
        row.push(random ? Math.floor(Math.random() * 2) : 0);
      }
      pattern.push(row);
    }
    return pattern;
  },
  nextPattern: function(){
    if (this.queue.now == true) {
      this.queue.cursor = 0;
      this.queue.now = false;
    } else {
      this.queue.cursor = (this.queue.cursor + 1) % this.queue.array.length;
    }
    if (this.queue.cursor == 0) {
      this.queue.array = this.queue.next;
    }
  },
  reset: function(){
    this.patterns = [];
    this.patterns.push(this.createPattern(true));
    this.queue.cursor = 0;
    this.queue.array = [0];
    this.queue.next = [0];
  }
};


// var patterns = [];
var interface = document.querySelector('#quickbass');

quickbass.reset();
draw();

function draw(step){
  var row = makeRow("QuickBass 5.0");
  row += makeRow("Pattern Queue");
  row += "|"
  // TODO: queue cursor highlight
  for(index in quickbass.queue.array){
    var q = quickbass.queue.array[index];
    console.log(quickbass.queue.cursor)
    if (quickbass.playing == true && index == quickbass.queue.cursor) {
      row += "<span class='selected'>";
    }
    row += " " + q + " "; 
    if (quickbass.playing == true && index == quickbass.queue.cursor) {
      row += "</span>";
    }
    row += "|";
  }
  row += "<br>";
  row += makeRow("Play");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  var r = 0;
  for(instrument of instruments){
    row += leftAlign((instrument.mute ? "(M)" :"") + instrument.name, 13);
    for(var i = 0; i < STEPS; i++){
      row += "&#179";
      if (quickbass.playing == true && i === step) {
        row += "<span class='selected'>";
      }
      if (quickbass.pattern()[r][i] === 1) {
        if (instrument.mute == true) {
          row += " O ";
        } else {
          row += " &#4 ";
        }
      } else {
        row += "   ";
      }

      if (quickbass.playing == true && i === step) {
        row += "</span>";
      }
    }
    row += "&#179<br>";
    r++;
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";

  row += makeRow("Edit");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  for(var r = 0; r < ROWS; r++){
    row += leftAlign(instruments[r].name, 13);
    for(var i = 0; i < STEPS; i++){
      row += "&#179";
      if (i === quickbass.cursor.x && r === quickbass.cursor.y) {
        row += "<span class='selected'>";
      }
      if (quickbass.patternEditing()[r][i] === 1) {
        if (instruments[r].mute == true) {
          row += " O ";
        } else {
          row += " &#4 ";
        }
      } else {
        row += "   ";
      }
      if (i === quickbass.cursor.x && r === quickbass.cursor.y) {
        row += "</span>";
      }
    }
    row += "&#179<br>";
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";
  row += makeRow('')
  if (quickbass.context == CONTEXTS.QUEUE) {
    row += "Queue: ";
    if (quickbass.queue.new.length > 0) {
      row += quickbass.queue.new.reduce(function(s,q){return s + "," + q.toString()});
    }
  } else {
    var buttons = '[n]ew,[c]lear row,[e]dit,[d]uplicate,[q]ueue patterns';
    if (Tone.Transport.state == 'stopped') {
      buttons = "[p]lay," + buttons;
    }
    row += makeButtons(buttons.split(','));
  }
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

//
// Input handling
//
function handleKeyboard(e){
  switch(e.key){
    case "0": case "1": case "2": case "3": case "4": case "5":
    case "6": case "7": case "8": case "9":
      var choice = parseInt(e.key);
      if(quickbass.context == CONTEXTS.QUEUE){
        quickbass.queueStep(choice);
      } else {
        quickbass.editPattern(choice);
      } 
      break;
    case "!": case "@": case "#": case "$": case "%": case "^": 
    case "&": case "*": case "(": case ")":
      // shift + number: change patterns now
      var choice = [")", "!", "@", "#", "$", "%", "^", "&", "*",
       "("].indexOf(e.key);
      quickbass.queueOne(choice);
      break;
    case "Enter":
      quickbass.endQueue();
      break;
    case "Escape":
      quickbass.cancelQueue();
      break;
    case "ArrowDown":
      quickbass.cursor.down();
      break;
    case "ArrowUp":
      quickbass.cursor.up();
      break;
    case "ArrowLeft":
      quickbass.cursor.left();
      break;
    case "ArrowRight":
      quickbass.cursor.right();
      break;
    case " ":
      quickbass.editStep();
      break;
    case "c":
      quickbass.clearRow();
      break;
    case "C":
      quickbass.clearPattern();
      break;
    case "m":
      instruments[quickbass.cursor.y].mute = !instruments[quickbass.cursor.y].mute;
      break;
    case "n":
      quickbass.newPattern();
      break;
    case "d":
      quickbass.duplicate();
      break;
    case "D":
      quickbass.deletePattern();
      break;
    case "p":
      quickbass.togglePlay();
      break;
    case "q":
      quickbass.startQueue();
      break;  
    case "Backspace":
      quickbass.deleteStep();
      break;
    default:
      console.log(e);
      break;
  }
  draw();
}
document.addEventListener('keydown', handleKeyboard);

//
// Playback loop
//
var loop = new Tone.Sequence(function(time, step){
  var rowsToPlay = quickbass.playStep(step);
  for(row of rowsToPlay){
    if (instruments[row].mute == false) {
      instruments[row].player.start(time);
    }
  }
  Tone.Draw.schedule(function(){
    draw(step);
  }, time);
}, range(0, 15), "16n").start(0);

//
// Utility function(s)
//
function range(from, to){
  var output = [];
  for(var i = from; i <= to; i++){
    output.push(i);
  }
  return output;
}