// src/services/contentService.js
import { supabase } from './supabaseClient';

/**
 * ユーザー参加型コンテンツ収集に関するサービス
 */
export const contentService = {
  /**
   * 新しい投稿を作成
   * @param {object} postData - 投稿データ
   * @param {string} postData.user_id - ユーザーID
   * @param {number} postData.surf_spot_id - サーフスポットID
   * @param {string} postData.content - 投稿内容
   * @param {string} [postData.image_url] - 画像URL（オプション）
   * @param {number} [postData.wave_height] - 波の高さ（オプション）
   * @param {string} [postData.wave_quality] - 波の質（オプション）
   * @param {string} [postData.crowd_level] - 混雑レベル（オプション）
   * @returns {Promise} - 作成された投稿データ
   */
  async createPost(postData) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(postData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  /**
   * 投稿に画像をアップロード
   * @param {File} imageFile - アップロードする画像ファイル
   * @param {string} userId - ユーザーID
   * @returns {Promise} - アップロードされた画像のURL
   */
  async uploadImage(imageFile, userId) {
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `post-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('surf-content')
        .upload(filePath, imageFile);
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('surf-content')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * 特定のサーフスポットの投稿を取得
   * @param {number} spotId - サーフスポットID
   * @param {number} [limit=10] - 取得する投稿数
   * @param {number} [offset=0] - オフセット（ページネーション用）
   * @returns {Promise} - 投稿データの配列
   */
  async getPostsBySpot(spotId, limit = 10, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id(id, profiles(username, avatar_url)),
          comments(count)
        `)
        .eq('surf_spot_id', spotId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching posts by spot:', error);
      throw error;
    }
  },

  /**
   * 最新の投稿を取得
   * @param {number} [limit=20] - 取得する投稿数
   * @param {number} [offset=0] - オフセット（ページネーション用）
   * @returns {Promise} - 投稿データの配列
   */
  async getLatestPosts(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users:user_id(id, profiles(username, avatar_url)),
          surf_spots(id, name, region_id, regions(name, prefecture)),
          comments(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      throw error;
    }
  },

  /**
   * 投稿にコメントを追加
   * @param {object} commentData - コメントデータ
   * @param {number} commentData.post_id - 投稿ID
   * @param {string} commentData.user_id - ユーザーID
   * @param {string} commentData.content - コメント内容
   * @returns {Promise} - 作成されたコメントデータ
   */
  async addComment(commentData) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(commentData)
        .select();
      
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * 投稿のコメントを取得
   * @param {number} postId - 投稿ID
   * @returns {Promise} - コメントデータの配列
   */
  async getCommentsByPost(postId) {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users:user_id(id, profiles(username, avatar_url))
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }
};
