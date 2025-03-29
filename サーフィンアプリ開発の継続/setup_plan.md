# サーフィンアプリ開発環境セットアップ計画

## 1. プロジェクト構造

```
surfing_app_dev/
├── client/                 # フロントエンド（React）
│   ├── public/             # 静的ファイル
│   └── src/                # ソースコード
│       ├── assets/         # 画像、フォントなど
│       ├── components/     # 再利用可能なコンポーネント
│       ├── contexts/       # Reactコンテキスト
│       ├── hooks/          # カスタムフック
│       ├── pages/          # ページコンポーネント
│       ├── services/       # APIサービス
│       ├── styles/         # グローバルスタイル
│       └── utils/          # ユーティリティ関数
├── server/                 # バックエンド（Node.js）
│   ├── config/             # 設定ファイル
│   ├── controllers/        # コントローラー
│   ├── middleware/         # ミドルウェア
│   ├── models/             # データモデル
│   ├── routes/             # ルート定義
│   ├── services/           # ビジネスロジック
│   └── utils/              # ユーティリティ関数
└── docs/                   # ドキュメント
    ├── api/                # API仕様書
    └── setup/              # セットアップガイド
```

## 2. 技術スタック

### フロントエンド
- **フレームワーク**: React
- **状態管理**: React Context API + useReducer
- **ルーティング**: React Router
- **スタイリング**: Tailwind CSS
- **HTTP クライアント**: Axios
- **フォーム**: React Hook Form
- **テスト**: Jest, React Testing Library

### バックエンド
- **ランタイム**: Node.js
- **フレームワーク**: Express.js
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **ストレージ**: Supabase Storage
- **テスト**: Jest, Supertest

### 開発ツール
- **パッケージマネージャー**: npm
- **ビルドツール**: Vite
- **リンター**: ESLint
- **フォーマッター**: Prettier
- **バージョン管理**: Git
- **CI/CD**: GitHub Actions

## 3. セットアップ手順

### 3.1 Node.js環境のセットアップ

```bash
# Node.jsバージョン確認
node -v  # v20.18.0以上を推奨

# npmバージョン確認
npm -v
```

### 3.2 フロントエンドのセットアップ

```bash
# Reactプロジェクト作成（Vite使用）
npm create vite@latest client -- --template react-ts

# 依存関係のインストール
cd client
npm install

# 追加パッケージのインストール
npm install react-router-dom axios tailwindcss postcss autoprefixer react-hook-form
npm install -D @types/react-router-dom @types/node

# Tailwind CSSの初期化
npx tailwindcss init -p
```

### 3.3 バックエンドのセットアップ

```bash
# サーバーディレクトリ作成
mkdir -p server

# package.jsonの初期化
cd server
npm init -y

# 依存関係のインストール
npm install express cors dotenv helmet morgan @supabase/supabase-js
npm install -D typescript ts-node @types/express @types/cors @types/node nodemon
```

### 3.4 Supabaseのセットアップ

1. Supabaseアカウント作成（https://supabase.com/）
2. 新規プロジェクト作成
3. データベーススキーマの設定
4. 認証設定
5. ストレージバケットの設定
6. API キーの取得

### 3.5 環境変数の設定

```bash
# フロントエンド (.env.local)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000/api

# バックエンド (.env)
PORT=3000
NODE_ENV=development
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
CORS_ORIGIN=http://localhost:5173
```

## 4. 開発ワークフロー

### 4.1 バージョン管理

```bash
# Gitリポジトリの初期化
git init

# .gitignoreの作成
touch .gitignore

# 初期コミット
git add .
git commit -m "Initial commit"

# リモートリポジトリの設定（GitHub）
git remote add origin https://github.com/yourusername/surfing-app.git
git push -u origin main
```

### 4.2 開発サーバーの起動

```bash
# フロントエンド開発サーバー
cd client
npm run dev

# バックエンド開発サーバー
cd server
npm run dev
```

### 4.3 ビルドとデプロイ

```bash
# フロントエンドのビルド
cd client
npm run build

# バックエンドのビルド
cd server
npm run build
```

## 5. 初期データモデル

### 5.1 ユーザーモデル

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id),
  username TEXT UNIQUE,
  avatar_url TEXT,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  board_type TEXT,
  board_length NUMERIC,
  preferred_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.2 サーフスポットモデル

```sql
CREATE TABLE regions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE surf_spots (
  id SERIAL PRIMARY KEY,
  region_id INTEGER REFERENCES regions(id),
  name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'all_levels')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE live_cameras (
  id SERIAL PRIMARY KEY,
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  name TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.3 波予測モデル

```sql
CREATE TABLE wave_forecasts (
  id SERIAL PRIMARY KEY,
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  forecast_time TIMESTAMP WITH TIME ZONE NOT NULL,
  wave_height NUMERIC NOT NULL,
  wave_period NUMERIC,
  wave_direction INTEGER,
  wind_speed NUMERIC,
  wind_direction INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE personalized_scores (
  id SERIAL PRIMARY KEY,
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  forecast_time TIMESTAMP WITH TIME ZONE NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  board_type TEXT,
  score TEXT CHECK (score IN ('Excellent', 'Good', 'Fair', 'Poor', 'Bad')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5.4 コミュニティモデル

```sql
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  surf_spot_id INTEGER REFERENCES surf_spots(id),
  content TEXT NOT NULL,
  image_url TEXT,
  wave_height NUMERIC,
  wave_quality TEXT CHECK (wave_quality IN ('Excellent', 'Good', 'Fair', 'Poor', 'Bad')),
  crowd_level TEXT CHECK (crowd_level IN ('empty', 'few', 'moderate', 'crowded', 'very_crowded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 6. 次のステップ

1. 開発環境のセットアップ
2. Supabaseプロジェクトの作成とデータモデルの実装
3. 認証システムの実装
4. 基本的なUI/UXの実装
5. 波予測データの取得と表示機能の実装
