
// Settings
let gToggleController = true;

// For controllers
let gCheckAutoGenerate = undefined;
let gBtGenerate = undefined;
let gBtSave = undefined;
let gSelName = undefined;
let gSelPrefecture = undefined;
// let gSliderCellSize = CELL_SIZE_DEFAULT;

// Prapare Controllers
const prepareControllers = () => {

  // gSliderCellSize = createSlider( CELL_SIZE_MIN, CELL_SIZE_MAX, CELL_SIZE_DEFAULT );

  initializeChecks();
  initializeButtons();
  initializeSelectors();

}

const initializeChecks = () => {
  
  gCheckAutoGenerate = createCheckbox(': Auto Generation', true);
  gCheckAutoGenerate.changed(onCheckedAutoGeneration);
  console.log(gCheckAutoGenerate);

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

  gBtSave = createButton('Save');
  gBtSave.mousePressed( enableCaptureImage );

}

// Toggle Grid
const generateCity = () => {
  // Generate!
}

const initializeSelectors = () => {

  gSelPrefecture = createSelect();
  gSelPrefecture.position(10, 10);
  prefectureSelectorOption.forEach( element => {
    gSelPrefecture.option( element );
  });
  gSelPrefecture.selected(gTargetPrefecture);
  gSelPrefecture.changed(mySelectEvent);

  gSelName = createSelect();
  gSelName.position(10, 40);
  citySelectorOption[gTargetPrefecture].forEach( element => {
    gSelName.option( element );
  });
  gSelName.selected(gTargetCity);
  gSelName.changed(mySelectEvent);

}

function mySelectEvent() {
  gTargetPrefecture = gSelPrefecture.value();
  gTargetCity = gSelName.value();
  if(typeof cityObjs[gTargetPrefecture + gTargetCity] === 'undefined') {
      loadScript('../data/'+ gTargetPrefecture + '/' + gTargetCity + '.min.js');
  }
}



// Toggle Controller setting
const toggleController = () => {

  gToggleController = !gToggleController;

  if( gToggleController === false ){
    
    gCheckAutoGenerate.hide();
    gBtGenerate.hide();
    gBtSave.hide();
    gSelName.hide();
    gSelPrefecture.hide();

  }else{

    gCheckAutoGenerate.show();
    gBtGenerate.show();
    gBtSave.show();
    gSelName.show();
    gSelPrefecture.show();

  }

}

// Re-draw controllers 
const redrawControllers = () => {

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
