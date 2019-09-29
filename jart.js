function addRecursiveDivs(parentElement, complexity) {
    let newElement;
    for (let i = 0; i < complexity; i++) {
        newElement = document.createElement("div");
        if(Math.random() > 0.15) {
            parentElement.appendChild(newElement);
        }
        else {
            document.getElementById("Easel").appendChild(newElement);
        }
        parentElement = newElement;
    }
}

function getRandomArrayItem(array) {
    return array[Math.floor(Math.random()*array.length)];
}

function getRange(min = 0, max = 100) {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil; //The maximum is exclusive and the minimum is inclusive
}

function getRandomHexValue() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function writeRandomMeasurement(measurementUnit) {
    // decide whether to send percentage or rem
    let unit;
    if(Math.random() > 0.5) {
        unit = "rem";
    }
    else {
        unit = "%";
    }
    if(measurementUnit) {
        unit = measurementUnit;
    }
    return getRange() + unit;
}

/* this is inspired by a function from: https://stackoverflow.com/questions/21935299/removing-style-tags-from-head */
function clearAllElements(elementType) {
    let hs = document.getElementsByTagName(elementType);
    for (let i=0, max = hs.length; i < max; i++) {
        if(hs[i]) {
            hs[i].parentNode.removeChild(hs[i]);
        }
    }
}
function clearPreviousArt() {
    clearAllElements("style");
    clearAllElements("div");
}

/* this is borderline silly */
function writeRecursiveStyle(complexity) {
    const measuredEffects = [
        "padding",
        "margin",
        "border-radius"
    ];
    const potentialTransforms = [
        "rotate",
        "skew"
    ];
    const headElement = document.head;
    const styleElement = document.createElement('style');
    // now generate some rules
    let cssString = "";
    let cssMeasurement;
    let transformMeasurement;
    for(let i = 0; i < complexity; i++) {
        cssMeasurement = "";
        transformMeasurement = writeRandomMeasurement("deg") + " ";
        for(let n = 0; n < getRange(1, 3); n++) {
            cssMeasurement += writeRandomMeasurement() + " ";
        }
        cssString += "div ".repeat(i + 1) + "{\n";
        // set padding/margin
        cssString += "\t" + getRandomArrayItem(measuredEffects) + ": " + cssMeasurement.trim() + ";\n";
        // set background
        cssString += "\tbackground-color: " + getRandomHexValue() + ";\n";
        // set transform
        cssString += "\ttransform: " + getRandomArrayItem(potentialTransforms) + "(" + transformMeasurement.trim() + ");\n";
        // set height and width
        cssString += "\theight: " + writeRandomMeasurement() + ";\n";
        cssString += "\twidth: " + writeRandomMeasurement() + ";\n";
        cssString += "}\n";
    }
    styleElement.textContent = cssString;
    headElement.appendChild(styleElement);
    // make the easel have a random flex order and orientation
    document.getElementById("Easel").style.flexDirection = getRandomArrayItem(["row", "column"]);
    // make the easel have a random rotation & scale
    document.getElementById("Easel").style.transform = "rotate("+getRange(0, 180)+"deg) scale("+Math.random()+")";
}

function setRandomBodyBackground() {
    document.getElementById("EaselWrapper").style.backgroundColor = getRandomHexValue();
}

let intervalTimer;
function createJart(complexity) {
    if(!complexity) {
        console.warn("No complexity setting... defaulting to 'pretty complex'.");
        complexity = 10;
    }
    document.getElementById("Easel").classList.remove("fade-in");
    document.getElementById("Easel").classList.add("fade-out");
    clearInterval(intervalTimer);
    intervalTimer = setInterval(function() {
        document.getElementById("Easel").classList.remove("fade-out");
        clearPreviousArt();
        setRandomBodyBackground();
        writeRecursiveStyle(complexity);
        addRecursiveDivs(document.getElementById("Easel"), complexity);
        document.getElementById("Easel").classList.add("fade-in");
        clearInterval(intervalTimer);
    }, 250); // should match animation time on easel, controlled in the CSS
}

document.addEventListener("DOMContentLoaded", function() {
    let complexity = getRange(50, 500);
    createJart(complexity);
    // reset the style with spacebar
    document.body.onkeyup = function(e) {
        if(e.keyCode == 32) {
            complexity = getRange(50, 500);
            createJart(complexity);
        }
    }
});