// @vitest-environment jsdom

import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuditHistoryPanel } from './audit-history-panel';

describe('AuditHistoryPanel', () => {
  it('lists audit events for the demo badge, most recent first', () => {
    render(<AuditHistoryPanel />);

    expect(screen.getByText('Historial de auditoria')).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('verified');
    expect(items[0]).toHaveTextContent('Security checkpoint');
    expect(items[2]).toHaveTextContent('issued');
  });
});
