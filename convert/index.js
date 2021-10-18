
async function loadData(fileData) {
  console.log('Now, loading the data...');

  const data = await fetch(fileData);
  // const data = await fetch( 'test.geojson' ); // case loading from localfile

  const objData = await data.json();
  // console.log(objData.features);

  // Prepare prefecture name for creating folder etc...
  const prefectureName = getPrefectureName(objData.features);
  console.log('Done! Start analyzing the data of ' + prefectureName + '.');

  // Cherry pick the data we need
  const cherryPickedData = objData.features.map((v) => {
    let name = '';

    if (v.properties.N03_004.slice(-1) === '区') {
      // For '区', add city name like '札幌市北区'
      name += v.properties.N03_003;
    }

    name += v.properties.N03_004;

    return {
      prefecture: prefectureName,
      name: name,
      latlons: [v.geometry.coordinates[0]],
    };
  });
  // console.log(cherryPickedData);

  // This is the result including name, lat, lon, x, y.
  let unifiedData = [];

  // unify polygons into an array
  cherryPickedData.forEach((v) => {
    let found = false;

    unifiedData.forEach((e) => {
      if (v.name === e.name) {
        // Found! the name is already registerd. So unify it.
        found = true;
        e.latlons.push(v.latlons[0]);
      }
    });

    if (!found) {
      // New city
      unifiedData.push(v);
    }
  });
  // console.log(unifiedData);

  unifiedData = addXYCoodinatesArray(unifiedData);
  unifiedData = convertLatLonArrayToObj(unifiedData);

  // console.log( JSON.stringify(unifiedData) );
  console.log( unifiedData );

  for (let i = 0; i < unifiedData.length; i++) {
    // For safely donwloading files, we have enough time to create it.
    setTimeout(() => {
      const v = unifiedData[i];
      const longname = v.prefecture + v.name;
      const prefix = 'const ' + longname + ' = ';
      const suffix = ';\n if(typeof cityObjs === \'undefined\'){cityObjs = {};} cityObjs[\'' + longname + '\'] = ' + longname + ';';
      const normalize = `
{
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
    const _max = (a, b) => Math.max(a, b);
    const _min = (a, b) => Math.min(a, b);

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

  // Get N/S/E/W edge values from all of the polygons that is (x,y)s.
  const ends = getEnds(` + longname + `['polygons']);

  // Shape size on actual coordinate(before scaling)
  const shapeWidth = Math.abs(ends.w - ends.e);
  const shapeHeight = Math.abs(ends.s - ends.n);

  const SquareSize = 360;

  // Calcurate scale and margin.
  let shapeScale;
  let horizontalMargin = SquareSize * 0.1;
  let verticalMargin = SquareSize * 0.1;
  if (shapeWidth > shapeHeight) {
    shapeScale = (SquareSize - 2 * horizontalMargin) / shapeWidth;
    verticalMargin = (SquareSize - shapeHeight * shapeScale) / 2;
  } else {
    shapeScale = (SquareSize - 2 * verticalMargin) / shapeHeight;
    horizontalMargin = (SquareSize - shapeWidth * shapeScale) / 2;
  }

  const normalizedPolygons = ` + longname + `['polygons'].map( (polygon) => {
    return polygon.map( coordinates => {
        return {x: coordinates.x * shapeScale - ends.w * shapeScale + horizontalMargin, 
                y: -coordinates.y * shapeScale + ends.s * shapeScale + verticalMargin};
      });
  });

  ` + longname + `['normalizedPolygons'] = normalizedPolygons;
}
      `
      outputScript(v.name + '.min.txt', prefix + JSON.stringify(v) + suffix + normalize );
      outputScript(v.name + '.txt', prefix + JSON.stringify(v, null, '  ') + suffix + normalize);
    }, i * 1000);
  }
}

const outputScript = (name, text) => {
  // create .txt file since .js files will be stopped for security reason.
  let blob = new Blob([text],{type:"text/plain"});
  let a = document.createElement('a');
  const url = URL.createObjectURL(blob)
  a.href = url;
  a.download = name;
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const getPrefectureName = (data) => {
  return data[0].properties.N03_001;
};

const addXYCoodinatesArray = (data) => {
  // add simply polygons(including (x, y) coordinates) element
  const result = data.map((v) => ({
    prefecture: v.prefecture,
    name: v.name,
    latlons: v.latlons,
    polygons: [],
  }));

  // input in polygons in detail
  result.forEach((v) => {
    // For each v: city

    v.latlons.forEach((l) => {
      // For each l: each polygon

      // Then, k: each (lat, lon) coordinates
      // calucurate as Mercator projection
      const radians = (deg) => deg * (Math.PI / 180);
      const polygon = l.map((k) => ({
        x: radians(k[0]),
        y: Math.log(Math.tan(Math.PI / 4 + radians(k[1]) / 2)),
      }));
      // console.log(polygon);

      v.polygons.push(polygon);
    });
  });

  return result;
};

const convertLatLonArrayToObj = (data) => {
  // add simply polygons(including (x, y) coordinates) element
  const result = data.map((v) => {
    // For each v: city

    let latlons = [];
    v.latlons.forEach((l) => {
      // For each l: each polygon

      // Then, k: each (lat, lon) coordinates
      const latlon = l.map((k) => ({
        lon: k[0],
        lat: k[1],
      }));
      // console.log(latlon);

      latlons.push(latlon);
    });

    return {
      prefecture: v.prefecture,
      name: v.name,
      latlons: latlons,
      polygons: v.polygons,
    };
  });

  return result;
};

// Drag & Drop procedure
const fileZone = document.querySelector('.fileZone');
// console.log(fileZone);

fileZone.addEventListener('dragover', (e) => {
  e.preventDefault();
});

fileZone.addEventListener('drop', (e) => {
  e.preventDefault();

  files = e.dataTransfer.files;
  // console.log(files);

  const fileReader = new FileReader();
  fileReader.onload = (e) => { 
    // console.log('Finish reading file');
    loadData(e.target.result);
  };

  // Support only one(1st) file.
  // console.log('Start reading file: ' + files[0].name);
  fileReader.readAsDataURL(files[0]);
});

