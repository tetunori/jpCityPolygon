// Global variables for controllers
let gSelPrefecture = undefined;
let gSelName = undefined;
let gCheckAutoGenerate = undefined;
let gBtGenerate = undefined;
let gBtSave = undefined;

// Prepare a specified container for layout controllers
const gControllerContainer = document.getElementById('controller-container');

// Initialize controllers
const initializeControllers = () => {
  initializeSelectors();
  initializeButtons();
  initializeChecks();
};

// Initialize selector controllers
const initializeSelectors = () => {
  // Prefecture selector
  gSelPrefecture = createSelect();
  prefectureSelectorOption.forEach((element) => {
    gSelPrefecture.option(element);
  });
  gSelPrefecture.selected(gTargetPrefecture);

  // Hometown name selector
  gSelName = createSelect();
  citySelectorOption[gTargetPrefecture].forEach((element) => {
    gSelName.option(element);
  });
  gSelName.selected(gTargetCity);

  // Common settings
  // P5 Selector default setting has position: absolute and so on.
  // So we should change settings as below.
  [gSelPrefecture, gSelName].forEach((sel) => {
    sel.changed(selectorEvent);
    sel.parent(gControllerContainer);
    sel.style('position', 'relative');
    sel.style('left', '0px');
    sel.style('top', '0px');
    sel.class('selector');
  });
};

// Event callback for Selector
const selectorEvent = () => {
  // If user change selector, generate once forcely.(not depending on refresh-rate)
  forceGenerate = true;

  // Set values from selectors.
  gTargetPrefecture = gSelPrefecture.value();
  gTargetCity = gSelName.value();

  // If cityObjs(God Object includes all of the imported city Objects) do NOT exist,
  // we will load new script dynamically.
  if (typeof cityObjs[gTargetPrefecture + gTargetCity] === 'undefined') {
    loadScript('../data/' + gTargetPrefecture + '/' + gTargetCity + '.min.js');
  }
};

// Initialize Check box controllers
const initializeButtons = () => {
  // Generate button
  gBtGenerate = createButton('Generate!');
  gBtGenerate.mousePressed(() => {
    forceGenerate = true;
  });
  gBtGenerate.parent(gControllerContainer);
  gBtGenerate.class('btnPrimary');

  // Save image button
  gBtSave = createButton('Save');
  gBtSave.mousePressed(saveImage);
  gBtSave.parent(gControllerContainer);
  gBtSave.class('btnSecondary');
};

// Initialize Check box controllers
const initializeChecks = () => {
  gCheckAutoGenerate = createCheckbox(' : Auto Generation', true);
  gCheckAutoGenerate.changed(() => {
    gAutoGenerate = gCheckAutoGenerate.checked();
  });
  gCheckAutoGenerate.parent(gControllerContainer);
};
