import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardExtension } from '@openmrs/esm-framework';

export function createDashboardLink(db: any) {
  return function ({ basePath }: { basePath: string }) {
    return (
      <BrowserRouter>
        <DashboardExtension basePath={basePath} title={db.title} path={db.path} icon={db.icon} />
      </BrowserRouter>
    );
  };
}