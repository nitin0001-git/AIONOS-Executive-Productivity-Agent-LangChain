import express from 'express';
import { generateBrief, loadActions } from '../services/brief.js';
import { resolveActionStateAsOf, DEFAULT_AS_OF, SIMULATED_TIMEPOINTS } from '../services/status.js';
import { askQuestion } from '../services/qa.js';
import { runPipeline } from '../services/pipelineRunner.js';
import { isGeminiConfigured, getModelName } from '../services/llm.js';

const router = express.Router();

/**
 * GET /api/health
 */
router.get('/health', (req, res) => {
  const actions = loadActions();
  res.json({
    status: 'ok',
    app: 'AIONOS Executive Productivity Agent',
    targetUser: 'Arjun Malhotra (VP Sales)',
    geminiConfigured: isGeminiConfigured(),
    model: getModelName(),
    actionsCount: actions.length,
    defaultAsOf: DEFAULT_AS_OF,
    systemTime: new Date().toISOString()
  });
});

/**
 * GET /api/timepoints
 */
router.get('/timepoints', (req, res) => {
  res.json({
    defaultAsOf: DEFAULT_AS_OF,
    timepoints: SIMULATED_TIMEPOINTS
  });
});

/**
 * GET /api/brief?asOf=...
 */
router.get('/brief', (req, res) => {
  try {
    const asOf = req.query.asOf || DEFAULT_AS_OF;
    const brief = generateBrief(asOf);
    res.json(brief);
  } catch (err) {
    console.error('[Route /brief] Error:', err);
    res.status(500).json({ error: 'Failed to generate executive brief', details: err.message });
  }
});

/**
 * GET /api/actions?asOf=...
 */
router.get('/actions', (req, res) => {
  try {
    const asOf = req.query.asOf || DEFAULT_AS_OF;
    const allActions = loadActions();
    const evaluated = allActions
      .map(a => resolveActionStateAsOf(a, asOf))
      .filter(Boolean);
    res.json({ asOf, count: evaluated.length, actions: evaluated });
  } catch (err) {
    console.error('[Route /actions] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve actions', details: err.message });
  }
});

/**
 * GET /api/actions/:id?asOf=...
 */
router.get('/actions/:id', (req, res) => {
  try {
    const asOf = req.query.asOf || DEFAULT_AS_OF;
    const allActions = loadActions();
    const found = allActions.find(a => a.id === req.params.id);
    if (!found) {
      return res.status(404).json({ error: `Action '${req.params.id}' not found` });
    }
    const evaluated = resolveActionStateAsOf(found, asOf);
    res.json(evaluated);
  } catch (err) {
    console.error('[Route /actions/:id] Error:', err);
    res.status(500).json({ error: 'Failed to retrieve action', details: err.message });
  }
});

/**
 * POST /api/ask
 * Body: { question: string, asOf?: string }
 */
router.post('/ask', async (req, res) => {
  try {
    const { question, asOf = DEFAULT_AS_OF } = req.body;
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'A non-empty question string is required.' });
    }

    const answer = await askQuestion(question, asOf);
    res.json(answer);
  } catch (err) {
    console.error('[Route /ask] Error:', err);
    res.status(500).json({
      error: 'Failed to answer question',
      details: err.message,
      summary: 'I could not determine that from the available source data.'
    });
  }
});

/**
 * POST /api/pipeline/run
 */
router.post('/pipeline/run', async (req, res) => {
  try {
    const canonical = await runPipeline();
    res.json({
      success: true,
      message: 'Pipeline executed successfully',
      actionsCount: canonical.length
    });
  } catch (err) {
    console.error('[Route /pipeline/run] Error:', err);
    res.status(500).json({ error: 'Pipeline execution failed', details: err.message });
  }
});

export default router;
