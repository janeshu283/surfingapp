import React, { useState, useEffect } from 'react';
import waveApiService from '../services/waveApiService';

/**
 * 波予測データを表示するコンポーネント
 */
const WaveForecast = ({ location, userProfile }) => {
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // APIキー（本番環境では環境変数から取得）
  const apiKeys = {
    stormglass: process.env.REACT_APP_STORMGLASS_API_KEY || 'your_stormglass_api_key',
    openWeatherMap: process.env.REACT_APP_OPENWEATHERMAP_API_KEY || 'your_openweathermap_api_key',
    windy: process.env.REACT_APP_WINDY_API_KEY || 'your_windy_api_key'
  };

  useEffect(() => {
    const fetchForecastData = async () => {
      try {
        setLoading(true);
        // 波予測データを取得
        const data = await waveApiService.getIntegratedForecast(
          location.latitude,
          location.longitude,
          apiKeys
        );
        
        // ユーザープロファイルに基づいてスコアを計算
        const scoredData = calculateScores(data, userProfile);
        
        setForecastData(scoredData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching forecast data:', err);
        setError('波予測データの取得に失敗しました。後でもう一度お試しください。');
        setLoading(false);
      }
    };

    if (location) {
      fetchForecastData();
    }
  }, [location, userProfile]);

  /**
   * ユーザープロファイルに基づいて波予測データにスコアを付ける
   * @param {object} data - 波予測データ
   * @param {object} profile - ユーザープロファイル
   * @returns {object} - スコア付きデータ
   */
  const calculateScores = (data, profile) => {
    if (!data || !data.hourly || !profile) return data;

    // スコア計算のパラメータ
    const { skillLevel, boardType, boardLength } = profile;
    
    // スコア付きデータを作成
    const scoredHourly = data.hourly.map(hour => {
      // 波の高さに基づく基本スコア
      let score = calculateBaseScore(hour.waveHeight);
      
      // スキルレベルによる調整
      score = adjustScoreBySkill(score, hour.waveHeight, skillLevel);
      
      // ボードタイプと長さによる調整
      score = adjustScoreByBoard(score, hour.waveHeight, boardType, boardLength);
      
      // 風の影響を考慮
      score = adjustScoreByWind(score, hour.windSpeed, hour.windDirection);
      
      // スコアを5段階評価に変換
      const ratingText = convertScoreToRating(score);
      
      return {
        ...hour,
        score,
        rating: ratingText
      };
    });
    
    return {
      ...data,
      hourly: scoredHourly
    };
  };

  /**
   * 波の高さに基づく基本スコアを計算
   * @param {number} waveHeight - 波の高さ（メートル）
   * @returns {number} - 基本スコア（0-100）
   */
  const calculateBaseScore = (waveHeight) => {
    if (!waveHeight) return 0;
    
    // 波の高さが0.3m未満または3m以上の場合はスコアが低い
    if (waveHeight < 0.3) return 20;
    if (waveHeight > 3) return 30;
    
    // 理想的な波の高さは0.7m-1.5m
    if (waveHeight >= 0.7 && waveHeight <= 1.5) return 90;
    
    // その他の波の高さは中間的なスコア
    if (waveHeight > 1.5 && waveHeight <= 3) return 70;
    return 50;
  };

  /**
   * スキルレベルに基づいてスコアを調整
   * @param {number} score - 基本スコア
   * @param {number} waveHeight - 波の高さ
   * @param {string} skillLevel - スキルレベル（beginner, intermediate, advanced, expert）
   * @returns {number} - 調整後のスコア
   */
  const adjustScoreBySkill = (score, waveHeight, skillLevel) => {
    if (!waveHeight || !skillLevel) return score;
    
    switch (skillLevel) {
      case 'beginner':
        // 初心者は小さい波が好ましい
        if (waveHeight < 0.5) return Math.min(score + 20, 100);
        if (waveHeight > 1) return Math.max(score - 30, 0);
        break;
      case 'intermediate':
        // 中級者は中程度の波が好ましい
        if (waveHeight >= 0.5 && waveHeight <= 1.2) return Math.min(score + 10, 100);
        if (waveHeight > 2) return Math.max(score - 20, 0);
        break;
      case 'advanced':
        // 上級者はやや大きい波も楽しめる
        if (waveHeight >= 0.7 && waveHeight <= 2) return Math.min(score + 10, 100);
        break;
      case 'expert':
        // エキスパートは大きい波も楽しめる
        if (waveHeight >= 1 && waveHeight <= 3) return Math.min(score + 20, 100);
        break;
      default:
        return score;
    }
    
    return score;
  };

  /**
   * ボードタイプと長さに基づいてスコアを調整
   * @param {number} score - 基本スコア
   * @param {number} waveHeight - 波の高さ
   * @param {string} boardType - ボードタイプ（shortboard, longboard, funboard, etc）
   * @param {number} boardLength - ボードの長さ（フィート）
   * @returns {number} - 調整後のスコア
   */
  const adjustScoreByBoard = (score, waveHeight, boardType, boardLength) => {
    if (!waveHeight || !boardType) return score;
    
    switch (boardType) {
      case 'shortboard':
        // ショートボードは中程度から大きい波に適している
        if (waveHeight >= 0.7 && waveHeight <= 2.5) return Math.min(score + 15, 100);
        if (waveHeight < 0.5) return Math.max(score - 20, 0);
        break;
      case 'longboard':
        // ロングボードは小さい波から中程度の波に適している
        if (waveHeight >= 0.3 && waveHeight <= 1.2) return Math.min(score + 15, 100);
        if (waveHeight > 1.8) return Math.max(score - 25, 0);
        break;
      case 'funboard':
        // ファンボードは幅広い条件に適応
        if (waveHeight >= 0.4 && waveHeight <= 1.5) return Math.min(score + 10, 100);
        break;
      default:
        return score;
    }
    
    // ボードの長さによる微調整
    if (boardLength) {
      if (boardLength < 6 && waveHeight > 1.5) return Math.min(score + 5, 100);
      if (boardLength > 8 && waveHeight < 0.8) return Math.min(score + 5, 100);
    }
    
    return score;
  };

  /**
   * 風の条件に基づいてスコアを調整
   * @param {number} score - 基本スコア
   * @param {number} windSpeed - 風速（m/s）
   * @param {number} windDirection - 風向き（度）
   * @returns {number} - 調整後のスコア
   */
  const adjustScoreByWind = (score, windSpeed, windDirection) => {
    if (!windSpeed) return score;
    
    // 強風はスコアを下げる
    if (windSpeed > 8) return Math.max(score - 30, 0);
    if (windSpeed > 5) return Math.max(score - 15, 0);
    
    // オフショア（海から陸へ向かう風）はスコアを上げる
    // 注: 実際の実装では、海岸線の向きを考慮して風向きを判断する必要がある
    const isOffshore = false; // 仮の値
    if (isOffshore && windSpeed < 5) return Math.min(score + 20, 100);
    
    return score;
  };

  /**
   * スコアを5段階評価のテキストに変換
   * @param {number} score - スコア（0-100）
   * @returns {string} - 評価テキスト（Excellent, Good, Fair, Poor, Bad）
   */
  const convertScoreToRating = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    if (score >= 20) return 'Poor';
    return 'Bad';
  };

  // ローディング中の表示
  if (loading) {
    return <div className="p-4 text-center">波予測データを読み込み中...</div>;
  }

  // エラー時の表示
  if (error) {
    return <div className="p-4 text-center text-red-600">{error}</div>;
  }

  // データがない場合の表示
  if (!forecastData || !forecastData.hourly || forecastData.hourly.length === 0) {
    return <div className="p-4 text-center">この場所の波予測データはありません。</div>;
  }

  return (
    <div className="wave-forecast p-4">
      <h2 className="text-2xl font-bold mb-4">波予測</h2>
      
      {/* 今日の予測サマリー */}
      <div className="today-summary bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-xl font-semibold mb-2">今日のサーフコンディション</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="condition-card p-3 bg-blue-50 rounded-md">
            <div className="text-lg font-medium">波の高さ</div>
            <div className="text-3xl font-bold text-blue-600">
              {forecastData.hourly[0]?.waveHeight?.toFixed(1) || 'N/A'} m
            </div>
          </div>
          <div className="condition-card p-3 bg-blue-50 rounded-md">
            <div className="text-lg font-medium">周期</div>
            <div className="text-3xl font-bold text-blue-600">
              {forecastData.hourly[0]?.wavePeriod?.toFixed(1) || 'N/A'} s
            </div>
          </div>
          <div className="condition-card p-3 bg-blue-50 rounded-md">
            <div className="text-lg font-medium">風速</div>
            <div className="text-3xl font-bold text-blue-600">
              {forecastData.hourly[0]?.windSpeed?.toFixed(1) || 'N/A'} m/s
            </div>
          </div>
        </div>
        
        {/* 今日のスコア */}
        <div className="mt-4 text-center">
          <div className="text-lg font-medium">あなたにとってのスコア</div>
          <div className={`text-3xl font-bold mt-2 ${getRatingColorClass(forecastData.hourly[0]?.rating)}`}>
            {forecastData.hourly[0]?.rating || 'N/A'}
          </div>
        </div>
      </div>
      
      {/* 時間ごとの予測 */}
      <div className="hourly-forecast bg-white rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-4">時間ごとの予測</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 text-left">時間</th>
                <th className="py-2 px-3 text-left">波高</th>
                <th className="py-2 px-3 text-left">周期</th>
                <th className="py-2 px-3 text-left">風速</th>
                <th className="py-2 px-3 text-left">スコア</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.hourly.slice(0, 24).map((hour, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="py-2 px-3">
                    {new Date(hour.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2 px-3">{hour.waveHeight?.toFixed(1) || 'N/A'} m</td>
                  <td className="py-2 px-3">{hour.wavePeriod?.toFixed(1) || 'N/A'} s</td>
                  <td className="py-2 px-3">{hour.windSpeed?.toFixed(1) || 'N/A'} m/s</td>
                  <td className={`py-2 px-3 font-medium ${getRatingColorClass(hour.rating)}`}>
                    {hour.rating || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * 評価に基づいて色クラスを取得
 * @param {string} rating - 評価テキスト
 * @returns {string} - テキスト色のクラス
 */
const getRatingColorClass = (rating) => {
  switch (rating) {
    case 'Excellent': return 'text-green-600';
    case 'Good': return 'text-blue-600';
    case 'Fair': return 'text-yellow-600';
    case 'Poor': return 'text-orange-600';
    case 'Bad': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

export default WaveForecast;
