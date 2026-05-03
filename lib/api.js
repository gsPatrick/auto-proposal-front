const API_BASE_URL = 'https://geral-auto-proposal-api.r954jc.easypanel.host/api';

export const api = {
  /**
   * Busca as métricas de gastos e envios
   * @param {string} range - 'day', 'week', 'month', 'year'
   */
  async getMetrics(range = 'week', filters = {}) {
    try {
      const params = new URLSearchParams({ range, ...filters }).toString();
      const response = await fetch(`${API_BASE_URL}/proposals/metrics?${params}`);
      if (!response.ok) throw new Error('Falha ao carregar métricas');
      return await response.json();
    } catch (error) {
      console.error('API Error (Metrics):', error);
      throw error;
    }
  },

  /**
   * Busca o histórico de propostas enviadas
   */
  async getLogs(range = 'all', filters = {}) {
    try {
      const params = new URLSearchParams({ range, ...filters }).toString();
      const response = await fetch(`${API_BASE_URL}/proposals/logs?${params}`);
      if (!response.ok) throw new Error('Falha ao carregar histórico');
      return await response.json();
    } catch (error) {
      console.error('API Error (Logs):', error);
      throw error;
    }
  },

  // Wallet Methods
  async getBalance() {
    const response = await fetch(`${API_BASE_URL}/proposals/balance`);
    return await response.json();
  },

  async addDeposit(data) {
    const response = await fetch(`${API_BASE_URL}/proposals/balance/deposit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  },

  async getWalletHistory() {
    const response = await fetch(`${API_BASE_URL}/proposals/balance/history`);
    return await response.json();
  },

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/auth/users`);
    return await response.json();
  },

  async getUserMetrics() {
    const response = await fetch(`${API_BASE_URL}/auth/users/metrics`);
    return await response.json();
  }
};
