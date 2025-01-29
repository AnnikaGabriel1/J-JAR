//Import##################################################################
import { soundMap } from "../js/sound-map.js";
import { el, group} from "./lib.js";
import { db } from "./db.js";
//#########################################################################
//Variables________________________________________________________________
const padButtons = group(".single-pad");
const rangeSlider = el("#rangeSlider");
const rangeSliderOutput = el("#sliderValue");

let isPlaying = false;
let playInterval;
let bpmSpeed=parseInt(rangeSlider.value); //Startvalue of Speed
rangeSliderOutput.innerHTML = bpmSpeed; //Shows updated Value of the Slider

//Functions__________________________________________________________________
//Calc BPM to milliseconds
function bpmToMilliseconds(bpm) {
    return 60000 / bpm;
}

//Play active Pads
function playActivePads(columnIndex) {
    padButtons.forEach(async button => {
        const buttonId = button.id; //Saves Button id

        //Extract ID-Number
        const idNumber = parseInt(buttonId.replace(/[^\d]/g, ''), 10);

        // Proof if Button is active and that ID Nr. ends with column number
        if (button.classList.contains('active') && idNumber === columnIndex) {
            if (button.classList.contains("recorded")) {
                //plays recorded audio
                const blob = await db.readItem("rec");
                const audioBlobUrl = URL.createObjectURL(blob);
                if (audioBlobUrl) {
                    const audio = new Audio(audioBlobUrl);
                    audio.play();
                }
            } else {
                //plays soundmap-sound
                const soundFile = soundMap[buttonId];
                if (soundFile) {
                    const sound = new Audio(soundFile);
                    sound.currentTime = 0; //resets playback time
                    sound.play();
                }
            }
        }
    });
}

//Activate Step-Light
function activateLight(columnIndex) {
    const activeLight = document.getElementById(`light${columnIndex}`);
    if (activeLight) {
        activeLight.classList.add('active');  // Hebt die aktuelle Spalte visuell hervor
    }
}

//Deactivate Step-Light
function deactivateLight(columnIndex) {
    const previousLight = document.getElementById(`light${columnIndex}`);
    if (previousLight) {
        previousLight.classList.remove('active');  //Delete active Light of pevious column
    }
}

// Deactivate all lights
function resetAllLights() {
    for (let i = 1; i <= 12; i++) {
        deactivateLight(i);  // Deaktiviert alle Lichter
    }
}

//Sequence
function playSequence() {
    let columnIndex = 1;  //Start Sequence in first Column
    let previousColumnIndex = null; //Last Activated Light/Column, so with start = none

    resetAllLights();  // Reset lights before starting

    playInterval = setInterval(() => {
        if (columnIndex > 12) {
            columnIndex = 1; //After the 4th Column -> Jumps to column 1 again
        }

        //Deactivate previous light
        if (previousColumnIndex !== null) { //Checks if previous column index contains a value, which is not null
            deactivateLight(previousColumnIndex);
        }

        //Activate current light
        activateLight(columnIndex);

        //Play active Pads
        playActivePads(columnIndex); //Calls the function with active pads

        //Saves current column as previous one for next iteration
        previousColumnIndex = columnIndex; // Update the previous column
        columnIndex++;  //go to next column

    }, bpmToMilliseconds(bpmSpeed)); //speed
}

//Export###################################################################
//Play Audio & Activate/Deactivate Buttons
export function initializePadButtons() {
    padButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const buttonId = this.id; //links the button ID
            console.log("Button ID:", buttonId);

            //Proof if pad is already active + Proof if its a record-audio-pad
            if (this.classList.contains("active")) {
                this.classList.remove("active"); //deactivates pad
                return;
            }

            //If its a record-audio-pad -> Play Sound by activating 
            if (this.classList.contains("recorded")) {
                this.classList.add("active"); //Activates pad

                //calls and plays recorded audio
                const blob = await db.readItem("rec");
                const audioBlobUrl = URL.createObjectURL(blob);
                if (audioBlobUrl) {
                    const audio = new Audio(audioBlobUrl);
                    audio.play();
                }
                return;
            }

            // plays audio of Sound Map (für nicht-recorded Pads)
            const soundFile = soundMap[buttonId]; //get soundfile by soundMap
            if (soundFile) {
                const sound = new Audio(soundFile);
                sound.play();
            }

            //activates pad
            this.classList.add("active");
        });
    });
}

// Play/Stop
export function playStopButton() {
    if (isPlaying) {
        clearInterval(playInterval); //Stops Intervall, so stops playSequence() (Eingebaute JavaScriptFunktion) -> Set in playSequence-Function
        isPlaying = false;
        this.textContent = "Play";
    } else {
        playSequence(); // Plays
        isPlaying = true;
        this.textContent = "Stop";
    }
};

//Stop Sequence
export function stopSequence() {
    if (isPlaying) {
        clearInterval(playInterval);
        isPlaying = false;
    }
    //Reset Play/Stop-Button to "Play"
    const playButton = el("#playStop"); //Not necessary, but useful if we want to use the stopSequence function for something else
    if (playButton) {
        playButton.textContent = "Play"; //Sets Button-Text back to "Play"
    }
}

//Clear-All
export function clearAll(){
    padButtons.forEach(button => {
        button.classList.remove("active");
    });
    // Reset Lights
    for (let i = 1; i <= 12; i++) {
        const light = document.getElementById(`light${i}`);
        if (light) {
            light.classList.remove('active');  // Entfernt das 'active' von allen Lichtern
        }
    }
};

//BPM Range-Slider
export function changeBpm(newBpm){
    bpmSpeed = newBpm
    rangeSliderOutput.innerHTML = bpmSpeed; //Update the current slider value
    if (isPlaying){
        clearInterval(playInterval); //ClearInterval = Stops current Intervall, playInterval is a reference to the interval in the startSequence-Function
        playSequence(); //Start Sequence new
    }
}
export function serviceWorkerAktiv(){
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register('../service-worker.js',{
            scope : './'
        })
    }
}