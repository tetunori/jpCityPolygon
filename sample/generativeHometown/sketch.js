// Global variables
let gCanvasSize;

// This sketch consists of 2 layers, top and bottom.
// Bottom layer uses usual canvas and top Layer uses Graphics so we define here.
let gTopLayer;

// draw() works at some interval but if this flag is true, draw() is called forcibly.
let gForceGenerate = false;

// If this flag true, drawing will be generated automatically. Default: true.
let gAutoGenerate = true;

// Font to be loaded
let gFont;

// Target Prefecture and Hometown name.
let gTargetPrefecture = '北海道';
let gTargetHometown = '札幌市中央区';

// Since Noto font does not work in textFont,
// we preload it from otf file here.
function preload() {
  gFont = loadFont('NotoSansJP-Bold.otf');
}

function setup() {
  // canvas(and bottom layer) settings
  gCanvasSize = min(windowWidth, windowHeight);
  const s = gCanvasSize;
  const canvas = createCanvas(s, s);
  const canvas_container = document.getElementById('canvas-container');
  canvas.parent(canvas_container);

  // top layer settings
  gTopLayer = createGraphics(s, s);

  // Other p5.js settings
  frameRate(30); // Fixed rate for using frameCount interval technique.
  textSize(s / 10);
  textFont(gFont);

  // Initialize controllers(UI)
  initializeControllers();

  // Load Hometown script firstly
  loadHometownScript(gTargetPrefecture, gTargetHometown);
}

function draw() {

  // Update Controllers
  updateControllers();

  // --- Skip logic
  // Since Each hometonw script has a cityObj,
  // cityObjs must exist if it is ready. Othewise we skip this turn and wait loading.
  if (
    typeof cityObjs === 'undefined' ||
    typeof cityObjs[gTargetPrefecture + gTargetHometown] === 'undefined'
  )
    return;

  // Force flag, automatic-generation and interval logic
  if (gForceGenerate) {
    // Forcibly generate & draw!
    gForceGenerate = false;
  } else {
    // Skip this turn...
    if (!gAutoGenerate) return;
    if (frameCount % 45 !== 0) return;
  }

  // --- p5.pattern settings
  const ColsURLs = [
    'https://coolors.co/40037d-0041cd-cac600-009b17-e1036b-b96301',
    'https://coolors.co/eb300f-fe7688-fff566-212121-306e42-0d3b66',
    'https://coolors.co/50514f-f25f5c-ffe066-247ba0-70c1b3',
    'https://coolors.co/ff6f59-254441-43aa8b-b2b09b-ef3054',
    'https://coolors.co/540d6e-ee4266-ffd23f-3bceac-0ead69',
  ];

  let colsURL;
  if (parseInt(gRadioColor.value()) === ColsURLs.length + 1) {
    colsURL = gInputCoolorsURL.value();
  } else {
    colsURL = ColsURLs[gRadioColor.value() - 1];
  }
  const COLS = createCols(colsURL);
  if(COLS[0] === '#' || COLS[0] === undefined){
    return;
  }

  let PALETTE;
  PALETTE = shuffle(COLS, true);

  // Decide top layer color, 1st.
  gTopLayer.background(PALETTE[3]);

  // Save other 3 colors in PALATTE.
  PALETTE = PALETTE.slice(0, 3);
  patternColors(shuffle(PALETTE));
  pattern(randPattern(width * 0.08));

  // Draw Bottom layer Background pattern
  drawBackGroundPattern();

  // get target-city object and achieve its several polygon(x,y) data
  const targetHometown = cityObjs[gTargetPrefecture + gTargetHometown];
  const targetPolygons = targetHometown.normalizedPolygons;

  // --- Calcurate coordinates to draw
  // Get N/S/E/W edge values from all of the polygons that is (x,y)s.
  const ends = getEnds(targetPolygons);

  // Shape size on actual coordinate(before scaling)
  const shapeWidth = abs(ends.w - ends.e);
  const shapeHeight = abs(ends.s - ends.n);

  // Calcurate scale and margin.
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

  // --- Top Layer Drawing
  {
    const tl = gTopLayer;
    tl.push();
    tl.translate(-ends.w * shapeScale + horizontalMargin, -ends.n * shapeScale + verticalMargin);
    tl.erase();

    targetPolygons.forEach((polygon) => {
      tl.beginShapePattern();
      for (let i = 0; i < polygon.length; i++) {
        tl.vertexPattern(polygon[i].x * shapeScale, polygon[i].y * shapeScale);
      }
      tl.endShapePattern();
    });

    tl.noErase();
    tl.pop();
  }

  // Paste top layer
  image(gTopLayer, 0, 0);

  // --- Draw hometown name text
  fill(255, 255, 255, 140);
  const margin = 40;
  text(targetHometown.name, margin, gCanvasSize / 11.5 + margin);
}

// Draw background with p5.pattern
const drawBackGroundPattern = () => {
  const rows = 4;
  const columns = rows;
  const unitSize = gCanvasSize / rows;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      pattern(randPattern(width * 0.08));
      squarePattern(i * unitSize, j * unitSize, unitSize);
    }
  }
};

// Get N/S/E/W ends
const getEnds = (polygons) => {
  // Get (x,y) array from vertex array(polygon)
  let xs = [];
  let ys = [];

  polygons.forEach((polygon) => {
    xs = xs.concat(polygon.map((v) => v.x));
    ys = ys.concat(polygon.map((v) => v.y));
  });
  // console.log({ xs, ys });

  // Prepare max/min proc
  const _max = (a, b) => max(a, b);
  const _min = (a, b) => min(a, b);

  // Get N/S/E/W ends values
  const n = ys.reduce(_min, 91);
  const s = ys.reduce(_max, 0);
  const e = xs.reduce(_max, 0);
  const w = xs.reduce(_min, 181);

  const ends = { n, s, e, w };
  // console.log(ends);

  // Return ends object
  return ends;
};

// Load script by using prefecture/hometown name.
const loadHometownScript = (targetPrefecture, targetHometown) => {
  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement('script');
  if (targetHometown === '') {
    script.src = `../../dist/v0.9.0/${targetPrefecture}/${targetPrefecture}.min.js`;
  } else {
    script.src = `../../dist/v0.9.0/${targetPrefecture}/${targetHometown}.min.js`;
  }
  head.appendChild(script);
};

// p5.pattern randam pattern function
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

// Take some Colors from coolors URL
function createCols(url) {
  let slaIndex = url.lastIndexOf('/');
  let colStr = url.slice(slaIndex + 1);
  let colArr = colStr.split('-');
  for (let i = 0; i < colArr.length; i++) colArr[i] = '#' + colArr[i];
  return colArr;
}

// Save generated image
const saveImage = () => {
  const name = gTargetPrefecture + gTargetHometown + '_' + getYYYYMMDD_hhmmss(true) + '.png';
  saveCanvas(name, 'png');
};

// get Timestamp string
const getYYYYMMDD_hhmmss = (isNeedUS) => {
  const now = new Date();
  let retVal = '';

  // YYMMDD
  retVal += now.getFullYear();
  retVal += padZero2Digit(now.getMonth() + 1);
  retVal += padZero2Digit(now.getDate());

  if (isNeedUS) {
    retVal += '_';
  }

  // hhmmss
  retVal += padZero2Digit(now.getHours());
  retVal += padZero2Digit(now.getMinutes());
  retVal += padZero2Digit(now.getSeconds());

  return retVal;
};

// padding function
const padZero2Digit = (num) => {
  return (num < 10 ? '0' : '') + num;
};
