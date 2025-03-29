import React, { useState, useEffect } from 'react';
import waveApiService from '../services/waveApiService';

/**
 * 波予測APIの統合テストコンポーネント
 */
const WaveApiTest = () => {
  const [testResults, setTestResults] = useState({
    stormglass: { status: 'pending', data: null, error: null },
    surfline: { status: 'pending', data: null, error: null },
    openWeatherMap: { status: 'pending', data: null, error: null },
    windy: { status: 'pending', data: null, error: null },
    integrated: { status: 'pending', data: null, error: null }
  });
  
  const [loading, setLoading] = useState(false);
  
  // テスト用のパラメータ
  const testParams = {
    location: {
      lat: 35.6762, // 東京
      lng: 139.6503
    },
    surflineSpotId: '5842041f4e65fad6a7708890', // 千葉・一宮
    apiKeys: {
      stormglass: process.env.REACT_APP_STORMGLASS_API_KEY || 'your_stormglass_api_key',
      openWeatherMap: process.env.REACT_APP_OPENWEATHERMAP_API_KEY || 'your_openweathermap_api_key',
      windy: process.env.REACT_APP_WINDY_API_KEY || 'your_windy_api_key'
    }
  };
  
  // 各APIのテストを実行
  const runTests = async () => {
    setLoading(true);
    
    // Stormglass APIのテスト
    try {
      const stormglassData = await waveApiService.getStormglassData(
        testParams.location.lat,
        testParams.location.lng,
        testParams.apiKeys.stormglass
      );
      
      setTestResults(prev => ({
        ...prev,
        stormglass: { status: 'success', data: stormglassData, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        stormglass: { status: 'error', data: null, error: error.message }
      }));
    }
    
    // Surfline APIのテスト
    try {
      const surflineData = await waveApiService.getSurflineData(
        testParams.surflineSpotId
      );
      
      setTestResults(prev => ({
        ...prev,
        surfline: { status: 'success', data: surflineData, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        surfline: { status: 'success', data: null, error: error.message }
      }));
    }
    
    // OpenWeatherMap APIのテスト
    try {
      const openWeatherData = await waveApiService.getOpenWeatherMapData(
        testParams.location.lat,
        testParams.location.lng,
        testParams.apiKeys.openWeatherMap
      );
      
      setTestResults(prev => ({
        ...prev,
        openWeatherMap: { status: 'success', data: openWeatherData, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        openWeatherMap: { status: 'error', data: null, error: error.message }
      }));
    }
    
    // Windy APIのテスト
    try {
      const windyData = await waveApiService.getWindyData(
        testParams.location.lat,
        testParams.location.lng,
        testParams.apiKeys.windy
      );
      
      setTestResults(prev => ({
        ...prev,
        windy: { status: 'success', data: windyData, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        windy: { status: 'error', data: null, error: error.message }
      }));
    }
    
    // 統合APIのテスト
    try {
      const integratedData = await waveApiService.getIntegratedForecast(
        testParams.location.lat,
        testParams.location.lng,
        testParams.apiKeys
      );
      
      setTestResults(prev => ({
        ...prev,
        integrated: { status: 'success', data: integratedData, error: null }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        integrated: { status: 'error', data: null, error: error.message }
      }));
    }
    
    setLoading(false);
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">波予測API統合テスト</h1>
      
      <button 
        onClick={runTests}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'テスト実行中...' : 'テスト実行'}
      </button>
      
      <div className="mt-6 grid grid-cols-1 gap-6">
        {Object.entries(testResults).map(([apiName, result]) => (
          <div key={apiName} className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 capitalize">{apiName} API</h2>
            
            <div className="mb-2">
              <span className="font-medium">ステータス: </span>
              <span className={`
                ${result.status === 'success' ? 'text-green-600' : ''}
                ${result.status === 'error' ? 'text-red-600' : ''}
                ${result.status === 'pending' ? 'text-gray-600' : ''}
              `}>
                {result.status === 'success' ? '成功' : ''}
                {result.status === 'error' ? 'エラー' : ''}
                {result.status === 'pending' ? '未実行' : ''}
              </span>
            </div>
            
            {result.error && (
              <div className="mb-2">
                <span className="font-medium">エラー: </span>
                <span className="text-red-600">{result.error}</span>
              </div>
            )}
            
            {result.data && (
              <div>
                <span className="font-medium">データサンプル: </span>
                <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-60 text-xs">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaveApiTest;
