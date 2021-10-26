// Global variables for controllers
let gSelPrefecture = undefined;
let gSelName = undefined;
let gCheckAutoGenerate = undefined;
let gBtGenerate = undefined;
let gBtSave = undefined;
let gRadioColor = undefined;
let gInputCoolorsURL = undefined;

// Prepare a specified container for layout controllers
const gControllerContainer = document.getElementById('controller-container');

// Initialize controllers
const initializeControllers = () => {
  initializeSelectors();
  initializeButtons();
  initializeChecks();
  initializeRadios();
};

// Initialize selector controllers
const initializeSelectors = () => {
  // Prefecture selector
  gSelPrefecture = createSelect();
  prefectureSelectorOption.forEach((element) => {
    gSelPrefecture.option(element);
  });
  gSelPrefecture.selected(gTargetPrefecture);
  gSelPrefecture.changed(prefectureSelectorEvent);

  // Hometown name selector
  gSelName = createSelect();
  citySelectorOption[gTargetPrefecture].forEach((element) => {
    gSelName.option(element);
  });
  gSelName.selected(gTargetHometown);
  gSelName.changed(hometownSelectorEvent);

  // Common settings
  // P5 Selector default setting has position: absolute and so on.
  // So we should change settings as below.
  [gSelPrefecture, gSelName].forEach((sel) => {
    sel.parent(gControllerContainer);
    sel.style('position', 'relative');
    sel.style('left', '0px');
    sel.style('top', '0px');
    sel.class('selector');
  });
};

// Event callback for Prefecture Selector
const prefectureSelectorEvent = () => {
  // If user change selector, generate once forcely.(not depending on refresh-rate)
  gForceGenerate = true;

  // Evacuate old prefecture
  const oldPrefecture = gTargetPrefecture;

  // Set values from selectors.
  gTargetPrefecture = gSelPrefecture.value();

  // Delete old options
  citySelectorOption[oldPrefecture].forEach((element) => {
    gSelName.option(element, false);
  });

  // Add new options
  citySelectorOption[gTargetPrefecture].forEach((element) => {
    gSelName.option(element);
  });
  gTargetHometown = gSelName.value().replace('全域', '');
  if (gTargetPrefecture === gTargetHometown) {
    gTargetHometown = '';
  }

  // If cityObjs(God Object includes all of the imported city Objects) do NOT exist,
  // we will load new script dynamically.
  if (typeof cityObjs[gTargetPrefecture + gTargetHometown] === 'undefined') {
    loadHometownScript(gTargetPrefecture, gTargetHometown);
  }
};

// Event callback for hometown Selector
const hometownSelectorEvent = () => {
  // If user change selector, generate once forcely.(not depending on refresh-rate)
  gForceGenerate = true;

  // Set values from selectors.
  gTargetPrefecture = gSelPrefecture.value();
  gTargetHometown = gSelName.value().replace('全域', '');
  if (gTargetPrefecture === gTargetHometown) {
    gTargetHometown = '';
  }

  // If cityObjs(God Object includes all of the imported city Objects) do NOT exist,
  // we will load new script dynamically.
  if (typeof cityObjs[gTargetPrefecture + gTargetHometown] === 'undefined') {
    loadHometownScript(gTargetPrefecture, gTargetHometown);
  }
};

// Initialize Button controllers
const initializeButtons = () => {
  // Generate button
  gBtGenerate = createButton('Generate!');
  gBtGenerate.mousePressed(() => {
    gForceGenerate = true;
    gCheckAutoGenerate.checked(false);
    gAutoGenerate = false;
  });
  gBtGenerate.parent(gControllerContainer);
  gBtGenerate.class('btnPrimary');
  // gBtGenerate.attribute('disabled', '');

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
    if (gAutoGenerate) {
      gBtGenerate.attribute('disabled', '');
    } else {
      gBtGenerate.removeAttribute('disabled');
    }
  });
  gCheckAutoGenerate.parent(gControllerContainer);
};

// Initialize Radio button controllers
const initializeRadios = () => {
  const detailsContainer = select('#details-container');
  const summary = createElement('summary', 'Detailed Settings');
  summary.parent(detailsContainer);

  gCheckAutoGenerate.parent(detailsContainer);

  gRadioColor = createRadio();
  gRadioColor.elt.innerText = 'Color Setting: ';
  gRadioColor.option(1, '1');
  gRadioColor.option(2, '2');
  gRadioColor.option(3, '3');
  gRadioColor.option(4, '4');
  gRadioColor.option(5, '5');
  gRadioColor.option(6, 'By Yourself');
  gRadioColor.selected('1');

  gRadioColor.parent(detailsContainer);
  // console.log(gRadioColor)

  gInputCoolorsURL = createInput(
    'Set Coolors URL like https://coolors.co/283d3b-197278-edddd4-c44536-772e25',
    'text'
  );
  gInputCoolorsURL.size(400);
  gInputCoolorsURL.elt.disabled = true;
  gInputCoolorsURL.parent(detailsContainer);

  detailsContainer.parent(gControllerContainer);
};

// Update color URL setting
const updateColorURLSetting = () => {
  if (gRadioColor.value() === '6') {
    gInputCoolorsURL.elt.disabled = false;
  } else {
    gInputCoolorsURL.elt.disabled = true;
  }
};

// Update Controllers
const updateControllers = () => {
  updateColorURLSetting();
};
