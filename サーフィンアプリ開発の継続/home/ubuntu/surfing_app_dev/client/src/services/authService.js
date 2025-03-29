// src/services/authService.js
import { supabase } from './supabaseClient';

/**
 * 認証関連のサービス
 */
export const authService = {
  /**
   * メールアドレスとパスワードでサインアップ
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise} - サインアップ結果
   */
  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * メールアドレスとパスワードでサインイン
   * @param {string} email - メールアドレス
   * @param {string} password - パスワード
   * @returns {Promise} - サインイン結果
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
   * サインアウト
   * @returns {Promise} - サインアウト結果
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * 現在のユーザーを取得
   * @returns {Promise} - 現在のユーザー情報
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * ユーザープロフィールを取得
   * @param {string} userId - ユーザーID
   * @returns {Promise} - ユーザープロフィール
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * ユーザープロフィールを更新
   * @param {string} userId - ユーザーID
   * @param {object} profileData - 更新するプロフィールデータ
   * @returns {Promise} - 更新結果
   */
  async updateUserProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};
