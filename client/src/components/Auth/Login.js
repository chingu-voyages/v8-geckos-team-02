import React, { useContext } from 'react';
import { GraphQLClient } from 'graphql-request';
import { GoogleLogin } from 'react-google-login';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Context from '../../context';
import { SELF_QUERY } from '../../graphql/queries';
import { BASE_URL } from '../../client';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async googleUser => {
    try {
      const tokenId = googleUser.getAuthResponse().id_token;
      //console.log({ tokenId });
      const client = new GraphQLClient(BASE_URL, {
        headers: { authorization: tokenId }
      });
      const data = await client.request(SELF_QUERY);
      //console.log({ data });
      dispatch({ type: 'USER_LOGIN', payload: data.self });
      dispatch({ type: 'LOGGED_IN', payload: googleUser.isSignedIn() });
    } catch (error) {
      onFailure(error);
    }
  };

  const onFailure = error => {
    console.error('Error logging in', error);
    dispatch({ type: 'LOGGED_IN', payload: false });
  };

  return (
    <div className={classes.login}>
      <Typography component="h1" variant="h3" gutterBottom noWrap>
        <div className={classes.welcome}>Welcome to Live2Live</div>
      </Typography>
      <GoogleLogin
        clientId="51693100956-43t4hnhtlqbhmoa9pelerdaq9nk0iee2.apps.googleusercontent.com"
        onSuccess={onSuccess}
        onFailure={onFailure}
        isSignedIn={true}
      />
    </div>
  );
};

const styles = {
  login: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  welcome: {
    background: 'linear-gradient(to right,#33ccff 25%, #ff99cc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  }
};

export default withStyles(styles)(Login);
