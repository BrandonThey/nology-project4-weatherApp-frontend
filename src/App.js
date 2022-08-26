import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import WeatherCard from './containers/WeatherCard/WeatherCard';
import { useState} from 'react';
function App() {

  const [weatherInfo, setWeatherInfo] = useState();

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
      console.log("City not found")
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target[0].value;
    getWeatherInfo(searchTerm)
  }

  return (
    <div className="App">
      <SearchBar handleSubmit={handleSubmit}/>
      {weatherInfo && <WeatherCard weatherInfo={weatherInfo} />}
    </div>
  );
}

export default App;
