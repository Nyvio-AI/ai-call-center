import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AgentSetup from './AgentSetup';
import CallPage from './CallPage';
import CallHistory from './CallHistory';
import Layout from './Layout';

export default function Router() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/agents" replace />} />
        <Route path="/agents" element={<AgentSetup />} />
        <Route path="/call" element={<CallPage />} />
        <Route path="/history" element={<CallHistory />} />
      </Routes>
    </Layout>
  );
}