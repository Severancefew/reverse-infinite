import React from 'react';
import { userNames, rooms } from '../utils/constants';
import copy from 'copy-to-clipboard';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { newDayString } from '../utils/isRecent';

const styles = {
  paper: {
    padding: '10px',
    display: 'flex',
  },
  avatarWrapper: {
    paddingRight: '10px',
    marginTop: '10px',
  },
  avatar: {
    width: '40px',
    height: '40px',
  },
  messageHeader: {
    margin: '10px 0',
  },
  messageId: {
    textDecoration: 'underline',
    color: 'blue',
    cursor: 'pointer',
  },
  hasRecent: {
    margin: '0 0 10px 50px',
  },
  hasRecentDay: {
    marginBottom: '10px',
  },
  messageText: {
    margin: '10px',
  },
};

class ChatMessage extends React.Component {
  copyToClipboard = () => {
    const { currentRoom, timestamp } = this.props;
    // eslint-disable-next-line
    const { protocol, host } = location;

    copy(`${protocol}//${host}/${rooms[currentRoom]}/${timestamp}`);
  };

  render() {
    const { userId, hasRecentBefore, text, idx, date, classes } = this.props;

    return (
      <div className={classes.paper}>
        {!hasRecentBefore && (
          <div className={classes.avatarWrapper}>
            <Avatar
              src="http://via.placeholder.com/40x40"
              className={classes.avatar}
            />
          </div>
        )}
        <div>
          {!hasRecentBefore && (
            <div className={classes.messageHeader}>
              <span
                className={classes.messageId}
                onClick={this.copyToClipboard}
              >
                # {idx}
              </span>
              {userNames[userId]} {newDayString(date)}
            </div>
          )}
          <div className={hasRecentBefore ? classes.hasRecent : undefined}>
            {text}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(ChatMessage);
