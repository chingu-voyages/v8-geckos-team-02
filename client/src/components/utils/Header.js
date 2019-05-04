import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import Typography from '@material-ui/core/Typography';
import Signout from '../Auth/Signout';

import Context from '../../context';

const Header = ({ classes }) => {
  const { state } = useContext(Context);
  const { currentUser } = state;
  return (
    <div
      style={{
        background: 'linear-gradient(to right,#33ccff 25%, #ff99cc 100%)'
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <div className={classes.grow}>
            <Typography
              className={classes.welcome}
              component="h1"
              variant="h3"
              color="inherit"
              noWrap
            >
              Live2Live
            </Typography>
            <Typography
              className={classes.created}
              component="p"
              variant="h6"
              color="inherit"
              noWrap
            >
              Created By: Shahzad
            </Typography>
          </div>

          {currentUser && (
            <div className={classes.grow}>
              <img
                className={classes.picture}
                src={currentUser.picture}
                alt={currentUser.name}
              />
              <Typography variant="h5" color="inherit" noWrap>
                {currentUser.name}
              </Typography>
            </div>
          )}
          <Signout />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const styles = {
  main: {
    flexGrow: 1,
    backgroundImage: 'linear-gradient(to right,#33ccff 25%, #ff99cc 100%)'
  },
  grow: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    marginRight: '5px',
    color: 'green',
    fontSize: 45
  },
  mobile: {
    display: 'none'
  },
  picture: {
    height: '50px',

    marginRight: '10px',
    backgroundColor: '#e1bee7'
  },
  welcome: {
    background: 'linear-gradient(to right,#33ccff 25%, #ff99cc 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  created: {
    marginLeft: '10px',
    //color: 'green',
    fontSize: 10,
    marginTop: '25px',
    color: '#cccc'
  }
};

export default withStyles(styles)(Header);
