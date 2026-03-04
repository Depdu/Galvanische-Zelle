// --- Datenbasis der Metalle ---
const metals = {
  "Li":  { E0: -3.04, ion: "Li⁺",  z: 1 },
  "K":   { E0: -2.93, ion: "K⁺",   z: 1 },
  "Ca":  { E0: -2.87, ion: "Ca²⁺", z: 2 },
  "Na":  { E0: -2.71, ion: "Na⁺",  z: 1 },
  "Mg":  { E0: -2.37, ion: "Mg²⁺", z: 2 },
  "Al":  { E0: -1.66, ion: "Al³⁺", z: 3 },
  "Zn":  { E0: -0.76, ion: "Zn²⁺", z: 2 },
  "Fe":  { E0: -0.44, ion: "Fe²⁺", z: 2 },
  "Ni":  { E0: -0.25, ion: "Ni²⁺", z: 2 },
  "Sn":  { E0: -0.14, ion: "Sn²⁺", z: 2 },
  "Pb":  { E0: -0.13, ion: "Pb²⁺", z: 2 },
  "H":   { E0:  0.00, ion: "H⁺",   z: 1 },
  "Cu":  { E0:  0.34, ion: "Cu²⁺", z: 2 },
  "Ag":  { E0:  0.80, ion: "Ag⁺",  z: 1 },
  "Hg":  { E0:  0.85, ion: "Hg²⁺", z: 2 },
  "Au":  { E0:  1.50, ion: "Au³⁺", z: 3 }
};

let selectA, selectB;
let result = null;
let results = []; // Tabelle

function setup() {
  createCanvas(windowWidth, windowHeight * 0.75);
  textSize(18);

  // Dropdowns
  selectA = createSelect();
  selectA.position(20, 20);
  selectA.style("font-size", "20px");

  selectB = createSelect();
  selectB.position(200, 20);
  selectB.style("font-size", "20px");

  for (let m in metals) {
    selectA.option(m);
    selectB.option(m);
  }

  // Buttons
  let button = createButton("Experiment starten");
  button.position(380, 20);
  button.style("font-size", "20px");
  button.mousePressed(runExperiment);

  let addButton = createButton("Zur Spannungsreihe hinzufügen");
  addButton.position(600, 20);
  addButton.style("font-size", "20px");
  addButton.mousePressed(addToTable);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.75);
}

function runExperiment() {
  let mA = selectA.value();
  let mB = selectB.value();

  const A = metals[mA];
  const B = metals[mB];

  const cathode = A.E0 > B.E0 ? {name: mA, ...A} : {name: mB, ...B};
  const anode   = A.E0 > B.E0 ? {name: mB, ...B} : {name: mA, ...A};

  const voltage = cathode.E0 - anode.E0;

  result = {
    anode,
    cathode,
    voltage,
    ox: `${anode.name} → ${anode.ion} + ${anode.z}e⁻`,
    red: `${cathode.ion} + ${cathode.z}e⁻ → ${cathode.name}`
  };
}

function addToTable() {
  if (result) {
    results.push(result);
  }
}

function draw() {
  background(245);

  drawHalfCells();

  if (result) {
    drawResults();
  }

  drawTable();
}

function drawHalfCells() {
  fill(220);
  rect(100, 150, 300, 300); // linke Halbzelle
  rect(width - 400, 150, 300, 300); // rechte Halbzelle

  fill(150);
  rect(180, 160, 30, 250); // Elektrode links
  rect(width - 320, 160, 30, 250); // Elektrode rechts

  fill(0);
  text("Halbzelle A", 160, 480);
  text("Halbzelle B", width - 340, 480);

  // Leiter
  stroke(0);
  line(210, 160, width - 320, 160);
}

function drawResults() {
  fill(0);
  textSize(20);

  text("Anode (Oxidation): " + result.ox, 50, 80);
  text("Kathode (Reduktion): " + result.red, 50, 110);

  text("Elektronenfluss: " + result.anode.name + " → " + result.cathode.name, 50, 140);

  text("Leerlaufspannung: " + result.voltage.toFixed(2) + " V", 50, height * 0.72);

  // Elektronenfluss animiert
  let t = frameCount % 200;
  fill(255, 200, 0);
  ellipse(210 + t * ((width - 530) / 200), 160, 15, 15);
}

function drawTable() {
  fill(0);
  textSize(22);
  text("Spannungsreihe (automatisch erzeugt)", 50, height * 0.78);

  textSize(16);
  let y = height * 0.82;

  text("Nr.", 50, y);
  text("Anode", 100, y);
  text("Kathode", 200, y);
  text("z", 330, y);
  text("Oxidation", 370, y);
  text("Reduktion", 620, y);
  text("U (V)", 850, y);

  y += 25;

  for (let i = 0; i < results.length; i++) {
    let r = results[i];
    text(i + 1, 50, y);
    text(r.anode.name, 100, y);
    text(r.cathode.name, 200, y);
    text(r.anode.z, 330, y);
    text(r.ox, 370, y);
    text(r.red, 620, y);
    text(r.voltage.toFixed(2), 850, y);
    y += 25;
  }
}

