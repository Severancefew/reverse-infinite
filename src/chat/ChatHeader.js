import React from 'react';
import { rooms } from '../utils/constants';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    flexGrow: 1,
    marginBottom: '40px',
  },
  flex: {
    flexGrow: 1,
  },
};

const ChatHeader = ({ currentRoom, classes }) => {
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            Chat app - {rooms[currentRoom]} channel
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withStyles(styles)(ChatHeader);
