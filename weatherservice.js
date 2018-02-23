var API_KEY = '<AdminWUndergroundAPIKEY>';
var fetch = require ('node-fetch');
var get = require('lodash/get');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

class WeatherService {
	getTempByLocation(location, callback) {
    const [city, state] = location.split(', ');
    var currWeatherURL = 'http://api.wunderground.com/api/' + 
					API_KEY + '/conditions/q/' + 
					state + '/' + city + '.json';
	var prevWeatherUrl = 'http://api.wunderground.com/api/' + 
				API_KEY + '/almanac/q/' + 
				state + '/' + city + '.json';
    const urls = [
      fetchJSON(currWeatherURL),
      fetchJSON(prevWeatherUrl)
    ];

    return Promise.all(urls)
      .then(([currentWeather, previousWeather]) => {
        const currWeather = this.getCurrentTemp(currentWeather);
        const prevWeather = this.getPreviousTemp(previousWeather);
        callback([currWeather, prevWeather]);
      }).catch(error => {
        console.log('WU API error', error);
      });
  }

	getCurrentTemp (currWeather) {
		return {
			currTemp: get(currWeather, 'current_observation.temp_f'),
			currCondition: get(currWeather, 'current_observation.weather'),
			weatherImg: get(currWeather, 'current_observation.icon_url')
		};
	}

	getPreviousTemp (prevWeather) {
		return {
			avgHighTemp: get(prevWeather, 'almanac.temp_high.normal.F'),
			avgLowTemp: get(prevWeather, 'almanac.temp_low.normal.F')
		};
	}
}

module.exports = WeatherService;