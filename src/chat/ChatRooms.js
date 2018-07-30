import React from 'react';
import { Link } from 'react-router-dom';
import { rooms } from '../utils/constants';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  rooms: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const ChatRooms = ({ classes }) => {
  return (
    <div className={classes.rooms}>
      {Object.values(rooms).map(room => (
        <Button key={room}>
          <Link to={`/${room}`}>{room}</Link>
        </Button>
      ))}
    </div>
  );
};

export default withStyles(styles)(ChatRooms);
