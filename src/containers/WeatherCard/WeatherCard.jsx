import "./WeatherCard.scss";

const WeatherCard = (props) => {
    const {weatherInfo, convertTimezones, getWeekDay} = props
    let highTemp, currentTemp, minTemp, weatherMain, weatherIcon, humidity, locationDateTime, dateTimeString;
    const convertKelvinToFahrenheit = (temp) => {
        return Math.round((temp - 273.15) * (9/5) + 32);
    }

    if(weatherInfo.main){
        highTemp = convertKelvinToFahrenheit(weatherInfo.main.temp_max)
        currentTemp = convertKelvinToFahrenheit(weatherInfo.main.temp)
        minTemp = convertKelvinToFahrenheit(weatherInfo.main.temp_min)
        weatherMain = weatherInfo.weather[0].main;
        weatherIcon = weatherInfo.weather[0].icon;
        humidity = weatherInfo.main.humidity;
        locationDateTime = convertTimezones(weatherInfo.timezone);
        dateTimeString = 
        `${locationDateTime.getHours()}:${locationDateTime.getMinutes()}, ${getWeekDay(locationDateTime.getDay())}`
    }else {
        highTemp = convertKelvinToFahrenheit(weatherInfo.main_temp_max)
        currentTemp = convertKelvinToFahrenheit(weatherInfo.main_temp)
        minTemp = convertKelvinToFahrenheit(weatherInfo.main_temp_min)
        weatherMain = weatherInfo.weather_main;   
        weatherIcon = weatherInfo.weather_icon;
        humidity = weatherInfo.main_humidity;
        locationDateTime = convertTimezones(weatherInfo.timezone, weatherInfo.time);
        dateTimeString = weatherInfo.time;
    }

    return (
        <div className="weather-cards">
            <h2>{weatherInfo.name}</h2>
            <h2>{dateTimeString}</h2>
            <h3>{currentTemp}{'\xB0'}</h3>
            <h3>{weatherMain}</h3>
            <img src={`http://openweathermap.org/img/w/${weatherIcon}.png`} alt="Weather icon" />
            <div className="high-low-info">
                <p>H: {highTemp}{'\xB0'}</p>
                <p>L: {minTemp}{'\xB0'}</p>
            </div>
            <div className="vis-humid-info">
                <p>Visibility: {Math.round(weatherInfo.visibility/1609.34)} Miles</p>
                <p>Humidity: {humidity}%</p>
            </div>
        </div>
    )
}

export default WeatherCard;