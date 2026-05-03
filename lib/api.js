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
  }
};
