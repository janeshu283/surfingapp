import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>日本のサーファーのための波情報プラットフォーム</h1>
        <p className="hero-description">
          あなたのスキルレベルとボードタイプに合わせた、パーソナライズされた波予測を提供します。
          全国のサーフスポット情報、リアルタイムカメラ映像、コミュニティ情報を一つのアプリで。
        </p>
        <div className="hero-buttons">
          <Link to="/spots" className="btn btn-primary">サーフスポットを探す</Link>
          <Link to="/register" className="btn btn-secondary">新規登録</Link>
        </div>
      </div>
      
      <div className="features-section">
        <h2>主な機能</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>パーソナライズされた波予測</h3>
            <p>あなたのスキルレベルとボードタイプに合わせた5段階スコアで、最適なサーフィン条件を簡単に把握できます。</p>
          </div>
          <div className="feature-card">
            <h3>ライブカメラ統合</h3>
            <p>全国のサーフスポットのライブカメラ映像をアプリ内で直接確認できます。</p>
          </div>
          <div className="feature-card">
            <h3>地域別情報</h3>
            <p>日本全国のサーフスポット情報を地域別に簡単に検索・閲覧できます。</p>
          </div>
          <div className="feature-card">
            <h3>コミュニティ機能</h3>
            <p>実際のサーファーからのリアルタイム情報や体験を共有できるコミュニティ機能を提供します。</p>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>今すぐ始めましょう</h2>
        <p>無料アカウントを作成して、パーソナライズされた波予測を受け取りましょう。</p>
        <Link to="/register" className="btn btn-primary">無料登録する</Link>
      </div>
    </div>
  );
};

export default Home;