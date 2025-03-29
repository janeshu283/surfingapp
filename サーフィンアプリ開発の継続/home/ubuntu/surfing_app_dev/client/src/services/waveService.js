// src/services/waveService.js
import { supabase } from './supabaseClient';

/**
 * 波情報を取得するサービス
 */
export const waveService = {
  /**
   * 特定の地域のサーフスポット一覧を取得
   * @param {number} regionId - 地域ID
   * @returns {Promise} - サーフスポットの配列
   */
  async getSurfSpotsByRegion(regionId) {
    try {
      const { data, error } = await supabase
        .from('surf_spots')
        .select('*')
        .eq('region_id', regionId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching surf spots:', error);
      throw error;
    }
  },

  /**
   * すべての地域を取得
   * @returns {Promise} - 地域の配列
   */
  async getAllRegions() {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  },

  /**
   * 特定のサーフスポットの波予測を取得
   * @param {number} spotId - サーフスポットID
   * @returns {Promise} - 波予測データの配列
   */
  async getWaveForecast(spotId) {
    try {
      const { data, error } = await supabase
        .from('wave_forecasts')
        .select('*')
        .eq('surf_spot_id', spotId)
        .order('forecast_time');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching wave forecast:', error);
      throw error;
    }
  },

  /**
   * ユーザーのプロフィールに基づいたパーソナライズされたスコアを取得
   * @param {number} spotId - サーフスポットID
   * @param {string} skillLevel - スキルレベル
   * @param {string} boardType - ボードタイプ
   * @returns {Promise} - パーソナライズされたスコアデータの配列
   */
  async getPersonalizedScores(spotId, skillLevel, boardType) {
    try {
      const { data, error } = await supabase
        .from('personalized_scores')
        .select('*')
        .eq('surf_spot_id', spotId)
        .eq('skill_level', skillLevel)
        .eq('board_type', boardType)
        .order('forecast_time');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching personalized scores:', error);
      throw error;
    }
  },

  /**
   * 特定のサーフスポットのライブカメラ情報を取得
   * @param {number} spotId - サーフスポットID
   * @returns {Promise} - ライブカメラデータの配列
   */
  async getLiveCameras(spotId) {
    try {
      const { data, error } = await supabase
        .from('live_cameras')
        .select('*')
        .eq('surf_spot_id', spotId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching live cameras:', error);
      throw error;
    }
  }
};
