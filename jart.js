/* ========= */
/* Variables */
/* ========= */
/* Note: these are in use by multiple functions,
 * or large objects/arrays we don't want to instantiate
 * more than necessary. */
// keeps track of the tone of the jart
let palletteIndex;
// so we can have a cohesive gradient "feel"
let gradientIndex = Math.random();
// pallettes curtosey of https://coolors.co
const possibleColorCombos = [
    {
        "primary": "#DB5375",
        "secondary": "#729EA1",
        "tertiary": "#B5BD89",
        "fourthtiary": "#DFBE99",
        "fifthtiary": "#EC9192",
    },
    {
        "primary": "#26547C",
        "secondary": "#EF476F",
        "tertiary": "#FFD166",
        "fourthtiary": "#06D6A0",
        "fifthtiary": "#FCFCFC",
    },
    {
        "primary": "#1E1E24",
        "secondary": "#FB9F89",
        "tertiary": "#C4AF9A",
        "fourthtiary": "#81AE9D",
        "fifthtiary": "#21A179",
    },
    {
        "primary": "#BBBDF6",
        "secondary": "#9893DA",
        "tertiary": "#797A9E",
        "fourthtiary": "#72727E",
        "fifthtiary": "#625F63",
    },
    {
        "primary": "#F45B69",
        "secondary": "#F6E8EA",
        "tertiary": "#22181C",
        "fourthtiary": "#5A0001",
        "fifthtiary": "#F13030",
    },
    {
        "primary": "#CC5803",
        "secondary": "#E2711D",
        "tertiary": "#E2711D",
        "fourthtiary": "#FFB627",
        "fifthtiary": "#FFC971",
    },
    {
        "primary": "#586BA4",
        "secondary": "#324376",
        "tertiary": "#F5DD90",
        "fourthtiary": "#F68E5F",
        "fifthtiary": "#F76C5E",
    },
    {
        "primary": "#8C271E",
        "secondary": "#ABA194",
        "tertiary": "#CFCBCA",
        "fourthtiary": "#D8DDDE",
        "fifthtiary": "#D9F7FA",
    },
    {
        "primary": "#1F2041",
        "secondary": "#4B3F72",
        "tertiary": "#FFC857",
        "fourthtiary": "#119DA4",
        "fifthtiary": "#19647E",
    },
    {
        "primary": "#FFF07C",
        "secondary": "#80FF72",
        "tertiary": "#7EE8FA",
        "fourthtiary": "#EEC0C6",
        "fifthtiary": "#E58C8A",
    },
    {
        "primary": "#6FA8CE",
        "secondary": "#B2BCAA",
        "tertiary": "#838E83",
        "fourthtiary": "#6C6061",
        "fifthtiary": "#64403E",
    },
    {
        "primary": "#068D9D",
        "secondary": "#53599A",
        "tertiary": "#6D9DC5",
        "fourthtiary": "#80DED9",
        "fifthtiary": "#AEECEF",
    },
];
const measuredEffects = [
    "padding",
    "margin"
];
const potentialTransforms = [
    "rotate",
    "skew"
];
const potentialBlendModes = [
    "normal",
    "multiply",
    "screen",
    "overlay",
    "darken",
    "lighten",
    "color-dodge",
    "saturation",
    "color",
    "luminosity"
];

/* ================= */
/* Utility functions */
/* ================= */
/**
 * will add <div>s to a _parentElement_,
 * _complexity_ amount of times.
 */
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
/**
 * retrieves any item from an _array_.
 */
function getRandomArrayItem(array) {
    return array[Math.floor(Math.random()*array.length)];
}
/**
 * gets a whole integer in the specified
 * range of _min_ (inclusive) to _max_
 * (exclusive). min and max default to
 * 0 and 100, respectively.
 */
function getRange(min = 0, max = 100) {
    const minCeil = Math.ceil(min);
    const maxFloor = Math.floor(max);
    return Math.floor(Math.random() * (maxFloor - minCeil)) + minCeil;
}
/**
 * returns a lighter or darker version of the
 * _hexColor_, a _percent_ amount. this function
 * is meant to be called by getHexColor().
 */
