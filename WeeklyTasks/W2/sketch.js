var brushSize = 20;

function setup() {
  createCanvas(800, 500);
  // Create a 'save' button
  button = createButton('save'); 
  button.position(350, 510);
  button.mousePressed(saveDrawing);
  
  background(220);
}

function mouseClicked() {
  noStroke();
  if (mouseButton === RIGHT) {
    fill(220); // Erase with background colour
    ellipse(mouseX, mouseY, 30, 30);
  }
  if (mouseButton === LEFT) {
    fill(255, 255, 0); // Fill with yellow
    ellipse(mouseX, mouseY, brushSize, brushSize);
  }
}

function keyPressed() {
  if (key === '1') {
    console.log('Image saved!');
    save('myDrawing.png'); // Save image 
  }
  if (key === "l") {
    brushSize = 40; // Larger brush size
  }
  if (key === "m") {
    brushSize = 20; // Default brush size
  }
  if (key === "s") {
    brushSize = 10; // Smaller brush size
  }
}

function saveDrawing() {
  console.log('Image saved by clicking!');
  save('myDrawing.png');
}

function draw() {
  if (mouseIsPressed) {
    mouseClicked();
  }
}
