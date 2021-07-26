

window.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector('#load-data-button').onclick = loadData;
})

document.querySelector("#data-in-new-window-button").onclick = openWindow;

function openWindow(){
    window.open('./tagok',"_blank")
}

async function loadData() {
    const response = await fetch('/members');
    const jsonResponse = await response.json();

    let content = "<thead><th>nr</th><th>név</th><th>kor</th><th>város</th><th>faj</th></thead>";
    for (k of jsonResponse) {
        content += `
        <tr><td>${k.id}.</td>
        <td>${k.name}</td>
        <td>${k.age}</td>
        <td>${k.city}</td>
        <td>${k.species}</td>
        <td><button id='${k.id}' class="btn btn-secondary btn-small" onclick="myModify(event)">módosít</button></td>
        <td><button id='${k.id}' class="btn btn-secondary btn-small" onclick="myDelete(event)">töröl</button></td></tr>
        `
    }
    document.querySelector("#data-content").innerHTML = content;
}



async function myDelete(event) {
    const myId = event.path[0].id;
    const body = { id: myId };
    myBody = await JSON.stringify(body);

    const fetchInit = {
        method: 'DELETE',
        headers: {
            "content-type": "application/json",
        },
        body: myBody
    }


    const response = await fetch('/members', fetchInit);
    if (response.status == 200) {
        await loadData();
    }
}

let myId = "";
let myName = "";
let myAge = "";
let myCity = "";
let buttonId = "";
let mySpecies = "";

async function myModify(event) {
    myId = event.path[0].id;
    myName = event.path[2].children[1].innerHTML;
    myAge = event.path[2].children[2].innerHTML;
    myCity = event.path[2].children[3].innerHTML;
    mySpecies = event.path[2].children[4].innerHTML;
    buttonId = Number(myId) + 1;
    buttonId = String(buttonId);
    document.querySelectorAll('#data-content tr')[myId].innerHTML = `
    <td>${myId}</td>
    <td><input type="text" id="newName" value='${myName}'></td>
    <td><input type="number" id="newAge" value='${myAge}'></td>
    <td><input type="text" id="newCity" value='${myCity}'></td>
    <td>
    <select id="newSpecies">
        <option
        ${mySpecies == 'human' ? 'selected' : ''}
        value="human">human</option>
        <option 
        ${mySpecies == 'alien' ? 'selected' : ''}
        value="alien">alien</option>
        <option
        ${mySpecies == 'intruder' ? 'selected' : ''}
        value="intruder">intruder</option>
        <option
        ${mySpecies == 'reptilian' ? 'selected' : ''}
        value="reptilian">reptilian</option>
        <option 
        ${mySpecies == 'kiborg' ? 'selected' : ''}
        value="kiborg">kiborg</option>
    </select>
    </td>
    <td><button id='${buttonId}' class="btn btn-primary btn-small" onclick="changeData()">elküld</button></td>
    <td><button id='${buttonId}' class="btn btn-primary btn-small" onclick="cancelButton()">mégse</button></td>
    `;
}

function cancelButton() {
    buttonId = Number(buttonId) - 1;
    buttonId = String(buttonId);
    document.querySelectorAll('#data-content tr')[myId].innerHTML = `
    <td>${myId}</td>
    <td>${myName}</td>
    <td>${myAge}</td>
    <td>${myCity}</td>
    <td>${mySpecies}</td>
    <td><button id='${buttonId}' class="btn btn-primary btn-small" onclick="myModify(event)">módosít</button></td>
    <td><button id='${buttonId}' class="btn btn-primary btn-small" onclick="myDelete(event)">töröl</button></td>
    `;
}

async function changeData() {

    const newName = document.querySelector('#newName').value;
    const newAge = document.querySelector('#newAge').value;
    const newCity = document.querySelector('#newCity').value;
    const newSpecies = document.querySelector('#newSpecies').value;
    let myBody = { name: `${newName}`, age: `${newAge}`, city: `${newCity}`, id: `${myId}`, species: `${newSpecies}` };
    myBody = await JSON.stringify(myBody);

    const fetchInit = {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
        },
        body: myBody
    }

    const response = await fetch('/members', fetchInit);
    if (response.status == 200) {
        await loadData();
    }

    form.reset();
}


//document.querySelector('#send-data-button').onclick = sendNewData;
const form = document.querySelector('#members-data-form');
document.querySelector("#members-data-form").onsubmit = sendNewData2;


async function sendNewData2(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    const age = event.target.elements.age.value;
    const city = event.target.elements.city.value;
    const species = event.target.elements.species.value;

    let myBody = { name: `${name}`, age: `${age}`, city: `${city}`, species: `${species}` };
    myBody = await JSON.stringify(myBody)

    const fetchInit = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(myBody)
    }

    const response = await fetch('/members', fetchInit);
    if (response.status == 200) {
        await loadData();
    }

    form.reset();
}

async function sendNewData(event) {
    event.preventDefault();
    const name = document.querySelector('#name-input').value;
    const age = document.querySelector('#age-input').value;
    const city = document.querySelector('#city-input').value;
    const species = document.querySelector('#species-input').value;

    let myBody = { name: `${name}`, age: `${age}`, city: `${city}`, species: `${species}` };
    myBody = await JSON.stringify(myBody)

    const fetchInit = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(myBody)
    }

    const response = await fetch('/members', fetchInit);
    if (response.status == 200) {
        await loadData();
    }

    form.reset();
}

