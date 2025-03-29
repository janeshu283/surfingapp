// src/services/waveApiService.js
import axios from 'axios';

/**
 * 波予測APIとの連携サービス
 */
export const waveApiService = {
  /**
   * Stormglass APIから波予測データを取得
   * @param {number} lat - 緯度
   * @param {number} lng - 経度
   * @param {string} apiKey - Stormglass API Key
   * @returns {Promise} - 波予測データ
   */
  async getStormglassData(lat, lng, apiKey) {
    try {
      const params = {
        'lat': lat,
        'lng': lng,
        'params': 'waveHeight,wavePeriod,waveDirection,windSpeed,windDirection',
        'source': 'noaa'
      };
      
      const response = await axios.get('https://api.stormglass.io/v2/weather/point', {
        params: params,
        headers: {
          'Authorization': apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Stormglass data:', error);
      throw error;
    }
  },

  /**
   * Surfline APIから波予測データを取得
   * @param {string} spotId - サーフスポットID
   * @returns {Promise} - 波予測データ
   */
  async getSurflineData(spotId) {
    try {
      const response = await axios.get(`https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=${spotId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching Surfline data:', error);
      throw error;
    }
  },

  /**
   * OpenWeatherMap APIから気象データを取得
   * @param {number} lat - 緯度
   * @param {number} lon - 経度
   * @param {string} apiKey - OpenWeatherMap API Key
   * @returns {Promise} - 気象データ
   */
  async getOpenWeatherMapData(lat, lon, apiKey) {
    try {
      const response = await axios.get('https://api.openweathermap.org/data/2.5/onecall', {
        params: {
          lat: lat,
          lon: lon,
          exclude: 'minutely,alerts',
          units: 'metric',
          appid: apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching OpenWeatherMap data:', error);
      throw error;
    }
  },

  /**
   * Windy APIから風と波のデータを取得
   * @param {number} lat - 緯度
   * @param {number} lon - 経度
   * @param {string} apiKey - Windy API Key
   * @returns {Promise} - 風と波のデータ
   */
  async getWindyData(lat, lon, apiKey) {
    try {
      const response = await axios.get('https://api.windy.com/api/point-forecast/v2', {
        params: {
          lat: lat,
          lon: lon,
          model: 'gfs',
          parameters: ['wind', 'waves'],
          key: apiKey
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching Windy data:', error);
      throw error;
    }
  },

  /**
   * 複数のAPIからのデータを統合して総合的な波予測を提供
   * @param {number} lat - 緯度
   * @param {number} lng - 経度
   * @param {object} apiKeys - 各APIのキー
   * @returns {Promise} - 統合された波予測データ
   */
  async getIntegratedForecast(lat, lng, apiKeys) {
    try {
      // 並行して複数のAPIからデータを取得
      const [stormglassData, openWeatherData] = await Promise.all([
        this.getStormglassData(lat, lng, apiKeys.stormglass).catch(() => null),
        this.getOpenWeatherMapData(lat, lng, apiKeys.openWeatherMap).catch(() => null)
      ]);
      
      // 取得したデータを統合
      return this.integrateData(stormglassData, openWeatherData);
    } catch (error) {
      console.error('Error getting integrated forecast:', error);
      throw error;
    }
  },
  
  /**
   * 複数のAPIからのデータを統合
   * @param {object} stormglassData - Stormglass APIからのデータ
   * @param {object} openWeatherData - OpenWeatherMap APIからのデータ
   * @returns {object} - 統合されたデータ
   */
  integrateData(stormglassData, openWeatherData) {
    // データ統合ロジック
    const integrated = {
      hourly: [],
      daily: []
    };
    
    // Stormglassデータの処理
    if (stormglassData && stormglassData.hours) {
      stormglassData.hours.forEach(hour => {
        const hourData = {
          time: new Date(hour.time),
          waveHeight: hour.waveHeight?.noaa,
          wavePeriod: hour.wavePeriod?.noaa,
          waveDirection: hour.waveDirection?.noaa,
          windSpeed: hour.windSpeed?.noaa,
          windDirection: hour.windDirection?.noaa
        };
        
        integrated.hourly.push(hourData);
      });
    }
    
    // OpenWeatherMapデータの処理
    if (openWeatherData && openWeatherData.daily) {
      openWeatherData.daily.forEach(day => {
        const dayData = {
          date: new Date(day.dt * 1000),
          temperature: {
            min: day.temp.min,
            max: day.temp.max
          },
          weather: day.weather[0].main,
          weatherDescription: day.weather[0].description,
          windSpeed: day.wind_speed,
          windDirection: day.wind_deg,
          precipitation: day.pop
        };
        
        integrated.daily.push(dayData);
      });
    }
    
    return integrated;
  }
};

export default waveApiService;
