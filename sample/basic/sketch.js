function setup() {
  createCanvas(360, 360);
}

function draw() {
  background(220);

  const polygons = 北海道北広島市.normalizedPolygons;

  polygons.forEach((polygon) => {
    beginShape();
    for (let i = 0; i < polygon.length; i++) {
      vertex(polygon[i].x, polygon[i].y);
    }
    endShape();
  });
}
