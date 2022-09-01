import './App.scss';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './containers/WeatherCard/WeatherCard';
import { useEffect, useState} from 'react';

function App() {

  //Creating use states for the weather information fetched from the openweathermap api, 
  //old weather information, fetched from my api thats linked to my mysql database
  //and for previous forecasts, a trimmed down version of old weather info
  const [weatherInfo, setWeatherInfo] = useState();
  const [oldWeatherInfo, setOldWeatherInfo] = useState();
  const [previousForecasts, setPreviousForecasts] = useState();
  //my api key obtained from openweathermap
  const apiKey = "69d0a94339a676369beaced8ff6ac0d7";
  
  //function that converts the current time to different location's timezone based on openweathermap's stored timezone offset
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

  //a simple function that gets the weekday as a string based on the current numbered day from dateTime library
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

  //fetching openweathermap weather information based on the user inputted city
  const getWeatherInfo = (searchTerm) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apiKey}`)
    .then((respone) => {
      return respone.json();
    })
    .then((data) => {
      if(data.hasOwnProperty("message")){
        alert("City not found");
      }
      else{
        setWeatherInfo(data);
      }
    })
  }

  //fetching my stored weather information based on the user inputted city
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

  //posting a new weather object to my api to be stored in the mysql database
  const postNewWeather = (weatherInfoToPost) => {
    //first gets the current time of the location by converting my CST time to the locations time
    const currentTime = convertTimezones(weatherInfoToPost.timezone);
    //formatting the date and time into a easily readible string
    const dateTimeString = 
    `${currentTime.getHours()}:${currentTime.getMinutes()}, ${getWeekDay(currentTime.getDay())}`
    //forming the weather object based on information that is required for the app
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

    //forming a post request json document and posting with it
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

  //function that handles the user submitted city name by calling the api fetch function
  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target[0].value;
    getWeatherInfo(searchTerm)
  }

  //every time that weatherInfo is updated we want to retrieve any previous information and post that new weatherinformation to the api/database 
  useEffect(() => {
    if(weatherInfo){
      getOldWeathers(weatherInfo.name);
      postNewWeather(weatherInfo);
    }
  }, [weatherInfo]);

  //every time that oldWeatherInfo is updated we map it to form html elements and trim down any excess weather information
  useEffect(() => {
    if(oldWeatherInfo){

      const holder = oldWeatherInfo.slice(0).reverse().map((oldWeather) => {
        return(
          <>
            {weatherInfo && oldWeatherInfo && <WeatherCard weatherInfo={oldWeather} convertTimezones={convertTimezones} getWeekDay={getWeekDay}/>}
          </>
        )
      })

      if(holder.length > 6){
        setPreviousForecasts(holder.slice(0,6))
      }
      else{
        setPreviousForecasts(holder);
      }
    }
  }, [oldWeatherInfo])

  return (
    <div className="App">
      <h1>My Weather App!</h1>
      <SearchBar handleSubmit={handleSubmit}/>
      {weatherInfo && <h2>Current Forecast:</h2>}
      {weatherInfo && <WeatherCard weatherInfo={weatherInfo} convertTimezones={convertTimezones} getWeekDay={getWeekDay}/>}
      {previousForecasts && <h2>Previous Forecasts:</h2>}
      <div className='previous-forecasts'>
        {previousForecasts}
      </div>
    </div>
  );
}

export default App;
