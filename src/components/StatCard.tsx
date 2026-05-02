import type { CSSProperties } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  accent?: string;
}

export const StatCard = ({ label, value, accent = '#e10600' }: StatCardProps) => (
  <article className="stat-card" style={{ '--accent': accent } as CSSProperties}>
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
);

