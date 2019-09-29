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
    return getRange(33, 66) + unit;
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
        const measurementLengthRoll = Math.random();
        cssMeasurement += writeRandomMeasurement() + " ";
        if(measurementLengthRoll > 0.33) {
            cssMeasurement += writeRandomMeasurement() + " ";
        }
        if(measurementLengthRoll > 0.66) {
            cssMeasurement += writeRandomMeasurement() + " "; // we'll trim this space later
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

    const easelElement = document.getElementById("Easel");
    easelElement.style.flexDirection = getRandomArrayItem(["row", "column"]);
    easelElement.style.transform = "rotate("+getRange(0, 180)+"deg) scale("+Math.random()+")";
}

function setRandomBodyBackground() {
    const easelWrapperElement = document.getElementById("EaselWrapper");
    easelWrapperElement.style.backgroundColor = getRandomHexValue();
}

function createJart(complexity) {
    let intervalTimer;
    const easelElement = document.getElementById("Easel");
    if(!complexity) {
        console.warn("No complexity setting... defaulting to 'pretty complex'.");
        complexity = 10;
    }
    easelElement.classList.remove("fade-in");
    easelElement.classList.add("fade-out");
    clearInterval(intervalTimer);
    intervalTimer = setInterval(function() {
        easelElement.classList.remove("fade-out");
        clearPreviousArt();
        setRandomBodyBackground();
        writeRecursiveStyle(complexity);
        addRecursiveDivs(easelElement, complexity);
        easelElement.classList.add("fade-in");
        clearInterval(intervalTimer);
    }, 250); // should match animation time on easel, controlled in the CSS
}

document.addEventListener("DOMContentLoaded", function() {
    let complexity = getRange(20, 150);
    createJart(complexity);
});