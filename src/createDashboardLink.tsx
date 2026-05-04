import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardExtension } from '@openmrs/esm-framework';

export function createDashboardLink(db: any) {
  return function ({ basePath }: { basePath: string }) {
    const base = basePath ? basePath : db.basePath;
    return (
      <BrowserRouter>
        <DashboardExtension basePath={base} title={db.title} path={db.path} icon={db.icon} />
      </BrowserRouter>
    );
  };
}