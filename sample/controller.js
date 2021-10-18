
// For controllers
let gCheckAutoGenerate = undefined;
let gBtGenerate = undefined;
let gBtSave = undefined;
let gSelName = undefined;
let gSelPrefecture = undefined;
// let gSliderCellSize = CELL_SIZE_DEFAULT;

let gControllerContainer = document.getElementById("controller-container");

// Prapare Controllers
const prepareControllers = () => {

  // gSliderCellSize = createSlider( CELL_SIZE_MIN, CELL_SIZE_MAX, CELL_SIZE_DEFAULT );
  
  initializeSelectors();
  initializeButtons();
  initializeChecks();

}

const initializeChecks = () => {
  
  gCheckAutoGenerate = createCheckbox(': Auto Generation', true);
  gCheckAutoGenerate.changed(onCheckedAutoGeneration);
  gCheckAutoGenerate.parent(gControllerContainer);


}

// const onCheckedAutoGeneration = () => {
function onCheckedAutoGeneration() {
  if (this.checked()) {
    console.log('Checking!');
    gAutoGenerate = true;
  } else {
    console.log('Unchecking!');
    gAutoGenerate = false;
  }
}

const initializeButtons = () => {

  gBtGenerate = createButton( 'Generate!' );
  gBtGenerate.mousePressed( generateCity );
  gBtGenerate.parent(gControllerContainer);
  gBtGenerate.class("btnPrimary");

  gBtSave = createButton('Save');
  gBtSave.mousePressed( saveImage );
  gBtSave.parent(gControllerContainer);
  gBtSave.class("btnSecondary");

}

// Toggle Grid
const generateCity = () => {
  // Generate!
  forceGenerate = true;
}

const initializeSelectors = () => {

  gSelPrefecture = createSelect();
  gSelPrefecture.position(10, 10);
  prefectureSelectorOption.forEach( element => {
    gSelPrefecture.option( element );
  });
  gSelPrefecture.selected(gTargetPrefecture);
  gSelPrefecture.changed(mySelectEvent);
  gSelPrefecture.parent(gControllerContainer);
  gSelPrefecture.style("position","relative");
  gSelPrefecture.style("left","0px");
  gSelPrefecture.style("top","0px");
  gSelPrefecture.class("selector");

  gSelName = createSelect();
  gSelName.position(10, 40);
  citySelectorOption[gTargetPrefecture].forEach( element => {
    gSelName.option( element );
  });
  gSelName.selected(gTargetCity);
  gSelName.changed(mySelectEvent);
  gSelName.parent(gControllerContainer);
  gSelName.style("position","relative");
  gSelName.style("left","0px");
  gSelName.style("top","0px");
  gSelName.class("selector");

}

function mySelectEvent() {
  
  forceGenerate = true;
  gTargetPrefecture = gSelPrefecture.value();
  gTargetCity = gSelName.value();
  if(typeof cityObjs[gTargetPrefecture + gTargetCity] === 'undefined') {
    loadScript('../data/'+ gTargetPrefecture + '/' + gTargetCity + '.min.js');
  }
  
}





// Re-draw controllers 
const redrawControllers = () => {

  return;

  if( gToggleController === false ){
    return;
  }

  // Draw background
  noStroke();
  fill( color( 'rgba( 0, 0, 0, 0.5 )' ) );
  const offset = 10;
  const width = 350;
  const height = 146;
  const cornerRound = 5;
  rect( offset, offset, width, height, cornerRound );

	let controllerOffsetX = 10;
	let controllerOffsetY = 10;
	
	const url = getURL();
  if( url.includes('openprocessing') ){
		const canvasRect = document.querySelector('canvas').getBoundingClientRect();

		controllerOffsetX += canvasRect.left;
		controllerOffsetY += canvasRect.top;
	}
	
  if( gSelPrefecture ){
    gSelPrefecture.position( controllerOffsetX + 20, controllerOffsetY + 54 );
  }

  if( gSelName ){
    gSelName.position( controllerOffsetX + 120, controllerOffsetY + 54 );
  }

  if( gBtSave ){
    gBtSave.position( controllerOffsetX + 270, controllerOffsetY + 54 );
  }

  if( gBtGenerate ){
    gBtGenerate.position( controllerOffsetX + 20, controllerOffsetY + 20 );
  }

  if( gCheckAutoGenerate ){
    gCheckAutoGenerate.position( controllerOffsetX + 20, controllerOffsetY + 90 );
  }

  // Draw captions
  fill( color( 'white' ) );
  // textSize( 15 );
  // text( 'Cell size: ' + gCellSize, 40 + gSliderCellSize.width, 35 );
  // text( 'Tap screen to toggle hide/display controllers.', 20, 138 );
  
}
