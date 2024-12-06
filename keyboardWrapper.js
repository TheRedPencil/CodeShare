/*
 * Author: Ramon Miland
 * Date: 12/6/2024
 * Purpose: Get an accurate state of the keyboard regardless of frame
 * License: CC-O, please use this code so you don't have to deal with javascript's 
 * slow event-only key input system. Feel free to modify to suit your needs.
 * Instructions: Declare this as one of the script tags in your game.html file.
 * 
 * Copy & Paste:
 * <script src="keyboardWrapper.js"></script>
 * 
 * Make sure to call "updatePastKeys()" at the end of your game loop method
 * 
 * Most key inputs in javascript are the lowercase versions of letters e.g. "s" represents the S-key.
 * You can read more about that here: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
 * 
*/


//#region Key Input Tracking 

let keyInputs = [];
let pastKeyInputs = [];

// Listen for key press
document.addEventListener('keydown', function(event) {
    // Track the most recent keyboard state
    pastKeyInputs = keyInputs.map((x) => x); 

    // Add key that was just pressed
    if (keyInputs.indexOf(event.key) == -1) keyInputs.push(event.key);
});

// Listen for key release
document.addEventListener('keyup', function(event) {
    // Track the most recent keyboard state
    pastKeyInputs = keyInputs.map((x) => x); 

    // Remove key that was just released
    let keyIndex = keyInputs.indexOf(event.key);
    if (keyIndex != -1){
        keyInputs.splice(keyIndex, 1);
    }
});

//#endregion

// CALL THIS AT THE BOTTOM OF YOUR GAME LOOP METHOD
let updatePastKeys = () => pastKeyInputs = keyInputs.map((x) => x); 

//#region Keyboard Polling Methods

/**
 * Get whether key is currently being pressed
 * @param {String} key 
 * @returns 
 */
function getKeyPressed(key) {
    return keyInputs.indexOf(key) != -1;
}

/**
 * Get whether key was released in this frame but pressed in the last
 * @param {String} key 
 * @returns 
 */
function getKeyClicked(key) {
    return pastKeyInputs.indexOf(key) != -1 && !getKeyPressed(key);
}

/**
 * Get whether key was pressed in this frame and not the last
 * @param {String} key 
 * @returns 
 */
function getKeyJustPressed(key) {
    return pastKeyInputs.indexOf(key) == -1 && getKeyPressed(key);
}

/**
 * Get weighted key input between two keys
 * @param {String} negativeKey 
 * @param {String} positiveKey 
 * @returns -1 if negative key is pressed, 1 if positive key is pressed, 0 if both or neither is pressed
 */
function getInputAxis(negativeKey, positiveKey){
    let result = 0;
    if (getKeyPressed(negativeKey)){
        result -= 1;
    }
    if (getKeyPressed(positiveKey)){
        result += 1;
    }
    return result;
}

//#endregion