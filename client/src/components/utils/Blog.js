import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import Context from '../../context';
import NoContent from '../Pin/NoContent';
import CreatePin from '../Pin/CreatePin';

const Blog = ({ classes }) => {
  const { state } = useContext(Context);
  const { draft } = state;

  let Content;
  if (!draft) {
    Content = NoContent;
  } else if (draft) {
    Content = CreatePin;
  }
  return (
    <Paper className={classes.root}>
      <Content />
    </Paper>
  );
};

const styles = {
  root: {
    minWidth: 350,
    maxWidth: 400,
    maxHeight: 'calc(100vh - 64px)',
    overflowY: 'scroll',
    display: 'flex',
    justifyContent: 'center'
  }
};

export default withStyles(styles)(Blog);
