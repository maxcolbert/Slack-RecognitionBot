// wheel.js

// Copyright Max Colbert 2020, Owner: Max Colbert


//===========================================================================
// LIBRARIES / REQUIRES


// unirest to make data requests
// web: http://unirest.io/nodejs.html
// var unirest = require('unirest');


//===========================================================================
// MAIN


// Create new wheel object specifying the parameters at creation time.
let theWheel = new Winwheel({
    'outerRadius'     : 212,        // Set outer radius so wheel fits inside the background.
    'innerRadius'     : 30,         // Make wheel hollow so segments don't go all way to center.
    'textFontSize'    : 24,         // Set default font size for the segments.
    'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
    'textAlignment'   : 'outer',    // Align text to outside of wheel.
    'numSegments'     : 17,         // Specify number of segments.
    'responsive'      : true,  // This wheel is responsive!
    'segments'        :             // Define segments including colour and text.
    [                               // font size and test colour overridden on backrupt segments.
       {'fillStyle' : '#ee1c24', 'text' : 'Lunch'},
       {'fillStyle' : '#3cb878', 'text' : '$ 100'},
       {'fillStyle' : '#00aef0', 'text' : 'WORK @ HOME', 'textFontSize' : 14},
       {'fillStyle' : '#f26522', 'text' : 'Amazon', 'textFontSize' : 21},
       {'fillStyle' : '#000000', 'text' : 'BANKRUPT', 'textFontSize' : 16, 'textFillStyle' : '#ffffff'},
       // {'fillStyle' : '#e70697', 'text' : '3000'},
       {'fillStyle' : '#fff200', 'text' : 'MEXICOOO', 'textFontSize' : 20},
       {'fillStyle' : '#ee1c24', 'text' : '350'},
       {'fillStyle' : '#3cb878', 'text' : '$ 100'},
       {'fillStyle' : '#f26522', 'text' : '800'},
       {'fillStyle' : '#fff200', 'text' : '400'},
       {'fillStyle' : '#00aef0', 'text' : 'WORK @ HOME', 'textFontSize' : 14},
       {'fillStyle' : '#ee1c24', 'text' : '1000'},
       {'fillStyle' : '#f26522', 'text' : 'Amazon', 'textFontSize' : 21},
       {'fillStyle' : '#3cb878', 'text' : '900'},
       {'fillStyle' : '#fff200', 'text' : '700'},
       {'fillStyle' : '#00aef0', 'text' : '800'},
       {'fillStyle' : '#ffffff', 'text' : 'LOOSE TURN', 'textFontSize' : 12}
    ],
    'animation' :           // Specify the animation to use.
    {
        'type'     : 'spinToStop',
        'duration' : 15,    // Duration in seconds.
        'spins'    : 7,     // Default number of complete spins.
        'callbackFinished' : alertPrize,
        'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
        'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
    },
    'pins' :				// Turn pins on.
    {
        'number'     : 17,
        'fillStyle'  : 'silver',
        'outerRadius': 4,
    }
});

// Loads the tick audio sound in to an audio object.
let audio = new Audio('../public/images/tick.mp3');

// This function is called when the sound is to be played.
function playSound() {
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel) {
    // Ensure that power can't be changed while wheel is spinning.
    if (wheelSpinning == false) {
        // Reset all to grey incase this is not the first time the user has selected the power.
        document.getElementById('pw1').className = "";
        document.getElementById('pw2').className = "";
        document.getElementById('pw3').className = "";

        // Now light up all cells below-and-including the one selected by changing the class.
        if (powerLevel >= 1) {
            document.getElementById('pw1').className = "pw1";
        }

        if (powerLevel >= 2) {
            document.getElementById('pw2').className = "pw2";
        }

        if (powerLevel >= 3) {
            document.getElementById('pw3').className = "pw3";
        }

        // Set wheelPower var used when spin button is clicked.
        wheelPower = powerLevel;

        // Light up the spin button by changing it's source image and adding a clickable class to it.
        document.getElementById('spin_button').src = "../public/images/spin_on.png";
        document.getElementById('spin_button').className = "clickable";
    }
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin() {
    // Ensure that spinning can't be clicked again while already running.
    if (wheelSpinning == false) {
        // Based on the power level selected adjust the number of spins for the wheel, the more times is has
        // to rotate with the duration of the animation the quicker the wheel spins.
        var numSpins = 5;
        if (wheelPower == 1)
            numSpins = Math.floor((Math.random() * 10) + 5);    // 5 --> 15
        else if (wheelPower == 2)
            numSpins = Math.floor((Math.random() * 15) + 15);    // 15 --> 30
        else if (wheelPower == 3)
            numSpins = Math.floor((Math.random() * 20) + 30);    // 30 --> 50

        theWheel.animation.spins = numSpins;
        console.log("numSpins: ", numSpins);

        // Disable the spin button so can't click again while wheel is spinning.
        document.getElementById('spin_button').src       = "../public/images/spin_off.png";
        document.getElementById('spin_button').className = "";

        // Begin the spin animation by calling startAnimation on the wheel object.
        theWheel.startAnimation();

        // Set to true so that power can't be changed and spin button re-enabled during
        // the current animation. The user will have to reset before spinning again.
        wheelSpinning = true;
    }
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
    theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.

    // get random start degree
    var startAng = Math.floor((Math.random() * 360) + 0);
    theWheel.rotationAngle = startAng;     // Re-set the wheel angle to 0 degrees.
    theWheel.draw();                // Call draw to render changes to the wheel.

    document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
    document.getElementById('pw2').className = "";
    document.getElementById('pw3').className = "";

    wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
    // Just alert to the user what happened.
    // In a real project probably want to do something more interesting than this with the result.
    if (indicatedSegment.text == 'LOOSE TURN') {
        alert('Sorry but you loose a turn.');
    } else if (indicatedSegment.text == 'BANKRUPT') {
        alert('Oh no, you have gone BANKRUPT!');
    } else {
        alert("You have won " + indicatedSegment.text);
    }
}


//===========================================================================
// EXPORTS


module.exports = {
    coins: coins,

    createBaseData: createBaseData,
    getHistoryCC: getHistoryCC,
    getCoinPrices: getCoinPrices,
    getGBTCData: getGBTCData,
    getBTCData: getBTCData,

    CoinsApiData: CoinsApiData
}




