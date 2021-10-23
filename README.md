# Description 🗾

**jpCityPolygon** is a dataset consisting of polygon data of all prefectures/cities in Japan.  
You can draw city-polygon without difficulty!  
<img src="https://tetunori.github.io/jpCityPolygon/images/logo.png" alt="logo" width="640px">  

Now, the latest version is `0.9.0`. (beta release)  

# Simple Usage
## Environment 
This data is supplied as a Javascript Object.

## Import Data
Just pick up a city and insert its script existing in `https://tetunori.github.io/jpCityPolygon/dist/v0.9.0/`.  
There are a lot of `<都道府県名>/<市区町村名>.min.js and .js` files there and you can confirm the files from [here](https://github.com/tetunori/jpCityPolygon/tree/main/dist/v0.9.0).  
(For prefectures, see `<都道府県名>/<都道府県名>.min.js and .js` )

For example, **北海道北広島市** (city) is like this.  
```html 
<script src="https://tetunori.github.io/jpCityPolygon/dist/v0.9.0/北海道/北広島市.min.js"></script>
```

Another example, **北海道** (prefecture) is like this.  
```html 
<script src="https://tetunori.github.io/jpCityPolygon/dist/v0.9.0/北海道/北海道.min.js"></script>
```


## Use Polygon Object
### Object Structure
Each `<都道府県名>/<市区町村名>.js and .min.js` has a single main object `<都道府県名><市区町村名>`, like `北海道北広島市`.  
Also, each `<都道府県名>/<都道府県名>.js and .min.js` has a single main object `<都道府県名>`, like `北海道`.  
This object has the following 5 properties:  
- prefecture: String
  - Prefecture name (都道府県名)
- name: String
  - City name (市区町村名)
- latlons: Array of Polygons
  - Multiple raw polygons data of latitude and longitude formatted as `{'lat':..., 'lon':...}`
- polygons: Array of Polygons
  - Multiple raw polygons data of (x, y) coordinate(Mercator Projection) formatted as `{'x':..., 'y':...}`
- normalizedPolygons: Array of Polygons
  - polygon normalized data of (x, y) coordinate(Mercator Projection) formatted as `{'x':..., 'y':...}`
  - This data is normalized for being suitable for the canvas size 360*360. 
  - I recommend using this data first!

### Use with p5.js
How simple it is!
```javascript
function setup() {
  createCanvas(360, 360);
}

function draw() {
  background(220);

  // This time, use normalized data.
  const polygons = 北海道北広島市.normalizedPolygons;
  // const polygons = 北海道.normalizedPolygons;

  // The main object consists of a several polygons
  polygons.forEach((polygon) => {
    beginShape();
    for (let i = 0; i < polygon.length; i++) {
      vertex(polygon[i].x, polygon[i].y);
    }
    endShape();
  });
}
```

## Samples 
### Basic Sample

<img src="https://tetunori.github.io/jpCityPolygon/images/basic1.png" alt="basic1" width="360px">  

 - [Sample On GitHub](https://tetunori.github.io/jpCityPolygon/sample/basic/)
 - [Sample On OpenProcessing](https://openprocessing.org/sketch/1316557)

### Generative Hometown
<img src="https://tetunori.github.io/jpCityPolygon/images/generativeHometown1.png" alt="generativeHometown1" width="360px">  

 - [Sample On GitHub](https://tetunori.github.io/jpCityPolygon/sample/generativeHometown/)
 - [Sample On OpenProcessing](https://openprocessing.org/sketch/1316562)

# Issue
So far, there is no issues. But I cannot test all of the cities.  
So please let me know if you encount any bugs!

# LICENSE:
Published under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.

# Author
Tetsunori NAKAYAMA.

# Reference
## What motivated me
- ['埼玉県の描き方' presentation](https://docs.google.com/presentation/d/1VgaI-CEZAcnpSP6yLlsxVNamHRQD64apeQsP0_mikEU/edit?usp=sharing) by anozon.

## Data
### City data
- Made from [「国土数値情報（行政区域データ）」（国土交通省）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html)
  - データの基準年月日は平成31（2019）年 1月 1日時点のものです。

### Prefecture data
- Using prefectures.geojson from [dataofjapan/land](https://github.com/dataofjapan/land).

## Generative Hometown Sample
- Canvas/Controller layout
  - ['210923a'](https://openprocessing.org/sketch/1275637) by takawo
- Pattern drawing
  - [p5.pattern](https://github.com/SYM380/p5.pattern) by SYM380
  - [How to use p5.pattern](https://openprocessing.org/sketch/1278485) by SYM380
- CSS
  - https://pulpxstyle.com/css-button/
