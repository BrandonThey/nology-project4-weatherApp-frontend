import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import { useState, useEffect } from 'react';
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
      console.log(data)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchTerm = event.target[0].value;
    console.log(searchTerm);
    getWeatherInfo(searchTerm)
  }

  return (
    <div className="App">
      <SearchBar handleSubmit={handleSubmit}/>
    </div>
  );
}

export default App;
