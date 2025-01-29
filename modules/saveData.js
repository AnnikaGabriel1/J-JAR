//import#################################
import {db} from "./db.js"
import { el, loadHTML, group } from "./lib.js";
import { stopSequence } from "./main.js";

//#######################################
//variables______________________________
const dbArea = el("#db-area");

//function_______________________________
function saveTitle(){
    el("#info").innerText="";
    const speed = parseInt(el("#rangeSlider").value); //saves range slider value of open project
    const title = el("#songtitel").value;

    //proof for content (optional: proof if title is already excisting)
    if (title.length <= 3){
        el("#info").innerText ="Please name your file (min. three characters)";
        return
    }

    //show title in gui
    el("#sample-titel").innerText = `Titel: ${title}`;

    //db Object
    const sample = {
        title : title,
        bpm : speed,
        id : Date.now(),
        checked : {}
    }

    //active pads
    group("#pads button").forEach((button)=>{
            const status = button.classList.contains("active");
         sample.checked[button.id] = false;
         if(status){
            sample.checked[button.id] = true;
         }
    })
    db.update(sample);

    //remove mask
    dbArea.innerHTML = "";
    dbArea.className = "area-passiv";
}

//export#################################
export async function showSaveArea(){
    // dbArea.innerHTML ="";
    dbArea.className ="area-aktiv";

    //stop sequencer column-color play
    const data = await loadHTML("data/save-data.html");
    dbArea.innerHTML = data;
    
    //stop sequencer columm animation (optional)
    stopSequence();

    //cancel
    el("#abbrechen").addEventListener("click", ()=>{
        dbArea.innerHTML ="";
        dbArea.className ="area-passiv";
    });

    el("#savesong").addEventListener("click", saveTitle)
}