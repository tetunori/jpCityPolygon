// Reference :
// https://docs.google.com/presentation/d/1VgaI-CEZAcnpSP6yLlsxVNamHRQD64apeQsP0_mikEU/edit?usp=sharing

// p5 pattern
// https://github.com/SYM380/p5.pattern
// https://openprocessing.org/sketch/1278485

// Data is from https://nlftp.mlit.go.jp/
//「国土数値情報（行政区域データ）」（国土交通省）（https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html）を加工して作成

// LICENSE: CC BY-NC 4.0

let topLayer;
let W;

let gFont;
function preload() {
  gFont = loadFont('NotoSansJP-Bold.otf');
}

let gTargetPrefecture = '北海道'
let gTargetCity = '小樽市'
function setup() {
  // p5.js settings
  W = min(windowWidth, windowHeight);
  createCanvas(W, W);
  topLayer = createGraphics(W, W);
  frameRate(0.5);
  textSize(W / 10);
  textFont(gFont);

  loadScript('../data/'+ gTargetPrefecture + '/' + gTargetCity + '.min.js');
}

function draw() {

  if( (typeof cityObjs === 'undefined') || 
    (typeof cityObjs[gTargetPrefecture + gTargetCity] === 'undefined') ){
      return;
    }
  let targetCity = cityObjs[gTargetPrefecture + gTargetCity];
  const targetPolygons = targetCity.polygons;

  // Get N/S/E/W edge values
  const ends = getEnds(targetPolygons);

  // p5.pattern settings
  let COLS;
  // COLS = createCols("https://coolors.co/eb300f-fe7688-fff566-212121-306e42-0d3b66");
  // COLS = createCols('https://coolors.co/50514f-f25f5c-ffe066-247ba0-70c1b3');
  COLS = createCols('https://coolors.co/ff6f59-254441-43aa8b-b2b09b-ef3054');
  COLS = createCols('https://coolors.co/283d3b-197278-edddd4-c44536-772e25');
  COLS = createCols('https://coolors.co/40037d-0041cd-cac600-009b17-e1036b-b96301');
  // COLS = createCols("https://coolors.co/540d6e-ee4266-ffd23f-3bceac-0ead69");
  let PALETTE;
  PALETTE = shuffle(COLS, true);
  topLayer.background(PALETTE[3]);
  // topLayer.background('#FFF566');
  PALETTE = PALETTE.slice(0, 3);
  const d = width * 0.08;
  pattern(randPattern(d));
  patternColors(shuffle(PALETTE));

  drawBackGroundPattern();

  // Shape size on actual coordinate(before scaling)
  const shapeWidth = abs(ends.w - ends.e);
  const shapeHeight = abs(ends.s - ends.n);

  let shapeScale;
  let horizontalMargin = width * 0.1;
  let verticalMargin = height * 0.1;
  if (shapeWidth > shapeHeight) {
    shapeScale = (width - 2 * horizontalMargin) / shapeWidth;
    verticalMargin = (height - shapeHeight * shapeScale) / 2;
  } else {
    shapeScale = (height - 2 * verticalMargin) / shapeHeight;
    horizontalMargin = (width - shapeWidth * shapeScale) / 2;
  }

  {
    // Top Layer Drawing
    const tl = topLayer;
    tl.push();
    tl.translate(-ends.w * shapeScale + horizontalMargin, ends.s * shapeScale + verticalMargin);
    tl.erase();

    targetPolygons.forEach( polygon => {
      tl.beginShapePattern();
      for (let i = 0; i < polygon.length; i++) {
        tl.vertexPattern(polygon[i].x * shapeScale, -polygon[i].y * shapeScale);
      }
      tl.endShapePattern();
    });

    tl.noErase();
    tl.pop();
  }

  image(topLayer, 0, 0);
  fill(255, 255, 255, 140);
  const margin = 30;
  text(targetCity.name, margin, W / 12 + margin);
}

const drawBackGroundPattern = () => {
  const rows = 4;
  const columns = rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const d = width * 0.08;
      pattern(randPattern(d));
      squarePattern((i * W) / rows, (j * W) / rows, W / rows);
    }
  }
};

// Get Ends
const getEnds = (polygons) => {
  // Get lons/lats array from vertex array(polygon)
  let longitudes = [];
  let latitudes = [];

  polygons.forEach( polygon => {
    longitudes = longitudes.concat( polygon.map((v) => v.x) );
    latitudes = latitudes.concat( polygon.map((v) => v.y) );
  });
  // print({ longitude, latitude });

  // Prepare max/min proc
  const _max = (a, b) => max(a, b);
  const _min = (a, b) => min(a, b);

  // Get N/S/E/W edge values
  const n = latitudes.reduce(_min, 91);
  const s = latitudes.reduce(_max, 0);
  const e = longitudes.reduce(_max, 0);
  const w = longitudes.reduce(_min, 181);

  const ends = { n, s, e, w };
  // print(ends);

  // Return Edge object
  return ends;
};

const loadScript = (src) => {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  script.src = src;
  head.appendChild(script);
}

function randPattern(t) {
  const ptArr = [
    PTN.noise(0.5),
    PTN.noiseGrad(0.4),
    PTN.stripe(t / int(random(6, 12))),
    PTN.stripeCircle(t / int(random(6, 12))),
    PTN.stripePolygon(int(random(3, 7)), int(random(6, 12))),
    PTN.stripeRadial(TAU / int(random(6, 30))),
    PTN.wave(t / int(random(1, 3)), t / int(random(10, 20)), t / 5, t / 10),
    PTN.dot(t / 10, (t / 10) * random(0.2, 1)),
    PTN.checked(t / int(random(5, 20)), t / int(random(5, 20))),
    PTN.cross(t / int(random(10, 20)), t / int(random(20, 40))),
    PTN.triangle(t / int(random(5, 20)), t / int(random(5, 20))),
  ];
  return random(ptArr);
}

function createCols(url) {
  let slaIndex = url.lastIndexOf('/');
  let colStr = url.slice(slaIndex + 1);
  let colArr = colStr.split('-');
  for (let i = 0; i < colArr.length; i++) colArr[i] = '#' + colArr[i];
  return colArr;
}
