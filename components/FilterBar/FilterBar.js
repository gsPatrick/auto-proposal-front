'use client';

import React, { useState, useEffect } from 'react';
import styles from './FilterBar.module.css';
import { api } from '../../lib/api';
import { Filter, X } from 'lucide-react';

const MODEL_OPTIONS = {
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-5.5', 'gpt-5.5-pro'],
  claude: ['claude-haiku-4-5', 'claude-sonnet-4-6', 'claude-opus-4-7'],
  google: ['gemini-1.5-flash', 'gemini-1.5-pro'],
  groq: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768']
};

export default function FilterBar({ onFilterChange }) {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    platform: '',
    userId: '',
    provider: '',
    model: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://geral-auto-proposal-api.r954jc.easypanel.host'}/api/auth/users`);
        const data = await response.json();
        setUsers(data || []);
      } catch (err) {
        console.error('Erro ao buscar usuários:', err);
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    
    // Reset model if provider changes
    if (field === 'provider') {
      newFilters.model = '';
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const reset = { platform: '', userId: '', provider: '', model: '' };
    setFilters(reset);
    onFilterChange(reset);
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className={styles.container}>
      <div className={styles.filterIcon}>
        <Filter size={18} />
        <span>Filtros</span>
      </div>

      <div className={styles.group}>
        <select 
          className={styles.select}
          value={filters.platform}
          onChange={(e) => handleChange('platform', e.target.value)}
        >
          <option value="">Todas Plataformas</option>
          <option value="99freelas">99Freelas</option>
          <option value="workana">Workana</option>
          <option value="freelancer">Freelancer.com</option>
        </select>

        <select 
          className={styles.select}
          value={filters.userId}
          onChange={(e) => handleChange('userId', e.target.value)}
        >
          <option value="">Todos Remetentes</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>

        <select 
          className={styles.select}
          value={filters.provider}
          onChange={(e) => handleChange('provider', e.target.value)}
        >
          <option value="">Todas IAs</option>
          <option value="openai">OpenAI</option>
          <option value="claude">Anthropic (Claude)</option>
          <option value="google">Google (Gemini)</option>
          <option value="groq">Groq</option>
        </select>

        <select 
          className={styles.select}
          value={filters.model}
          onChange={(e) => handleChange('model', e.target.value)}
          disabled={!filters.provider}
        >
          <option value="">Todos Modelos</option>
          {filters.provider && MODEL_OPTIONS[filters.provider]?.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {hasFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            <X size={14} />
            Limpar
          </button>
        )}
      </div>
    </div>
  );
}
