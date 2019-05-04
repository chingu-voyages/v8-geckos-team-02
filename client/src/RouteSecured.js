import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import Context from './context.js';

const RouteSecured = ({ component: Component, ...rest }) => {
  const { state } = useContext(Context);
  return (
    <Route
      render={props =>
        !state.isAuthenticated ? (
          <Redirect to="/login" />
        ) : (
          <Component {...props} />
        )
      }
      {...rest}
    />
  );
};

export default RouteSecured;
