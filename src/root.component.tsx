import React from 'react';
import { useLeftNav, WorkspaceContainer } from '@openmrs/esm-framework';
import styles from './root.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserFeedbackForm from './user-feedback/user-feedback.component';

const Root: React.FC = () => {
 const spaBasePath = window.spaBase;
  useLeftNav({
    name: 'user-feeback-slot',
    basePath: spaBasePath,
    mode: 'normal',
  });
  return (
    <BrowserRouter basename={`${window.spaBase}/poc-features`}>
      <main className={styles.container}>
        <Routes>
          <Route path="user-feedback" element={<UserFeedbackForm />} />
        </Routes>
      </main>
      <WorkspaceContainer contextKey="home" />
    </BrowserRouter>
  );
};

export default Root;
