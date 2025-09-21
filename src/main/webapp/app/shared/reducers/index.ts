import { ReducersMapObject } from '@reduxjs/toolkit';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import administration from 'app/modules/admin/monitoring/administration.reducer';
import userManagement from 'app/modules/admin/monitoring/user-management/user-management.reducer';
import register from 'app/modules/public/auth/register/register.reducer';
import activate from 'app/modules/shared/auth/activate/activate.reducer';
import password from 'app/modules/user/account/password/password.reducer';
import settings from 'app/modules/user/account/settings/settings.reducer';
import passwordReset from 'app/modules/shared/auth/password-reset/password-reset.reducer';
import entitiesReducers from 'app/entities/reducers';
import applicationProfile from './application-profile';
import authentication from './authentication';
import locale from './locale';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  loadingBar,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  ...entitiesReducers,
};

export default rootReducer;
