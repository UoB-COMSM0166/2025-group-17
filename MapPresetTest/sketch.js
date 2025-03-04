let mapData;
let obstacles, enemies;

function preload() {
    //Load the JSON exported from Tiled
    mapData = loadJSON('./room1.tmj');
}

function setup() {
    createCanvas(800, 800);

    //creat groups for better management
    obstacles = new Group();
    enemies = new Group();

    //load obstacles from the map's object layer
    let objectsLayer = mapData.layers.find(layer => layer.name === "Obstacles");

    if (objectsLayer) {
        objectsLayer.objects.forEach(obj => {
            let centerX = obj.x + obj.width / 2;
            let centerY = obj.y + obj.height / 2;

            if (obj.class === "Obstacle") {
                let obs = createSprite(centerX, centerY, obj.width, obj.height);
                obs.shapeColor = color(150);
                obstacles.add(obs);
            } else if (obj.class === "enemy") {
                let enemy = createSprite(centerX, centerY, obj.width, obj.height);
                enemy.shapeColor = color(0, 255, 0);
                enemies.add(enemy);
            }
        });
    } else {
        console.error("No object layer found in the map data");
    }
}

function draw() {
    background(50);
    drawSprites();
}