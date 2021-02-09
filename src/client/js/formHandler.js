// import { checker } from './checker.js'
// set global variable
let newObject
let newerObject
let pixabayObject
let location
// 

// sending a city name and country to get info

// 



// 
async function handleSubmit(event) {
    console.log('DAM FUNCTION')

    // halt refress
    event.preventDefault();
    // grab submitted url text
    const imageNode = document.getElementById("images");
    imageNode.innerHTML = '';
    const weatherNode = document.getElementById("weather-results");
    weatherNode.innerHTML = '';
    const myNode = document.getElementById("results");
    myNode.innerHTML = '';
    let formText = document.getElementById('url').value
    // run url general expression check
    // const check = checker(formText)
    // if check is good, run post and get calls. then post outcome to ui
    if(formText) {
        await postData('http://localhost:8080/geonames-api', {url: formText});
        await fetch('/geonames-api')
        .then(response => response.json())
        .then(json => newObject = json);
        console.log('newObject', newObject)
        setHtml(newObject)
        
    // if check is bad alert and populate default failed output
    } else {
        alert('not a valid URL dude.');
        const errorOutcome = { 
            status: 'NA',
            model: 'NA',
            score_tag: 'NONE',
            agreement: "NA",
            subjectivity: "NA",
            confidence: "NA",
            irony: "NA"
        } 
        setHtml(errorOutcome)
    }
}
async function locationSelect(object) {
    // selected location initiates call for image and weather forecast
    // clear prior images and forecast results if a new location is selected from prior search
    const weatherNode = document.getElementById("weather-results");
    weatherNode.innerHTML = '';
    const imageNode = document.getElementById("images");
    imageNode.innerHTML = '';
    console.log('inside locationselect', object)
    location = object.placeName
    // selected location sent to pixabay and then weather bit api
    if(object) {
        await postData('http://localhost:8080/pixabay-api', {url: object.placeName});
        await fetch('/pixabay-api')
        .then(response => response.json())
        .then(json => pixabayObject = json);
        console.log('from endpoint', pixabayObject)
        setPixabayHtml(pixabayObject)
        // weather api
        await postData('http://localhost:8080/weather-bit-api', {url: object});
        await fetch('/weather-bit-api')
        .then(response => response.json())
        .then(json => newerObject = json);
        console.log('from endpoint', newerObject)
        setWeatherHtml(newerObject)
        
    // if check is bad alert and populate default failed output
    } else {
        alert('not a valid location.');
    }
}

// post meaningCloud api results to endpoint
const postData = async (url = "", data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    try {
        return response;
    } catch (error) {
        console.log('error', error);
    }
};
// set positive and negative results to ui
const setHtml = (newObject, dateInput) => {
    console.log(newObject.length)
    for (let i = 0; i < newObject.length; i++) {
        console.log(newObject[i])
        var para = document.createElement("button");
        para.id = `Option ${i+1}`;
        var node = document.createTextNode(`${newObject[i].adminName1}, ${newObject[i].placeName}, ${newObject[i].postalcode}`);
        para.appendChild(node);
        // para.setAttribute('onclick', locationSelect);

        para.onclick = function() {locationSelect(newObject[i])};
        var element = document.getElementById("results");
        element.appendChild(para);
    }
}

const setWeatherHtml = (newerObject) => {
    console.log(newerObject.length)
    let selected = document.getElementById("multiday").checked;
    console.log('selector in function', selected)
    let dateInput = document.getElementById('datepicker').value
    let month = dateInput[0]+ dateInput[1]
    let day = dateInput[3] + dateInput[4]
    let year = dateInput[6] + dateInput[7] + dateInput[8] + dateInput[9]
    let newDate = year + '-' + month + '-' + day
    console.log(month)
    for (let i = 0; i < newerObject.length; i++) {
        if (newerObject[i].valid_date === newDate && selected === true) {
            for (let j = i - 1; j <= i+1; j++) {
                var para = document.createElement("p");
                para.id = 'wResult';
                var node = document.createTextNode(`Day-${newerObject[j].valid_date}, low temp-${newerObject[j].low_temp}, high temp-${newerObject[j].max_temp}`);
                para.appendChild(node);
                var element = document.getElementById("weather-results");
                element.appendChild(para);
            }
        } else {
            if (newerObject[i].valid_date === newDate && selected !== true) {
            console.log('in else', i)
                var para = document.createElement("p");
                para.id = 'wResult';
                var node = document.createTextNode(`Day-${newerObject[i].valid_date}, low temp-${newerObject[i].low_temp}, high temp-${newerObject[i].max_temp}`);
                para.appendChild(node);
                var element = document.getElementById("weather-results");
                element.appendChild(para);
            }
        } 
    }
}
// const setNewLine = () => {
//     var newLine = document.createElement('br');
//     var element = document.getElementById("weather-results");
//     element.appendChild(newLine);
// }
const setPixabayHtml = (pixabayObject) => {
    console.log(pixabayObject)
    if (document.getElementById("Image")){
    const imageNode = document.getElementById("Image");
    imageNode.innerHTML = '';
    }
    let picsArray = pixabayObject.hits
    let imageIndex = Math.floor(Math.random() * picsArray.length)
    // for (let i = 0; i < picsArray.length; i++) {
        // console.log(picsArray[i])
        // console. log(picsArray[i].user)
    var para = document.createElement("img");
    para.id = `Image`;
    para.className = 'imageBox'
    var node = document.createTextNode(`Image-${location}`);
    para.appendChild(node);

    var element = document.getElementById("images");
    element.appendChild(para);
    document.getElementById(para.id).src = picsArray[imageIndex].largeImageURL;
    // }
}
// export function handle
export { handleSubmit }