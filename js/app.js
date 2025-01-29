//Import#################################################################
import { el } from "../modules/lib.js";
import { playStopButton, clearAll, initializePadButtons, changeBpm,serviceWorkerAktiv } from "../modules/main.js";
import { showLoadArea } from "../modules/loadData.js";
import { showSaveArea } from "../modules/saveData.js";
import { recAudio} from "../modules/rec.js";
import { addButton } from "../modules/install.js";

//#######################################################################
//Call___________________________________________________________________
addButton();
serviceWorkerAktiv();
initializePadButtons();

//Event Listeners________________________________________________________
//Play Stop
el("#playStop").addEventListener("click", playStopButton)

//Clear All
el("#clearAll").addEventListener("click", clearAll)

//Range Slider
rangeSlider.addEventListener('input', (event) => {
    changeBpm(event.target.value); // Übergibt den Wert des Sliders an die changeBpm-Funktion
});

//load
el("#load").addEventListener("click", showLoadArea);

//save
el("#save").addEventListener("click", showSaveArea);

//write
el("#rec").addEventListener("click", function() {
    const buttonId = this.id; // ID des Rec-Buttons
    recAudio(buttonId); // buttonId korrekt übergeben
});


//Export#################################################################





