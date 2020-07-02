var express = require('express')
var app = express()
const fetch = require('node-fetch');
var exphbs = require('express-handlebars');

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Use the 'public' directory for serving static files
app.use(express.static('public'))

function roundToTwoDecimals(x) {
    return Number.parseFloat(x).toFixed(2);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get('/', (req, res) => {
    // Get the 'city-name' from the request's query
    let city_list = ["New York", "London", "Mumbai", "Tokyo"]
    let apiKey = ""
    
    // Make an http request to the openweathermap's API
    let data = [];
    var fetches = []

    console.log("Making api calls")
    city_list.forEach((city) => {
        let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey
        
        fetches.push(
            fetch(url)
                .then(res => res.json())
                .then((body) => {
                    console.log("Success")
                    console.log(body)

                    response_data = {
                        'city-name' : body.name,
                        'weather-main' : body['weather'][0]['main'],
                        'weather-description' : capitalizeFirstLetter(body['weather'][0]['description']),
                        'weather-icon' : body['weather'][0]['icon'],
                        'main_temp' : roundToTwoDecimals(body.main.temp - 273.15), 
                        'main-pressure' : body.main.pressure,
                        'main-humidity' : body.main.humidity,
                        'main-temp_min' : roundToTwoDecimals(body.main.temp_min - 273.15),
                        'main-temp_max' : roundToTwoDecimals(body.main.temp_max - 273.15),
                        'wind-speed' : body.wind.speed,
                        'wind-direction' : body.wind.deg,
                        'country' : body.sys.country,
                        'sunrise' : (new Date(body.sys.sunrise)).toTimeString(),
                        'sunset' : (new Date(body.sys.sunset)).toTimeString(),
                        //℃=K-273.15
                    }
                    data.push(response_data)

                })
                .catch((err) => {
                    console.log("Failure")
                    console.log(err); 
                    response_data = {
                        'error' : "Some Error"
                    }
                    res.render('home', response_data)
                })
        );
    })
    Promise.all(fetches).then(function() {
        console.log("Done making api calls")
        console.log("Data = ")
        console.log(data)
        res.render('home', {'cities_data_list': data})        
    });

})

app.get('/city', (req, res) => {
    // Get the 'city-name' from the request's query
    var city = req.query['city-name']
    var apiKey = ""

    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey
    console.log("URL = ", url)

    var data = {};

    // Make an http request to the openweathermap's API
    fetch(url)
        .then(res => res.json())
        .then((body) => {
        
            console.log("Success")
            console.log(body)

            data = {
                'city-name' : body.name,
                'weather-main' : body['weather'][0]['main'],
                'weather-description' : capitalizeFirstLetter(body['weather'][0]['description']),
                'weather-icon' : body['weather'][0]['icon'],
                'main_temp' : roundToTwoDecimals(body.main.temp - 273.15), 
                'main-pressure' : body.main.pressure,
                'main-humidity' : body.main.humidity,
                'main-temp_min' : roundToTwoDecimals(body.main.temp_min - 273.15),
                'main-temp_max' : roundToTwoDecimals(body.main.temp_max - 273.15),
                'wind-speed' : body.wind.speed,
                'wind-direction' : body.wind.deg,
                'country' : body.sys.country,
                'sunrise' : (new Date(body.sys.sunrise)).toTimeString(),
                'sunset' : (new Date(body.sys.sunset)).toTimeString(),
                //℃=K-273.15
            }
            res.render('weather-details', data)

        })
        .catch((err) => {
            console.log("Failure")
            console.log(err); 
            data = {
                'error' : "Some Error"
            }
            res.render('weather-details', data)
        })
    
})

app.listen(3000, () => {
    console.log("Server started, listening on port 3000")
})