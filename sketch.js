let index = 1;
let scl = 1;
let textToBeShown;
let theta;
let alphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
let specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
let stopValue;

function setup() {
  let cnv = createCanvas((w = 300), w);
  cnv.position(200, 0);
  settings = QuickSettings.create(0, 0, "Settings");
  settings.setWidth(200);

  settings.addText("Text", "IITGN");

  settings.addDropDown("Strings", [1500, 1250, 1000, 750, 500], restart);

  settings.addButton("Run", restart);
  settings.overrideStyle("Run", "width", "180px");

  settings.addButton("Export", exportCoordinates);
  settings.overrideStyle("Export", "width", "180px");
  settings.overrideStyle("Export", "background-color", "#000000");
  settings.overrideStyle("Export", "color", "white");
  settings.hideControl("Export");

  settings.addProgressBar("Processing...", 100, index / 15, index / 15);
  settings.overrideStyle("Processing...", "fill-color", "#000000");

  theta = TWO_PI / 150;
  frameRate(500);
  stroke(0);
  strokeWeight(0.15);

  outputText = str(settings.getValue("Text"));
  outputText = outputText.toUpperCase();
}

function draw() {
  stopValue = settings.getValue("Strings");
  for (let i = 0; i < outputText.length; i++) {
    settings.setValue("Processing...", index / (stopValue.value / 100));
    makeStringArt(w / 2 + i * w, outputText[i], index);
  }
  if (index >= stopValue.value) {
    settings.showControl("Export");
    settings.hideControl("Processing...");
    noLoop();
  }
  index++;
}

function makeStringArt(xpos, letter, index) {
  if (index == 1) {
    resizeCanvas(w * outputText.length * scl, w * scl);
    background(255);
    outputText = str(settings.getValue("Text"));
    outputText = outputText.toUpperCase();
  }

  if (checkForSpecialChar(outputText)) {
    alert("Please enter alphabets and numbers only");
    settings.setValue("Text", "IITGN");
  }

  let from = eval("c" + letter)[index - 1];
  let to = eval("c" + letter)[index];

  push();
  translate(xpos * scl, (w * scl) / 2);
  let r = (w * scl) / 2;
  let c1x = r * cos(-PI / 2 + theta * from);
  let c1y = r * sin(-PI / 2 + theta * from);
  let c2x = r * cos(-PI / 2 + theta * to);
  let c2y = r * sin(-PI / 2 + theta * to);
  line(c1x, c1y, c2x, c2y);
  pop();
}

function exportCoordinates() {
  outputText = str(settings.getValue("Text"));
  outputText = outputText.toUpperCase();
  for (let i = 0; i < outputText.length; i++) {
    currentChar = outputText[i];
    console.log("csv" + currentChar)
    exportToCsv(currentChar+'.csv', eval("c" + currentChar));
  }
  saveCanvas(str(settings.getValue("Text"), "png"));
}

function keyPressed() {
  if (keyCode === ENTER) {
    restart();
  }
}

function restart() {
  index = 1;
  settings.hideControl("Export");
  settings.showControl("Processing...");
  loop();
}

function checkForSpecialChar(string) {
  for (i = 0; i < specialChars.length; i++) {
    if (string.indexOf(specialChars[i]) > -1) {
      return true;
    }
  }
  return false;
}

function exportToCsv(filename, rows) {
  var processRow = function (row) {
    var finalVal = "";
    for (var j = 0; j < row.length; j++) {
      var innerValue = row[j] === null ? "" : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      }
      var result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
      if (j > 0) finalVal += ",";
      finalVal += result;
    }
    return finalVal + "\n";
  };

  var csvFile = "";
  for (var i = 0; i < settings.getValue("Strings").value; i++) {
    csvFile += processRow(rows[i]);
  }

  var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement("a");
    if (link.download !== undefined) {
      // feature detection
      // Browsers that support HTML5 download attribute
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
