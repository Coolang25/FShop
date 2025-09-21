import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs';

import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { useAppDispatch } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import AppRouter from 'app/routes/AppRouter';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

const AppContent = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  return <AppRouter />;
};

export const App = () => {
  return (
    <BrowserRouter basename={baseHref}>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
