var canvasPixelColor = require("canvas-pixel-color");

var spaces = "&nbsp;&nbsp;&nbsp;";
var dropbox, dummy, cvs, ctx, listener;

function canvasInit() {
  cvs = document.getElementById("canvas");
  ctx = cvs.getContext("2d");
  listener = false;
}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
  document.getElementById("intro").className = document.getElementById("intro").className.replace(/(?:^|\s)introMsg(?!\S)/g, 'uploadMsg');
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragleave(e) {
  e.stopPropagation();
  e.preventDefault();
  document.getElementById("intro").className = document.getElementById("intro").className.replace(/(?:^|\s)uploadMsg(?!\S)/g, 'introMsg');
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  document.getElementById("intro").style.display = "none";
  document.getElementById("reply").innerHTML = "";
  dropFile(files);
}

function paste(e) {
  console.log("paste!");
  e.stopPropagation();
  e.preventDefault();

  var cd = e.clipboardData;

  document.getElementById("intro").style.display = "none";
  document.getElementById("reply").innerHTML = "";
  pasteFile(cd);
}

function dropFile(files) {
  var imageType = /^image\//;
  
  if (!imageType.test(files[0].type))
    invalidMsg();
  else
    createImage(files[0]);
}

function pasteFile(files) {
  var imageType = /^image\//;
  var textType = /^text\//;

  if (textType.test(files.types))
    invalidMsg();
  else if (!imageType.test(files.items[0].getAsFile().type))
    invalidMsg();
  else
    createImage(files.items[0].getAsFile());
}

function createImage(image) {
  var img = document.createElement("img");
  window.URL = window.URL || window.webkitURL;
  img.src = window.URL.createObjectURL(image);
  img.onload = function() {        
    //resizing large images
    if (img.width > 800) {
      img.height = Math.round(800 / img.width * img.height);
      img.width = 800;
    }
    else if (img.height > 800) {
      img.width = Math.round(800 / img.height * img.width);
      img.height = 800;
    }

    //drawing the image on canvas
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    listener = true;
    window.URL.revokeObjectURL(this.src);
  }
}

function invalidMsg() {
  canvas.width, canvas.height = 0;
  document.getElementById("reply").innerHTML = "<span class=\"hex\">This is not a valid image file.</span>";
}

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("paste", paste, false);
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("dragleave", dragleave, false);
dropbox.addEventListener("drop", drop, false);


canvasInit();
cvs.addEventListener("click", function(ev) {
  if (listener == true) {
    var hex = canvasPixelColor(ev, ctx)["hex"].toUpperCase();
    var rgba = canvasPixelColor(ev, ctx)["rgba"];    
    if (rgba[3] == 0) {
      document.body.style.background = "#FAFAFA";
      document.getElementById("reply").innerHTML = "<span class=\"hex\">It is transparent.</span><br/>R: " + rgba[0] + spaces + "B: " + rgba[1] + spaces + "G: " + rgba[2] + spaces + "A: " + rgba[3];
    }
    else {
      if (rgba[0] > 245 && rgba[1] > 245 && rgba[2] > 245)
        document.body.style.background = "#C8C8C8";
      else 
        document.body.style.background = "#FAFAFA";
      document.getElementById("reply").innerHTML = "<span class=\"hex\">It is <span style=\"color:" + hex + "\">" + hex + "</span></span>.<br/>R: " + rgba[0] + spaces + "B: " + rgba[1] + spaces + "G: " + rgba[2] + spaces + "A: " + rgba[3]; 
    }
  }
}, false)