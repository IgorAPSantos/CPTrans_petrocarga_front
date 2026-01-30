'use client';

import { clientApi } from '../clientApi';
import { DashboardKPIs, DashboardSummary } from '../types/dashboard';

export async function RelatorioSumario(
  startDate?: string,
  endDate?: string,
): Promise<DashboardSummary> {
  const params = new URLSearchParams();

  if (startDate) {
    params.append('startDate', startDate);
  }

  if (endDate) {
    params.append('endDate', endDate);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';

  const res = await clientApi(
    `/petrocarga/api/v1/dashboard/summary${queryString}`,
    {
      method: 'GET',
    },
  );

  if (!res.ok) {
    throw new Error('Erro ao buscar resumo do dashboard');
  }
  const data = await res.json();
  return data;
}

export async function RelatorioKpis(
  startDate?: string,
  endDate?: string,
): Promise<DashboardKPIs> {
  const params = new URLSearchParams();

  if (startDate) {
    params.append('startDate', startDate);
  }

  if (endDate) {
    params.append('endDate', endDate);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';

  const res = await clientApi(
    `/petrocarga/api/v1/dashboard/kpis${queryString}`,
    {
      method: 'GET',
    },
  );

  if (!res.ok) {
    throw new Error('Erro ao buscar KPIs do dashboard');
  }
  const data = await res.json();
  return data;
}
