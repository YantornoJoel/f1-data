import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const SectionHeader = ({ eyebrow, title, description, action }: SectionHeaderProps) => (
  <div className="section-header">
    <div>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
    {action ? <div className="section-action">{action}</div> : null}
  </div>
);
