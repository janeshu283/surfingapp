-- サーフィンアプリ初期データ

-- 地域テーブル
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  prefecture TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- サーフスポットテーブル
CREATE TABLE surf_spots (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  region_id INTEGER REFERENCES regions(id),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ライブカメラテーブル
CREATE TABLE live_cameras (
  id SERIAL PRIMARY KEY,
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  name TEXT NOT NULL,
  youtube_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 波予測テーブル
CREATE TABLE wave_forecasts (
  id SERIAL PRIMARY KEY,
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  forecast_time TIMESTAMP WITH TIME ZONE,
  wave_height DECIMAL(3, 1),
  wave_period DECIMAL(3, 1),
  wave_direction INTEGER,
  wind_speed DECIMAL(3, 1),
  wind_direction INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- パーソナライズスコアテーブル
CREATE TABLE personalized_scores (
  id SERIAL PRIMARY KEY,
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  forecast_time TIMESTAMP WITH TIME ZONE,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  board_type TEXT CHECK (board_type IN ('shortboard', 'longboard', 'funboard', 'fish', 'sup')),
  score TEXT CHECK (score IN ('Excellent', 'Good', 'Fair', 'Poor', 'Bad')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- プロフィールテーブル
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT,
  avatar_url TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  board_type TEXT CHECK (board_type IN ('shortboard', 'longboard', 'funboard', 'fish', 'sup')),
  board_length DECIMAL(3, 1),
  preferred_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 投稿テーブル
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  content TEXT NOT NULL,
  wave_height DECIMAL(3, 1),
  wave_quality TEXT CHECK (wave_quality IN ('Excellent', 'Good', 'Fair', 'Poor', 'Bad')),
  crowd_level TEXT CHECK (crowd_level IN ('empty', 'few', 'moderate', 'crowded', 'very_crowded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 地域データ
INSERT INTO regions (prefecture, name, description) VALUES
('千葉県', '九十九里', '千葉県東部に位置する長い砂浜のエリア。初心者から上級者まで楽しめる様々なブレイクがある。'),
('千葉県', '南房総', '千葉県南部に位置するエリア。太平洋からのうねりを受けやすく、パワフルな波が特徴。'),
('神奈川県', '湘南', '神奈川県中部に位置する人気サーフエリア。江の島を中心に多くのサーフスポットがある。'),
('神奈川県', '三浦半島', '神奈川県南部に位置するエリア。太平洋と相模湾の両方に面しており、様々な波質を楽しめる。'),
('静岡県', '伊豆', '静岡県東部に位置する半島。太平洋側と相模湾側で異なる波質を楽しめる。'),
('静岡県', '御前崎', '静岡県中部に位置するエリア。コンスタントに波があり、上級者に人気。'),
('茨城県', '大洗', '茨城県中部に位置するエリア。関東でも有数の波の質の高さを誇る。'),
('茨城県', '鹿島', '茨城県南部に位置するエリア。広い砂浜と良質な波が特徴。');

-- サーフスポットデータ
INSERT INTO surf_spots (name, region_id, latitude, longitude, difficulty, description) VALUES
('一宮海岸', 1, 35.3789, 140.3908, 'beginner', '九十九里の中でも特に人気の高いスポット。初心者向けの波が多い。'),
('太東海岸', 1, 35.2931, 140.4008, 'intermediate', '九十九里南部に位置するスポット。中級者向けの波が多い。'),
('志田下', 2, 35.1189, 140.1234, 'advanced', '南房総の人気スポット。上級者向けのパワフルな波が特徴。'),
('鵜原海岸', 2, 35.1456, 140.1678, 'intermediate', '南房総の美しい海岸。中級者向けの波が多い。'),
('鎌倉材木座', 3, 35.3023, 139.5512, 'beginner', '湘南の人気スポット。初心者向けの波が多く、アクセスも良い。'),
('辻堂海岸', 3, 35.3156, 139.4789, 'beginner', '湘南の代表的なスポット。初心者から中級者向け。'),
('葉山一色海岸', 4, 35.2567, 139.5789, 'intermediate', '三浦半島の人気スポット。中級者向けの波が多い。'),
('白浜海岸', 5, 34.6789, 138.9678, 'intermediate', '伊豆の人気スポット。中級者向けの波が多い。'),
('大洗サンビーチ', 7, 36.3145, 140.5789, 'intermediate', '大洗の代表的なスポット。中級者向けの波が多い。'),
('鹿島灘', 8, 35.9678, 140.7123, 'advanced', '鹿島の代表的なスポット。上級者向けのパワフルな波が特徴。');

-- ライブカメラデータ
INSERT INTO live_cameras (surf_spot_id, name, youtube_url, description) VALUES
(1, '一宮海岸ライブカメラ', 'https://www.youtube.com/watch?v=example1', '一宮海岸の波の状況をリアルタイムで確認できます。'),
(3, '志田下ライブカメラ', 'https://www.youtube.com/watch?v=example2', '志田下の波の状況をリアルタイムで確認できます。'),
(5, '材木座ライブカメラ', 'https://www.youtube.com/watch?v=example3', '材木座の波の状況をリアルタイムで確認できます。'),
(9, '大洗ライブカメラ', 'https://www.youtube.com/watch?v=example4', '大洗の波の状況をリアルタイムで確認できます。');

-- 波予測データ（現在日付から7日分）
-- 実際のデプロイ時には、APIから取得したリアルタイムデータを使用する
-- ここではサンプルデータとして、スクリプトで生成する必要がある

-- パーソナライズスコアデータ（現在日付から7日分）
-- 実際のデプロイ時には、波予測データとユーザープロフィールに基づいて計算する
-- ここではサンプルデータとして、スクリプトで生成する必要がある
