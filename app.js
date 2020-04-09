var VERSION = "1.0"
var WIDTH = 80;
var STEPS = 16;
var ROWS = 8;
var CONTEXTS = {QUEUE: "queue", PLAY: "play", EDIT: "edit"};

var instruments = ["Kick", "Snare", "Rim", "Clap", "Open Hat", "Closed Hat", "Crash", "Cowbell"].map(function(name){
    return {name: name, mute: false, player: new Tone.Player("sounds/" + name + ".WAV").toMaster()};
});

var shiftKey = false;

class Pattern {
  constructor(random=false){
    this.array = [];
    for(var r = 0; r < ROWS; r++){
      var row = [];
      for(var s = 0; s < STEPS; s++){
        row.push(random ? Math.floor(Math.random() * 2) : 0);
      }
      this.array.push(row);
    }
  }
  getStep(row, index){
    if (row < this.array.length && index < this.array[row].length) {
      return this.array[row][index];
    };
  }
  toggleStep(row, index){
    if (row < this.array.length && index < this.array[row].length) {
      this.array[row][index] = Math.abs(this.array[row][index] - 1);
    }
  };
  deleteStep(row, index){
    if (row < this.array.length && index < this.array[row].length) {
      this.array[row][index] = 0;
    }
  };
  clear(){
    for(var r = 0; r < ROWS; r++){
      this.array[r].fill(0);
    }
  };
  clearRow(row){
    if (row < this.array.length){
      this.array[row].fill(0);
    }
  };
  duplicate(){
    var output = new Pattern();
    for(var r = 0; r < ROWS; r++){
      for(var s = 0; s < STEPS; s++){
        output.array[r][s] = this.array[r][s];
      }
    }
    return output;
  }
}

var cursor = {
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
};

