//Import#########################################
import { db } from "./db.js";
import { el,create, loadHTML} from "./lib.js";
import { stopSequence,changeBpm } from "./main.js";

//###############################################
//variables______________________________________
const dbArea = el("#db-area");

//functions______________________________________
//Data Base Generator
function dbGenerator(data){
    const wrapper = create("div"); //Overlay-Div
    wrapper.id = "item-wrapper";
    data.forEach((item)=>{
        const div = create("div"); //"Data"-Div
        div.className = "item";
        wrapper.append(div);

        //title
        const span = create("span"); //Overlay"Data"-Title
        span.className = "titel";
        span.innerText = `Titel: ${item.title}`;
        div.append(span);

        //load button
        const loadBtn = create("button");
        loadBtn.className = "loader";
        loadBtn.innerText = "Load Sample";
        loadBtn.addEventListener("click", async ()=>{
            console.log(item)

            //Read values and transfer
            //read title
            const title = item.title;
            el("#sample-titel").innerText = `Current Title: ${title}`; //title in sequencer

            //speed value
            
            el("#rangeSlider").value = item.bpm;
            el("#sliderValue").innerText = item.bpm;
            changeBpm(item.bpm)            

            //read pad elements
            for(let i in item.checked){
                const pad = el (`#${i}`);
                const status = item.checked[i];
                if(status){
                    pad.classList.add("active");
                } else {
                    pad.classList.remove("active"); // Pad als inaktiv anzeigen
                }
            }
            deleteMask();
        });
        div.append(loadBtn);

        //delete button
        const delBtn = create ("button");
        delBtn.className = "delete";
        delBtn.innerText = "X";
        delBtn.addEventListener("click", ()=>{
            //delete from DB
            db.deleteItem(item.id)

            //delete parent div from DOM
            div.remove()
        });
        div.append (delBtn);
    });
    return wrapper;
}

//Delete Mask
const deleteMask = ()=>{
    dbArea.innerHTML ="";
    dbArea.className ="area-passiv";
}

//Export#########################################
//functions______________________________________
export async function showLoadArea(){
    //overlay
    dbArea.className = "area-aktiv";
    const data = await loadHTML("data/load-data.html");
    dbArea.innerHTML = data;

    //stop sequencer columm animation (optional)
    stopSequence();

    // //cancel button
    // el("#abbrechen").addEventListener("click", ()=>{
    //     deleteMask();
    // });

    //read db
    const dbData = await db.readAll();

    //check if db is empty
    if (!dbData.length){
        //user report
        el("#info_lesen").innerText = "Database is empty";
        return;
    }

    //show data
    el("#showsamples").append(dbGenerator(dbData));
}
