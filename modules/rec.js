//Import#########################################
import {db} from "./db.js"
import { el} from "./lib.js"

//###############################################
//variables______________________________________
let flag = false; //state of recording
let mediaRec; //media recorder as global variable
let audioData = []; //saves audio data-chunks
let audioBlob; // Speichert das endgültige Audio-Blob

//function____________________________________________
//check user mic
function checkMic(){
    return new Promise((resolve)=>{resolve(navigator.mediaDevices.getUserMedia({
        audio:  true, //start mic
        video:  false //don't start camera
    }))})
}

//rec-light
function recLight(isActive) {
    const recLight = el("#rec-light");
    if (isActive) {
        recLight.className = "rec-light active"; //Rec-light is active
    } else {
        recLight.className = "rec-light"; //Rec-light is passive
    }
}


//Export#########################################
//function_______________________________________
//record and save audio
export async function recAudio(buttonId) {
    if (!mediaRec) { //Proof if MediaRecorder got initialized
        const mediaStreamObj = await checkMic();
        mediaRec = new MediaRecorder(mediaStreamObj);

        //if audiodata excist -> get pushed into array "audio-data"
        mediaRec.ondataavailable = function (event) {
            audioData.push(event.data);
        };
    }

    //if stop recording, blob gets saved
    mediaRec.onstop = function () {
        flag = false; //stops recording
        recLight(false); //deactivates rec-light
        el("#rec").textContent = "Rec"; //reset button text to "rec"

        //Creates audio-blob and saves it
        audioBlob = new Blob(audioData);
        console.log("Speichere audioBlob in DB mit buttonId:", buttonId);
        if (typeof buttonId === 'string') {
            db.writeItem(buttonId, audioBlob); //saves blob in DB with button-id as key (rec)
            //Connect recorded Audio with Pads an mark it as recorded
            const padButton = el(`#${buttonId}`);
            if (padButton) {
                padButton.classList.add("recorded"); // Markiere das Pad als "recorded"
                //saves blob to pad
                padButton.dataset.audioBlob = URL.createObjectURL(audioBlob); 
            }
        } else {
            console.error("buttonId ist ungültig:", buttonId);
        }
        audioData = []; //Reset Array
    }

    //Starts Recording/Stops Recording
    if (!flag) {
        //Starts Recording
        mediaRec.start();
        recLight(true); //Activate Rec-Light
        el("#rec").textContent = "Write"; //Change inner Button-Text to "Write"
        flag = true; //recoding on air
    } else {
        //Stops Recording
        mediaRec.stop();
    }
}