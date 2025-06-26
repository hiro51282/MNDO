const OpenAI = require('openai');

// 利用可能なOpenAIモデル
const AVAILABLE_MODELS = {
  'gpt-4o-nano': {
    name: 'GPT-4o Nano',
    description: '最も高速で安価（推奨）',
    cost: '入力 $0.15/1M tokens, 出力 $0.60/1M tokens'
  },
  'gpt-4o-mini': {
    name: 'GPT-4o Mini',
    description: 'バランスの取れた性能',
    cost: '入力 $0.15/1M tokens, 出力 $0.60/1M tokens'
  },
  'gpt-3.5-turbo': {
    name: 'GPT-3.5 Turbo',
    description: '安定した性能',
    cost: '入力 $0.50/1M tokens, 出力 $1.50/1M tokens'
  }
};

// デフォルトモデル
const DEFAULT_MODEL = 'gpt-4o-nano';

/**
 * AIリクエストを処理する関数
 * @param {Object} mindMapState - マインドマップの状態
 * @param {string} apiKey - OpenAI APIキー
 * @param {string} model - 使用するモデル（オプション）
 * @returns {Object} AI処理結果
 */
async function processAiRequest(mindMapState, apiKey, model = DEFAULT_MODEL) {
  try {
    // モデルの検証
    if (!AVAILABLE_MODELS[model]) {
      return {
        success: false,
        error: 'Invalid model',
        message: `無効なモデルです: ${model}`,
        availableModels: Object.keys(AVAILABLE_MODELS)
      };
    }

    // OpenAIクライアントを初期化
    const openai = new OpenAI({
      apiKey: apiKey
    });

    const { nodes, edges, userInput } = mindMapState;

    // マインドマップの構造を分析
    const mindMapAnalysis = analyzeMindMap(nodes, edges);
    
    // プロンプトを構築
    const prompt = buildPrompt(userInput, mindMapAnalysis);

    console.log('Sending request to OpenAI:', {
      model: model,
      promptLength: prompt.length,
      nodesCount: nodes.length,
      edgesCount: edges.length
    });

    // OpenAI APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `あなたはマインドマップ作成の専門アシスタントです。
現在のマインドマップの構造を理解し、ユーザーの要求に基づいて適切な提案を行ってください。

マインドマップの特徴：
- ノードは階層構造で管理されています
- 各ノードにはラベルとデータが含まれています
- エッジはノード間の関係を表現しています

提案の形式：
- 新しいノードの追加
- 既存ノードの修正
- 構造の改善提案
- 関連性の強化

必ずJSON形式で応答してください。`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const aiResponse = completion.choices[0].message.content;
    
    // AI応答を解析して提案を生成
    const proposals = parseAiResponse(aiResponse, nodes, edges);

    return {
      success: true,
      proposals: proposals,
      rawResponse: aiResponse,
      analysis: mindMapAnalysis,
      model: model,
      modelInfo: AVAILABLE_MODELS[model]
    };

  } catch (error) {
    console.error('AI processing error:', error);
    
    // APIキーエラーの場合
    if (error.code === 'invalid_api_key') {
      return {
        success: false,
        error: 'Invalid API key',
        message: 'OpenAI APIキーが無効です。正しいAPIキーを入力してください。'
      };
    }

    // モデルエラーの場合
    if (error.code === 'model_not_found') {
      return {
        success: false,
        error: 'Model not found',
        message: `指定されたモデルが見つかりません: ${model}`,
        availableModels: Object.keys(AVAILABLE_MODELS)
      };
    }

    // その他のエラー
    return {
      success: false,
      error: 'AI processing failed',
      message: error.message || 'AI処理中にエラーが発生しました。'
    };
  }
}

/**
 * 利用可能なモデル一覧を取得する関数
 * @returns {Object} 利用可能なモデル情報
 */
function getAvailableModels() {
  return AVAILABLE_MODELS;
}

/**
 * デフォルトモデルを取得する関数
 * @returns {string} デフォルトモデル名
 */
function getDefaultModel() {
  return DEFAULT_MODEL;
}

/**
 * マインドマップの構造を分析する関数
 * @param {Array} nodes - ノード配列
 * @param {Array} edges - エッジ配列
 * @returns {Object} 分析結果
 */
function analyzeMindMap(nodes, edges) {
  const analysis = {
    totalNodes: nodes.length,
    totalEdges: edges.length,
    rootNodes: [],
    leafNodes: [],
    maxDepth: 0,
    nodeTypes: {},
    connections: {}
  };

  // ルートノードとリーフノードを特定
  const hasIncoming = new Set();
  const hasOutgoing = new Set();

  edges.forEach(edge => {
    hasIncoming.add(edge.target);
    hasOutgoing.add(edge.source);
  });

  nodes.forEach(node => {
    if (!hasIncoming.has(node.id)) {
      analysis.rootNodes.push(node);
    }
    if (!hasOutgoing.has(node.id)) {
      analysis.leafNodes.push(node);
    }
  });

  // ノードタイプの分析
  nodes.forEach(node => {
    const type = node.type || 'default';
    analysis.nodeTypes[type] = (analysis.nodeTypes[type] || 0) + 1;
  });

  return analysis;
}

/**
 * AI用のプロンプトを構築する関数
 * @param {string} userInput - ユーザー入力
 * @param {Object} analysis - マインドマップ分析結果
 * @returns {string} プロンプト
 */
function buildPrompt(userInput, analysis) {
  return `
現在のマインドマップの状態：
- 総ノード数: ${analysis.totalNodes}
- 総エッジ数: ${analysis.totalEdges}
- ルートノード数: ${analysis.rootNodes.length}
- リーフノード数: ${analysis.leafNodes.length}

ユーザーの要求: "${userInput}"

この要求に基づいて、マインドマップの改善提案をJSON形式で提供してください。

応答形式：
{
  "suggestions": [
    {
      "type": "add_node" | "modify_node" | "add_connection" | "restructure",
      "description": "提案の説明",
      "priority": "high" | "medium" | "low",
      "details": {
        // 提案の詳細情報
      }
    }
  ],
  "reasoning": "提案の理由",
  "estimatedImpact": "high" | "medium" | "low"
}
`;
}

/**
 * AI応答を解析して提案を生成する関数
 * @param {string} aiResponse - AI応答
 * @param {Array} nodes - 現在のノード
 * @param {Array} edges - 現在のエッジ
 * @returns {Array} 提案配列
 */
function parseAiResponse(aiResponse, nodes, edges) {
  try {
    // JSONを抽出して解析
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return [{
        type: 'error',
        description: 'AI応答の解析に失敗しました',
        content: aiResponse
      }];
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions.map(suggestion => ({
        ...suggestion,
        id: `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }));
    }

    return [{
      type: 'info',
      description: 'AIからの提案',
      content: parsed
    }];

  } catch (error) {
    console.error('AI response parsing error:', error);
    return [{
      type: 'error',
      description: 'AI応答の解析に失敗しました',
      content: aiResponse,
      error: error.message
    }];
  }
}

module.exports = {
  processAiRequest,
  getAvailableModels,
  getDefaultModel
}; 