var quickbass = {
  isPlaying: false,
  context: 2,
  togglePlay: function(){
    if (Tone.Transport.state == "started") {
      this.isPlaying = false;
      Tone.Transport.stop();
      this.queue.cursor = 0;
      this.queue.next = this.queue.array;
    } else {
      this.isPlaying = true;
      Tone.Transport.start();
    }
  },
  patterns: [],
  editing: 0,
  getPlaying: function(){
    return this.queue.array[this.queue.cursor]
  },
  queue: {
    array: [0],
    cursor: 0,
    next: [0],
    changeNow: false,
    willChange: function(){
      return JSON.stringify(this.next) != JSON.stringify(this.array);
    }
  },
  setEditingPattern: function(index){
    if (index < this.patterns.length) {
      this.editing = index;
    }
  },
  editPatternIsQueued: function(index){
    return this.queue.array.includes(this.editing)
  },
  playStep: function(step){
    // returns array of row indices to play on this step
    var rows = [];
    for(var row = 0; row < ROWS; row++){
      if (this.pattern().getStep(row, step) === 1) {
        rows.push(row)
      }
    }
    if (step === STEPS - 1) {
      this.nextPattern();
    }
    return rows;
  },
  duplicatePattern: function(){
    this.patterns.push(this.patternEditing().duplicate());
    this.editing = this.patterns.length - 1;
  },
  deletePattern: function(){
    // TODO: this needs to play nice with the queue and the array of patterns
    if(this.editing == this.patterns.length - 1){
      this.patterns.splice(this.editing, 1);
      this.editing = this.editing - 1;
    }
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
        if (this.isPlaying == false) {
          this.queue.array = this.queue.next;
        }
      }
    }
  },
  cancelQueue: function(){
    this.context = CONTEXTS.PLAY;
  },
  queueOne: function(index){
    if (index < this.patterns.length) {
      this.queue.next = [index];
      this.queue.changeNow = true;
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
  newPattern: function(random=false){    
    this.patterns.push(new Pattern());
    this.editing = this.patterns.length - 1;
  },
  nextPattern: function(){
    if (this.queue.changeNow == true) {
      this.queue.cursor = 0;
      this.queue.changeNow = false;
    } else {
      this.queue.cursor = (this.queue.cursor + 1) % this.queue.array.length;
    }
    if (this.queue.cursor == 0) {
      this.queue.array = this.queue.next;
    }
  },
  reset: function(){
    this.patterns = [];
    this.patterns.push(new Pattern(true));
    this.queue.cursor = 0;
    this.queue.array = [0];
    this.queue.next = [0];
  }
};

var interface = document.querySelector('#quickbass');

quickbass.reset();
draw();

function draw(step){
  var row = makeRow("QuickBass " + VERSION);
  row += makeRow("Pattern Queue");
  row += "|"
  for(index in quickbass.queue.array){
    var q = quickbass.queue.array[index];
    if (quickbass.isPlaying == true && index == quickbass.queue.cursor) {
      row += "<span class='selected'>";
    }
    row += " " + (q + 1) + " "; 
    if (quickbass.isPlaying == true && index == quickbass.queue.cursor) {
      row += "</span>";
    }
    row += "|";
  }
  if (quickbass.queue.willChange()) {
    row += " next queue: |";
    for(index in quickbass.queue.next){
    var q = quickbass.queue.next[index];
    row += " " + (q + 1) + " "; 
    row += "|";
  }
  }
  row += "<br>";
  row += makeRow("Play " + "(Pattern " + (quickbass.getPlaying() + 1) + " of " + quickbass.patterns.length + ")");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  var r = 0;
  for(instrument of instruments){
    row += leftAlign((instrument.mute ? "(M)" :"") + instrument.name, 13);
    for(var i = 0; i < STEPS; i++){
      row += "&#179";
      if (quickbass.isPlaying == true && i === step) {
        row += "<span class='selected'>";
      }
      if (quickbass.pattern().getStep(r, i) === 1) {
        if (instrument.mute == true) {
          row += " - ";
        } else {
          row += " &#4 ";
        }
      } else {
        row += "   ";
      }

      if (quickbass.isPlaying == true && i === step) {
        row += "</span>";
      }
    }
    row += "&#179<br>";
    r++;
  }
  row += " ".repeat(13) + "&#192" + "&#196&#196&#196&#193".repeat(15) + "&#196&#196&#196&#217" + "<br>";

  row += makeRow("Edit " + "(Pattern " + (quickbass.editing + 1) + " of " + quickbass.patterns.length + ")");
  row += " ".repeat(13) + "&#218" + "&#196&#196&#196&#194".repeat(15) + "&#196&#196&#196&#191" + "<br>";
  for(var r = 0; r < ROWS; r++){
    row += leftAlign(instruments[r].name, 13);
    for(var i = 0; i < STEPS; i++){
      row += "&#179";
      if (i === cursor.x && r === cursor.y) {
        row += "<span class='selected'>";
      }
      if (quickbass.patternEditing().getStep(r, i) === 1) {
        if (instruments[r].mute == true) {
          row += " - ";
        } else {
          row += " &#4 ";
        }
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
  if (quickbass.context == CONTEXTS.QUEUE) {
    row += "Queue: ";
    if (quickbass.queue.new.length > 0) {
      for (q of quickbass.queue.new){
        row += (q + 1).toString() + " ";
      }
    }
  } else {
    var buttons = '[n]ew,[c]lear row,[e]dit,[d]uplicate,[q]ueue patterns';
    if (Tone.Transport.state == 'stopped') {
      buttons = "[p]lay," + buttons;
    } else {
      buttons = "sto[p]," + buttons;
    }
    if (shiftKey == true) {
      buttons = '[C]lear pattern,un[M]ute'
      if (!quickbass.editPatternIsQueued()) {
        buttons += ',[D]elete pattern'
      }
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
    case "1": case "2": case "3": case "4": case "5":
    case "6": case "7": case "8": case "9":
      var choice = parseInt(e.key) - 1;
      if(quickbass.context == CONTEXTS.QUEUE){
        quickbass.queueStep(choice);
      } else {
        quickbass.setEditingPattern(choice);
      } 
      break;
    case "!": case "@": case "#": case "$": case "%": case "^": 
    case "&": case "*": case "(": 
      // shift + number: change patterns now
      var choice = ["!", "@", "#", "$", "%", "^", "&", "*",
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
      cursor.down();
      break;
    case "ArrowUp":
      cursor.up();
      break;
    case "ArrowLeft":
      cursor.left();
      break;
    case "ArrowRight":
      cursor.right();
      break;
    case " ":
      quickbass.patternEditing().toggleStep(cursor.y, cursor.x);
      cursor.right();
      break;
    case "c":
      quickbass.patternEditing().clearRow(cursor.y);
      break;
    case "C":
      quickbass.patternEditing().clear();
      break;
    case "m":
      instruments[cursor.y].mute = !instruments[cursor.y].mute;
      break;
    case "M":
      for(instrument of instruments){
        instrument.mute = false;
      }
      break;
    case "n":
      quickbass.newPattern();
      break;
    case "d":
      quickbass.duplicatePattern();
      break;
    case "D":
      if (!quickbass.editPatternIsQueued()) {
        quickbass.deletePattern();
      }
      break;
    case "p":
      quickbass.togglePlay();
      break;
    case "q":
      quickbass.startQueue();
      break;  
    case "Shift":
      shiftKey = true;
      break;
    case "Backspace":
      quickbass.pattern().deleteStep(cursor.y, cursor.x);
      cursor.right();
      break;
    default:
      // console.log(e);
      break;
  }
  draw();
}

function keyUp(e){
  // we only need to know if SHIFT is released
  if (e.key == "Shift") {
    shiftKey = false;
    if (quickbass.isPlaying == false) {
      draw()
    }
  }
}

document.addEventListener('keydown', handleKeyboard);
document.addEventListener('keyup', keyUp);

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