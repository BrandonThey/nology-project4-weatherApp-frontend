import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './containers/WeatherCard/WeatherCard';
import { useEffect, useState} from 'react';
function App() {

  const [weatherInfo, setWeatherInfo] = useState();
  const [oldWeatherInfo, setOldWeatherInfo] = useState();

  const apiKey = "69d0a94339a676369beaced8ff6ac0d7";
  
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

  const getOldWeathers = (cityID) => {
    fetch(`http://localhost:3030/api/weathers/${cityID}`)
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
    let weatherObject = {
      "id": weatherInfoToPost.id,
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
      getOldWeathers(weatherInfo.id);
      postNewWeather(weatherInfo);
    }
  }, [weatherInfo]);

  useEffect(() => {
    console.log(oldWeatherInfo);
  },[oldWeatherInfo]);

  return (
    <div className="App">
      <SearchBar handleSubmit={handleSubmit}/>
      {weatherInfo && <WeatherCard weatherInfo={weatherInfo} />}
    </div>
  );
}

export default App;
