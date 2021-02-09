// whole bunch of server needed stuff ;-)
var path = require('path')
const express = require('express')
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser')
const mockAPIResponse = require('./mockAPI.js')
const fetch = require("node-fetch");
const app = express()
app.use("src/client", express.static('src/client'))
app.use(express.static('dist'))

const pixabayUrl = 'https://pixabay.com/api/?key=';
const pixabayEx = "https://pixabay.com/api/?key=19713764-7a07d06ca6d36cae94f0647fb&q=yellow+flowers&image_type=photo"
const geonamesUrl = process.env.geonames_api
const weatherbitKey = process.env.weatherbit_key
const pixabayKey = process.env.pixabay_key
const geonamesKey = process.env.geonames_key
const weatherbitUrl = `https://api.weatherbit.io/v2.0/forecast/daily?`;
const cors = require('cors');
// set global variable to be used in server
let weatherbitOutcome = ''
let pixabayOutcome = ''
let geonamesOutcome = ''
app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
// the single page app page
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})
// posts meaningCloud output to endpoint
app.post('/weather-bit-api', async function(req, res) {
    // &lat=38.123&lon=-78.543
    console.log('inside server post weather', req.body.url)
    userInput = req.body.url;
    const apiURL = `${weatherbitUrl}&lat=${userInput.lat}&lon=${userInput.lng}&key=${weatherbitKey}`
    const response = await fetch(apiURL)
    const responseData = await response.json()
    console.log('DAM', responseData)
    weatherbitOutcome = responseData.data
    res.send(weatherbitOutcome)
})

app.post('/pixabay-api', async function(req, res) {
    userInput = req.body.url;
    console.log('pixabay', userInput)
    const apiURL = `${pixabayUrl}${pixabayKey}&q=${userInput}&image_type=photo`
    const response = await fetch(apiURL)
    const responseData = await response.json()
    pixabayOutcome = responseData
    console.log('pbay', responseData.hits.length)
    res.send(pixabayOutcome)
})

app.post('/geonames-api', async function(req, res) {
    userInput = req.body.url;
    console.log('damm body text', userInput)
    const apiURL = `${geonamesUrl}${userInput}&username=${geonamesKey}`
    const response = await fetch(apiURL)
    const responseData = await response.json()
    console.log(responseData)
    console.log(responseData.postalcodes)
    console.log(responseData.postalcodes.length)
    geonamesOutcome = responseData.postalcodes
    res.send(responseData)
})
// fetch the outcome from meaningCloud output
app.get('/weather-bit-api', function (req, res) {
    res.send(weatherbitOutcome)
})
app.get('/pixabay-api', function (req, res) {
    res.send(pixabayOutcome)
})
app.get('/geonames-api', function (req, res) {
    res.send(geonamesOutcome)
})
// designates what port the app will listen to for incoming requests
app.listen(8080, function () {
    console.log('Example app listening on port 8080!')
})
// old from past exercise.. good go.. but it just looks good here
app.get('/test', function (req, res) {
    res.send(mockAPIResponse)
})
