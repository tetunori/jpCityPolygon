# Description πΎ

**jpCityPolygon** is a dataset consisting of polygon data of all prefectures/cities in Japan.  
You can draw city-polygon without difficulty!  
<img src="https://tetunori.github.io/jpCityPolygon/images/logo.png" alt="logo" width="640px">  

Now, the latest version is `1.0.0`.  

# Simple Usage
## Environment 
This data is supplied as a Javascript Object.

## Import Data
Just pick up a city and insert its script existing in `https://tetunori.github.io/jpCityPolygon/dist/v1.0.0/`.  
There are a lot of `<ι½ιεΊηε>/<εΈεΊηΊζε>.min.js and .js` files there and you can confirm the files from [here](https://github.com/tetunori/jpCityPolygon/tree/main/dist/v1.0.0).  
(For prefectures, see `<ι½ιεΊηε>/<ι½ιεΊηε>.min.js and .js` )

For example, **εζ΅·ιεεΊε³ΆεΈ** (city) is like this.  
```html 
<script src="https://tetunori.github.io/jpCityPolygon/dist/v1.0.0/εζ΅·ι/εεΊε³ΆεΈ.min.js"></script>
```

Another example, **εζ΅·ι** (prefecture) is like this.  
```html 
<script src="https://tetunori.github.io/jpCityPolygon/dist/v1.0.0/εζ΅·ι/εζ΅·ι.min.js"></script>
```


## Use Polygon Object
### Object Structure
Each `<ι½ιεΊηε>/<εΈεΊηΊζε>.js and .min.js` has a single main object `<ι½ιεΊηε><εΈεΊηΊζε>`, like `εζ΅·ιεεΊε³ΆεΈ`.  
Also, each `<ι½ιεΊηε>/<ι½ιεΊηε>.js and .min.js` has a single main object `<ι½ιεΊηε>`, like `εζ΅·ι`.  
This object has the following 5 properties:  
- prefecture: String
  - Prefecture name (ι½ιεΊηε)
- name: String
  - City name (εΈεΊηΊζε)
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
  const polygons = εζ΅·ιεεΊε³ΆεΈ.normalizedPolygons;
  // const polygons = εζ΅·ι.normalizedPolygons;

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
- ['εΌηηγ?ζγζΉ' presentation](https://docs.google.com/presentation/d/1VgaI-CEZAcnpSP6yLlsxVNamHRQD64apeQsP0_mikEU/edit?usp=sharing) by anozon.

## Data
### City data
- Made from [γε½εζ°ε€ζε ±οΌθ‘ζΏεΊεγγΌγΏοΌγοΌε½εδΊ€ιηοΌ](https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html)
  - γγΌγΏγ?εΊζΊεΉ΄ζζ₯γ―εΉ³ζ31οΌ2019οΌεΉ΄ 1ζ 1ζ₯ζηΉγ?γγ?γ§γγ

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
