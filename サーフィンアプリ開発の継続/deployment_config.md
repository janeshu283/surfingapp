# デプロイ設定

## 環境変数設定
```
REACT_APP_SUPABASE_URL=https://your-supabase-url.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Vercelデプロイ設定
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "build" }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_SERVICE_KEY": "@supabase_service_key"
  }
}
```

## Netlifyデプロイ設定
```
[build]
  base = "client/"
  publish = "build/"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## デプロイ手順
1. 環境変数の設定
2. ビルドコマンドの実行: `npm run build`
3. デプロイプラットフォームへのアップロード
4. ドメイン設定とSSL証明書の確認
5. デプロイ後の動作確認
