import React from 'react';
import { NavLink } from 'react-router-dom';
import { rooms } from '../utils/constants';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  rooms: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const ChatRooms = ({ classes, setRoom, currentRoom }) => {
  return (
    <div className={classes.rooms}>
      {Object.values(rooms).map(room => (
        <NavLink activeStyle={{ color: 'red' }} to={`/${room}`}>
          <Button key={room} onClick={() => setRoom(currentRoom === 0 ? 1 : 0)}>
            {room}
          </Button>
        </NavLink>
      ))}
    </div>
  );
};

export default withStyles(styles)(ChatRooms);
