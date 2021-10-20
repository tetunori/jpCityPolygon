# Description 🗾

**jpCityPolygon** is a dataset consists of polygon data of all Japanese cities.  
You can draw city-polygon without difficulty like this!  
 /// movie

Please see the examples.
A🌟
B

Now, the version is `0.8.0`. (beta release)  

# Simple Usage
## Environment 
This data is supplied as a Javascript Object.

## Import library
Just pick up a city and insert its script in `https://tetunori.github.io/jpCityPolygon/dist/v0.8.0/dist/`.  
There are a lot of `<都道府県名>/<市区町村名>.min.js and .js` files in the URL.  

For example, 北海道北広島市 is like this.  
```html 
<script src="https://tetunori.github.io/jpCityPolygon/dist/v0.8.0/dist/北海道/北広島市.min.js"></script>
```

## Use Polygon Object
### Object Structure
Each `<都道府県名>/<市区町村名>.min.js and .js` has one main object `<都道府県名><市区町村名>`, like `'北海道北広島市'`.  
This object consists of the following 5 properties:  
- prefecture
  - Prefecture name (都道府県名)
- name
  - City name (市区町村名)
- latlons
  - Multiple raw polygons data of latitude and longitude formatted as `{'lat':..., 'lon':...}`
- polygons
  - Multiple raw polygons data of (x, y) coordinate(Mercator Projection) formatted as `{'x':..., 'y':...}`
- normalizedPolygons
  - polygon normalized data of (x, y) coordinate(Mercator Projection) formatted as `{'x':..., 'y':...}`
  - This data is normalized for being suitable for the canvas size 360*360. 
  - I recommend using this data first!

### example with p5.js
How simple it is!
```javascript
function setup() {
  createCanvas(360, 360);
}

function draw() {
  background(220);

  // This time, use normalized data.
  const polygons = 北海道北広島市.normalizedPolygons;

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
 - [Basic Sample On GitHub](https://tetunori.github.io/p5MovRec/sample/basic/)
 - [Basic Sample On P5 Web Editor](https://editor.p5js.org/tetunori/sketches/cWvkz1E2_)  
 - [Basic Sample On OpenProcessing](https://openprocessing.org/sketch/1212512)
 - [Basic Sample On GitHub](https://tetunori.github.io/p5MovRec/sample/basic/)
 - [Basic Sample On P5 Web Editor](https://editor.p5js.org/tetunori/sketches/cWvkz1E2_)  
 - [Basic Sample On OpenProcessing](https://openprocessing.org/sketch/1212512)

# Issue
So far, there is no issues. But I cannot test all of the cities.  
So please let me know if you encount any bugs!

# LICENSE:
Published under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) license.

# Author
Tetsunori NAKAYAMA.

# Reference
## What motivated me
['埼玉県の描き方' presentation](https://docs.google.com/presentation/d/1VgaI-CEZAcnpSP6yLlsxVNamHRQD64apeQsP0_mikEU/edit?usp=sharing) by anozon.

## Data
- Made from [「国土数値情報（行政区域データ）」（国土交通省）](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html)

## Sample
- Canvas/Controller layout
  - ['210923a'](https://openprocessing.org/sketch/1275637) by takawo
- Pattern drawing
  - [p5.pattern](https://github.com/SYM380/p5.pattern) by SYM380
  - [How to use p5.pattern](https://openprocessing.org/sketch/1278485) by SYM380
- CSS
  - https://pulpxstyle.com/css-button/
