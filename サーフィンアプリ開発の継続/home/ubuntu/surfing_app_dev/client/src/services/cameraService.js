// src/services/cameraService.js
import { supabase } from './supabaseClient';

/**
 * YouTubeライブカメラ統合に関するサービス
 */
export const cameraService = {
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
  },

  /**
   * すべてのアクティブなライブカメラを取得
   * @returns {Promise} - ライブカメラデータの配列
   */
  async getAllActiveCameras() {
    try {
      const { data, error } = await supabase
        .from('live_cameras')
        .select(`
          *,
          surf_spots(
            id,
            name,
            region_id,
            regions(name, prefecture)
          )
        `)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching all active cameras:', error);
      throw error;
    }
  },

  /**
   * 特定の地域のライブカメラを取得
   * @param {number} regionId - 地域ID
   * @returns {Promise} - ライブカメラデータの配列
   */
  async getCamerasByRegion(regionId) {
    try {
      const { data, error } = await supabase
        .from('live_cameras')
        .select(`
          *,
          surf_spots!inner(
            id,
            name,
            region_id,
            regions!inner(id, name, prefecture)
          )
        `)
        .eq('surf_spots.region_id', regionId)
        .eq('is_active', true);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching cameras by region:', error);
      throw error;
    }
  },

  /**
   * YouTubeビデオIDからサムネイル画像URLを生成
   * @param {string} youtubeUrl - YouTubeのURL
   * @returns {string} - サムネイル画像のURL
   */
  getYoutubeThumbnail(youtubeUrl) {
    try {
      // YouTubeのURLからビデオIDを抽出
      const videoId = this.extractYoutubeVideoId(youtubeUrl);
      if (!videoId) return null;
      
      // サムネイルURLを生成（高品質バージョン）
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } catch (error) {
      console.error('Error generating YouTube thumbnail:', error);
      return null;
    }
  },

  /**
   * YouTubeのURLからビデオIDを抽出
   * @param {string} url - YouTubeのURL
   * @returns {string|null} - YouTubeビデオID
   */
  extractYoutubeVideoId(url) {
    if (!url) return null;
    
    // 通常のYouTube URLからIDを抽出
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  },

  /**
   * YouTubeの埋め込みURLを生成
   * @param {string} youtubeUrl - YouTubeのURL
   * @returns {string} - 埋め込み用のURL
   */
  getYoutubeEmbedUrl(youtubeUrl) {
    const videoId = this.extractYoutubeVideoId(youtubeUrl);
    if (!videoId) return null;
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
  }
};
