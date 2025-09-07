import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ChatbotLog from './chatbot-log';
import ChatbotLogDetail from './chatbot-log-detail';
import ChatbotLogUpdate from './chatbot-log-update';
import ChatbotLogDeleteDialog from './chatbot-log-delete-dialog';

const ChatbotLogRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ChatbotLog />} />
    <Route path="new" element={<ChatbotLogUpdate />} />
    <Route path=":id">
      <Route index element={<ChatbotLogDetail />} />
      <Route path="edit" element={<ChatbotLogUpdate />} />
      <Route path="delete" element={<ChatbotLogDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ChatbotLogRoutes;
