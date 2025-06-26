const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { processAiRequest, getAvailableModels, getDefaultModel } = require('./aiProcessor');

// 環境変数を読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ミドルウェアの設定
app.use(cors({
  origin: 'http://localhost:5173', // フロントエンドのURL
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MCP Server is running',
    timestamp: new Date().toISOString()
  });
});

// 利用可能なモデル一覧を取得するエンドポイント
app.get('/api/models', (req, res) => {
  try {
    const models = getAvailableModels();
    const defaultModel = getDefaultModel();
    
    res.json({
      success: true,
      models: models,
      defaultModel: defaultModel
    });
  } catch (error) {
    console.error('Models endpoint error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// AIアシスタントエンドポイント
app.post('/api/ai-assistant', async (req, res) => {
  try {
    console.log('AI Assistant request received:', {
      timestamp: new Date().toISOString(),
      body: req.body
    });

    const { mindMapState, apiKey, model } = req.body;

    // バリデーション
    if (!mindMapState || !apiKey) {
      return res.status(400).json({
        error: 'Missing required fields: mindMapState and apiKey are required'
      });
    }

    if (!mindMapState.nodes || !mindMapState.edges || !mindMapState.userInput) {
      return res.status(400).json({
        error: 'Invalid mindMapState: nodes, edges, and userInput are required'
      });
    }

    // AI処理を実行（モデル指定あり）
    const result = await processAiRequest(mindMapState, apiKey, model);

    console.log('AI Assistant response:', {
      timestamp: new Date().toISOString(),
      result: result
    });

    res.json(result);

  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404ハンドラー
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} does not exist`
  });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 MCP Server is running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Assistant: http://localhost:${PORT}/api/ai-assistant`);
  console.log(`🌐 Frontend URL: http://localhost:5173`);
}); 