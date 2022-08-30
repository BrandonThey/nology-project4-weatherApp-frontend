import "./WeatherCard.scss";

const WeatherCard = (props) => {
    const {weatherInfo} = props
    const convertKelvinToFahrenheit = (temp) => {
        return Math.round((temp - 273.15) * (9/5) + 32);
    }

    const convertTimezones = (offset) => {
        //create new date object for current location
        const currentTime = new Date();
        //convert offset to milliseconds
        const numberedoffset = Number(offset) * 1000;
        //convert to milliseconds and get UTC time by subtracting local time offset
        const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000);
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
    const locationDateTime = convertTimezones(weatherInfo.timezone);
    const highTemp = convertKelvinToFahrenheit(weatherInfo.main.temp_max)
    const currentTemp = convertKelvinToFahrenheit(weatherInfo.main.temp)
    const minTemp = convertKelvinToFahrenheit(weatherInfo.main.temp_min)
    const dateTimeString = 
    `${locationDateTime.getHours()}:${locationDateTime.getMinutes()}, ${getWeekDay(locationDateTime.getDay())}`
    return (
        <div className="weather-cards">
            <h2>{weatherInfo.name}, {dateTimeString}</h2>
            <h3>{currentTemp}{'\xB0'}</h3>
            <h3>{weatherInfo.weather[0].main}</h3>
            <img src={weatherInfo.weather[0].icon} alt="Weather icon" />
            <div className="high-low-info">
                <p>H: {highTemp}{'\xB0'}</p>
                <p>L: {minTemp}{'\xB0'}</p>
            </div>
            <div className="vis-humid-info">
                <p>Visibility: {Math.round(weatherInfo.visibility/1609.34)} Miles</p>
                <p>Humidity: {weatherInfo.main.humidity}%</p>
            </div>
        </div>
    )
}

export default WeatherCard;