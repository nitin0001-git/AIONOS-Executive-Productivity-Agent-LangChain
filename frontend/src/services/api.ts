import { ExecutiveBrief, QAResponse, SystemHealth, ActionItem } from '../types';

const API_BASE = '/api';

export async function fetchHealth(): Promise<SystemHealth> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    throw new Error(`Health check failed: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchBrief(asOf?: string): Promise<ExecutiveBrief> {
  const url = asOf ? `${API_BASE}/brief?asOf=${encodeURIComponent(asOf)}` : `${API_BASE}/brief`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch brief: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchActions(asOf?: string): Promise<ActionItem[]> {
  const url = asOf ? `${API_BASE}/actions?asOf=${encodeURIComponent(asOf)}` : `${API_BASE}/actions`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch actions: ${res.statusText}`);
  }
  const data = await res.json();
  return data.actions;
}

export async function fetchActionById(id: string, asOf?: string): Promise<ActionItem> {
  const url = asOf ? `${API_BASE}/actions/${id}?asOf=${encodeURIComponent(asOf)}` : `${API_BASE}/actions/${id}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch action ${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function askAgent(question: string, asOf?: string): Promise<QAResponse> {
  const res = await fetch(`${API_BASE}/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, asOf })
  });
  if (!res.ok) {
    throw new Error(`Q&A request failed: ${res.statusText}`);
  }
  return res.json();
}

export async function triggerPipeline(): Promise<{ success: boolean; message: string; actionsCount: number }> {
  const res = await fetch(`${API_BASE}/pipeline/run`, {
    method: 'POST'
  });
  if (!res.ok) {
    throw new Error(`Pipeline run failed: ${res.statusText}`);
  }
  return res.json();
}
