import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Daily1440View } from './pages/Daily1440View';
import { GoalsView } from './pages/GoalsView';
import { ObjectivesView } from './pages/ObjectivesView';
import { ProjectsView } from './pages/ProjectsView';
import { ActivitiesView } from './pages/ActivitiesView';
import { HierarchicalView } from './pages/HierarchicalView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Daily1440View />} />
          <Route path="goals" element={<GoalsView />} />
          <Route path="projects" element={<ProjectsView />} />
          <Route path="objectives" element={<ObjectivesView />} />
          <Route path="activities" element={<ActivitiesView />} />
          <Route path="tasks" element={<HierarchicalView />} />
          <Route path="settings" element={<div className="p-8 glass rounded-xl">Ajustes del Ecosistema 1440</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
