import './App.scss';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './containers/WeatherCard/WeatherCard';
import { useEffect, useState} from 'react';
function App() {

  const [weatherInfo, setWeatherInfo] = useState();
  const [oldWeatherInfo, setOldWeatherInfo] = useState();

  const apiKey = "69d0a94339a676369beaced8ff6ac0d7";
  let previousForecasts;
  
  const convertTimezones = (offset) => {
    //create new date object for current location
    const time = new Date();
    //convert offset to milliseconds
    const numberedoffset = Number(offset) * 1000;
    //convert to milliseconds and get UTC time by subtracting local time offset
    const utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    //creating a new date object for different city using offset and returning it
    return new Date(utc + numberedoffset)
  }

  const getWeekDay = (dayNumber) => {
    switch(dayNumber){
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        default:
            return "Saturday";
    }
}

  const getWeatherInfo = (searchTerm) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`)
    .then((respone) => {
      return respone.json();
    })
    .then((data) => {
      setWeatherInfo(data);
    })
    .catch(err => {
      console.log("City not found");
    })
  }

  const getOldWeathers = (cityName) => {
    fetch(`http://localhost:3030/api/weathers/${cityName}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setOldWeatherInfo(data);
    })
    .catch(err => {
      console.log("City not found");
    })
  }

  const postNewWeather = (weatherInfoToPost) => {
    const currentTime = convertTimezones(weatherInfoToPost.timezone);
    const dateTimeString = 
    `${currentTime.getHours()}:${currentTime.getMinutes()}, ${getWeekDay(currentTime.getDay())}`
    let weatherObject = {
      "time": dateTimeString,
      "name": weatherInfoToPost.name,
      "weather_main": weatherInfoToPost.weather[0].main,
      "weather_icon": weatherInfoToPost.weather[0].icon,
      "main_temp": weatherInfoToPost.main.temp,
      "main_temp_min": weatherInfoToPost.main.temp_min,
      "main_temp_max": weatherInfoToPost.main.temp_max,
      "main_humidity": weatherInfoToPost.main.humidity,
      "visibility": weatherInfoToPost.visibility,
      "timezone": weatherInfoToPost.timezone
    }

    console.log(weatherObject);

    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({weather: weatherObject})
    }
    fetch("http://localhost:3030/api/addWeather", requestOptions)
    .then(response=>response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target[0].value;
    getWeatherInfo(searchTerm)
  }

  useEffect(() => {
    console.log(weatherInfo);
    if(weatherInfo){
      getOldWeathers(weatherInfo.name);
      postNewWeather(weatherInfo);
    }
  }, [weatherInfo]);

  useEffect(() => {
    if(oldWeatherInfo){

      previousForecasts = oldWeatherInfo.map((oldWeather) => {
        console.log(oldWeather)
        return(
          <>
            {weatherInfo && oldWeatherInfo && <WeatherCard weatherInfo={oldWeather} convertTimezones={convertTimezones} getWeekDay={getWeekDay}/>}
          </>
        )
        })
  
      console.log(previousForecasts);
    }
  }, [oldWeatherInfo])

  return (
    <div className="App">
      <SearchBar handleSubmit={handleSubmit}/>
      {weatherInfo && <h2>Current Forecast:</h2>}
      {weatherInfo && <WeatherCard weatherInfo={weatherInfo} convertTimezones={convertTimezones} getWeekDay={getWeekDay}/>}
      {previousForecasts && <h2>Previous Forecasts:</h2>}
      {previousForecasts}
    </div>
  );
}

export default App;