function randomBrightnessVariation(hexColor, percent = 10) {
    // strip the leading # if it's there
    hexColor = hexColor.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(hexColor.length == 3){
        hexColor = hexColor.replace(/(.)/g, '$1$1');
    }

    const r = parseInt(hexColor.substr(0, 2), 16),
        g = parseInt(hexColor.substr(2, 2), 16),
        b = parseInt(hexColor.substr(4, 2), 16);

    let newColorHex = (((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
    ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
    ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1));

    // before returning, do a check to make sure we absoutely have 6 letters in our hex code.
    return newColorHex;
}
/**
 * returns an integer in _min_ to _max_ range,
 * (defaults to 0 and 100, respectively), then attaches
 * a _unit_ (rem or percent by default) which also can
 * be overriden.
 */
function writeRandomMeasurement(min = 1, max = 100, measurementUnit) {
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
    return getRange(min, max) + unit;
}
/**
 * will clear all elements of a given element tag name.
 * example: clearAllElements(div) will remove all divs on page.
 * this is inspired by a function from:
 * https://stackoverflow.com/questions/21935299/removing-style-tags-from-head */
function clearAllElements(elementType) {
    let hs = document.getElementsByTagName(elementType);
    for (let i=0, max = hs.length; i < max; i++) {
        if(hs[i]) {
            hs[i].parentNode.removeChild(hs[i]);
        }
    }
}
/**
 * gives an integer 0 - 180, then
 * attaches "deg" to the end before
 * returning.
 */
function generateRandomDegree() {
    return getRange(0, 180) + "deg";
}
/** 
 * returns either a linear/radial gradient,
 * or a solid hex color. */
function generateBackground() {
    let backgroundCSSRule = getHexColor();
    if(Math.random() > gradientIndex) {
        backgroundCSSRule = "radial-gradient(" +
                            getHexColor() + " " + getRange(-180, -50) + "%, " +
                            getHexColor() + " " + getRange(50, 180) + "%)";
        if(Math.random() > 0.2) { // slightly higher chance for a linear gradient
            backgroundCSSRule = "linear-gradient(" +
            generateRandomDegree() + ", " +
            getHexColor() + " " + getRange(-180, -50) + "%, " +
            getHexColor() + " " + getRange(50, 180) + "%)";
        }
    }
    return backgroundCSSRule;
}
/**
 * will return 1-4 numbers with a space inbetween each,
 * originally intended for use in setting border-radius. */
function generateBorderRadius() {
    let borderRadiusCSSRule = writeRandomMeasurement() + " ";
    if(Math.random() > 0.5) {
        borderRadiusCSSRule += writeRandomMeasurement() + " ";
        if(Math.random() > 0.5) {
            borderRadiusCSSRule += writeRandomMeasurement() + " ";
            if(Math.random() > 0.5) {
                borderRadiusCSSRule += writeRandomMeasurement() + " ";
            }
        }
    }
    // small probability to return a square
    if(Math.random() > 0.85) {
        borderRadiusCSSRule = "0";
    }
    return borderRadiusCSSRule.trim();
}
/* End utility functions */

/* ============== */
/* Jart functions */
/* ============== */
/**
 * gets a random hex color, and applies
 * randomBrightnessVariation before returning
 * said color.
 */
function getHexColor() {
    /* If we haven't landed on a pallette yet, let's set it. */
    if(!palletteIndex) {
        palletteIndex = getRange(0, possibleColorCombos.length - 1);
    }
    const randomPalletteProperty = getRandomArrayItem(Object.keys(possibleColorCombos[palletteIndex]));
    return randomBrightnessVariation(possibleColorCombos[palletteIndex][randomPalletteProperty], getRange(-20, 20));
}
/**
 * wipes away all previous jart and style associated
 * with said jart.
 */
function clearPreviousArt() {
    clearAllElements("style");
    clearAllElements("div");
}
/**
 * sets a random color to the back of the canvas.
 */
function setRandomBodyBackground() {
    const easelWrapperElement = document.getElementById("EaselWrapper");
    easelWrapperElement.style.background = generateBackground();
}
/**
 * the big ol' nasty writer of the css for jart.
 * relies on a _complexity_, which will determine
 * exactly how much css is spit out.
 */
function writeRecursiveStyle(complexity) {
    const headElement = document.head;
    const styleElement = document.createElement('style');
    // now generate some rules
    let cssString = "";
    let cssMeasurement;
    let transformMeasurement;
    const blendMode = getRandomArrayItem(potentialBlendModes);
    for(let i = 0; i < complexity; i++) {
        cssMeasurement = "";
        transformMeasurement = writeRandomMeasurement(0, 50, "deg") + " ";
        const measurementLengthRoll = Math.random();
        cssMeasurement += writeRandomMeasurement(1, 10) + " ";
        if(measurementLengthRoll > 0.33) {
            cssMeasurement += writeRandomMeasurement(1, 10) + " ";
        }
        if(measurementLengthRoll > 0.66) {
            cssMeasurement += writeRandomMeasurement(1, 10) + " "; // we'll trim this space later
        }
        cssString += "div ".repeat(i + 1) + "{\n";
        // set padding/margin
        cssString += "\t" + getRandomArrayItem(measuredEffects) + ": " + cssMeasurement.trim() + ";\n";
        cssString += "\tborder-radius: " + generateBorderRadius() + ";\n";
        cssString += "\tbackground: " + generateBackground() + ";\n";
        cssString += "\ttransform: " + getRandomArrayItem(potentialTransforms) + "(" + transformMeasurement.trim() + ");\n";
        cssString += "\theight: " + writeRandomMeasurement(5, 100) + ";\n";
        cssString += "\twidth: " + writeRandomMeasurement(5, 100) + ";\n";
        // give jart some variance with how divs overlap
        cssString += "\tmix-blend-mode: " + blendMode + ";\n";
        cssString += "}\n";
    }
    styleElement.textContent = cssString;
    headElement.appendChild(styleElement);

    const easelElement = document.getElementById("Easel");
    easelElement.style.flexDirection = getRandomArrayItem(["row", "column"]);
    easelElement.style.alignItems = getRandomArrayItem(["center", "flex-start", "flex-end"]);
    easelElement.style.justifyContent = getRandomArrayItem(["center", "flex-start", "space-between", "space-evenly"]);
    easelElement.style.transform = "rotate(" + generateRandomDegree() + ") scale(" + (getRange(10, 130) * 0.01) + ")";
}
/**
 * will create a jart. _complexity_ defaults to 10,
 * but can be overrideen. more complexity means
 * more shapes in the jart!
 */
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
/* End jart functions */

/* after the page is all loaded up,
 * generate a jart! */
document.addEventListener("DOMContentLoaded", function() {
    let complexity = getRange(3, 40);
    createJart(complexity);
});