// set global variable
let newObject
let newerObject
let pixabayObject
let location
// 
function checkCity(cityInput){
   var letters = /^[A-Za-z]+$/;
   if(cityInput.match(letters)){
        return true;
    } else {
        alert("Please input only letter for City");
        return false;
    }
}
// sending a city name and country to get info


async function handleSubmit(event) {
    // halt refress
    event.preventDefault();
    // make sure all outcome sections are cleared or clear all prior search outcomes
    const imageNode = document.getElementById("images");
    imageNode.innerHTML = '';
    const weatherNode = document.getElementById("weather-results");
    weatherNode.innerHTML = '';
    const myNode = document.getElementById("results");
    myNode.innerHTML = '';
    // grab submitted city name text
    let formText = document.getElementById('city').value
    let check = checkCity(formText)
    console.log('checking', check)
    // if there is text in the city search to submit run api fetch
    if(check) {
        await postData('http://localhost:8080/geonames-api', {url: formText});
        await fetch('/geonames-api')
        .then(response => response.json())
        .then(json => newObject = json);
        console.log('newObject', newObject)
        setHtml(newObject)
        
    // if check is bad alert and populate default failed output
    } else {
        alert('not a valid URL dude.');
    }
}
async function locationSelect(object) {
    // selected location initiates call for image and weather forecast
    // clear prior images and forecast results if a new location is selected from prior search
    const weatherNode = document.getElementById("weather-results");
    weatherNode.innerHTML = '';
    const imageNode = document.getElementById("images");
    imageNode.innerHTML = '';
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
const setHtml = (newObject) => {
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
// create html to show weather forcast from selection
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
// create images from pixabay in ui
const setPixabayHtml = (pixabayObject) => {
    if (document.getElementById("Image")){
    const imageNode = document.getElementById("Image");
    imageNode.innerHTML = '';
    }
    let picsArray = pixabayObject.hits
    let imageIndex = Math.floor(Math.random() * picsArray.length)
    var para = document.createElement("img");
    para.id = `Image`;
    para.className = 'imageBox'
    var node = document.createTextNode(`Image-${location}`);
    para.appendChild(node);

    var element = document.getElementById("images");
    element.appendChild(para);
    document.getElementById(para.id).src = picsArray[imageIndex].largeImageURL;
}
export { handleSubmit }