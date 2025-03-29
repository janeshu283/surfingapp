// src/services/forecastService.js
import { supabase } from './supabaseClient';

/**
 * パーソナライズされた波予想機能に関するサービス
 */
export const forecastService = {
  /**
   * ユーザープロフィールに基づいたおすすめサーフスポットを取得
   * @param {string} skillLevel - スキルレベル
   * @param {string} boardType - ボードタイプ
   * @param {number} boardLength - ボードの長さ
   * @param {number} [regionId] - 地域ID（オプション）
   * @returns {Promise} - おすすめサーフスポットの配列
   */
  async getRecommendedSpots(skillLevel, boardType, boardLength, regionId = null) {
    try {
      let query = supabase
        .from('personalized_scores')
        .select(`
          id,
          surf_spot_id,
          forecast_time,
          score,
          surf_spots(
            id,
            name,
            latitude,
            longitude,
            description,
            difficulty,
            region_id,
            regions(name, prefecture)
          )
        `)
        .eq('skill_level', skillLevel)
        .eq('board_type', boardType)
        .gte('forecast_time', new Date().toISOString())
        .order('score', { ascending: false })
        .order('forecast_time');
      
      if (regionId) {
        query = query.eq('surf_spots.region_id', regionId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // ボードの長さに基づいてスコアを調整
      const adjustedData = data.map(item => {
        let adjustedScore = item.score;
        
        // ボードの長さに基づいてスコアを調整するロジック
        // 例: ショートボード（6フィート以下）、ミッドレングス（6-8フィート）、ロングボード（8フィート以上）
        if (boardLength <= 6 && item.surf_spots.difficulty === 'advanced') {
          adjustedScore = adjustScoreUp(adjustedScore);
        } else if (boardLength > 8 && item.surf_spots.difficulty === 'beginner') {
          adjustedScore = adjustScoreUp(adjustedScore);
        } else if (boardLength > 6 && boardLength <= 8) {
          // ミッドレングスはバランスが取れているので調整なし
        }
        
        return {
          ...item,
          adjustedScore
        };
      });
      
      // 調整後のスコアでソート
      return adjustedData.sort((a, b) => {
        const scoreOrder = { 'Excellent': 5, 'Good': 4, 'Fair': 3, 'Poor': 2, 'Bad': 1 };
        return scoreOrder[b.adjustedScore] - scoreOrder[a.adjustedScore];
      });
    } catch (error) {
      console.error('Error fetching recommended spots:', error);
      throw error;
    }
  },
  
  /**
   * 特定の日時の波予測を取得
   * @param {number} spotId - サーフスポットID
   * @param {string} date - 日付（YYYY-MM-DD形式）
   * @returns {Promise} - 波予測データの配列
   */
  async getForecastByDate(spotId, date) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from('wave_forecasts')
        .select('*')
        .eq('surf_spot_id', spotId)
        .gte('forecast_time', startDate.toISOString())
        .lte('forecast_time', endDate.toISOString())
        .order('forecast_time');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching forecast by date:', error);
      throw error;
    }
  },
  
  /**
   * 波の高さに基づいてスコアを計算
   * @param {number} waveHeight - 波の高さ（メートル）
   * @param {string} skillLevel - スキルレベル
   * @returns {string} - スコア（Excellent, Good, Fair, Poor, Bad）
   */
  calculateScoreByWaveHeight(waveHeight, skillLevel) {
    if (skillLevel === 'beginner') {
      if (waveHeight < 0.5) return 'Good';
      if (waveHeight < 1.0) return 'Fair';
      if (waveHeight < 1.5) return 'Poor';
      return 'Bad';
    } else if (skillLevel === 'intermediate') {
      if (waveHeight < 0.5) return 'Fair';
      if (waveHeight < 1.0) return 'Good';
      if (waveHeight < 1.5) return 'Excellent';
      if (waveHeight < 2.0) return 'Good';
      if (waveHeight < 2.5) return 'Fair';
      return 'Poor';
    } else { // advanced
      if (waveHeight < 0.5) return 'Poor';
      if (waveHeight < 1.0) return 'Fair';
      if (waveHeight < 1.5) return 'Good';
      if (waveHeight < 2.5) return 'Excellent';
      if (waveHeight < 3.5) return 'Good';
      return 'Fair';
    }
  }
};

// スコアを1段階上げる補助関数
function adjustScoreUp(score) {
  const scores = ['Bad', 'Poor', 'Fair', 'Good', 'Excellent'];
  const index = scores.indexOf(score);
  if (index < scores.length - 1) {
    return scores[index + 1];
  }
  return score;
}

// スコアを1段階下げる補助関数
function adjustScoreDown(score) {
  const scores = ['Bad', 'Poor', 'Fair', 'Good', 'Excellent'];
  const index = scores.indexOf(score);
  if (index > 0) {
    return scores[index - 1];
  }
  return score;
}
