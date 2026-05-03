const API_BASE_URL = 'https://geral-auto-proposal-api.r954jc.easypanel.host/api';

export const api = {
  /**
   * Busca as métricas de gastos e envios
   * @param {string} range - 'day', 'week', 'month', 'year'
   */
  async getMetrics(range = 'week') {
    try {
      const response = await fetch(`${API_BASE_URL}/proposals/metrics?range=${range}`);
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
  async getLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/proposals/logs`);
      if (!response.ok) throw new Error('Falha ao carregar histórico');
      return await response.json();
    } catch (error) {
      console.error('API Error (Logs):', error);
      throw error;
    }
  }
};
