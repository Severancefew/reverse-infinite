import React from 'react';
import { get } from 'lodash-es';
import { fetchHistory } from '../utils/fakeApi';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { flow } from 'lodash-es';
import { Redirect, withRouter, Route } from 'react-router-dom';
import { CellMeasurerCache } from 'react-virtualized';
import ChatInput from './ChatInput';
import ChatRooms from './ChatRooms';
import ChatList from './ChatList';
import ChatHeader from './ChatHeader';

import { rooms } from '../utils/constants';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    flexGrow: 1,
  },
  header: {
    minHeight: '50px',
    flexGrow: 0,
  },
  messages: {
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'stretch',
    flexGrow: 1,
  },
  input: {
    flexShrink: 0,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class Chat extends React.Component {
  cache = new CellMeasurerCache({
    fixedWidth: true,
  });

  ref = null;

  state = {
    isLoading: false,
    history: {},
    currentRoom: 0,
  };

  setRoom = currentRoom => {
    this.setState({
      currentRoom,
    });
  };

  setRef = node => {
    this.ref = node;
  };

  changeRowCounter = rowCount => {
    this.setState(({ history, currentRoom }) => {
      return {
        history: {
          ...history,
          [currentRoom]: {
            ...history[currentRoom],
            rowCount,
          },
        },
      };
    });
  };

  onResize = () => {
    if (!this.ref) {
      return;
    }

    this.cache.clearAll();
    this.ref.recomputeRowHeights();
  };

  scrollToRow = idx => this.ref.scrollToRow(idx);

  fetchMore = (params, cb = () => {}) => {
    const { isLoading, history, currentRoom } = this.state;

    const prevMessages = get(history, `[${currentRoom}].messages`, []);
    const prevOffset = get(history, `[${currentRoom}].offset`, 0);

    if (isLoading) {
      return;
    }

    this.setState(
      {
        isLoading: true,
      },
      () => {
        fetchHistory({
          offset: prevOffset,
          ...params,
        }).then(resp => {
          const messages = [...resp.messages, ...prevMessages];

          this.setState(
            prevState => ({
              history: {
                [prevState.currentRoom]: {
                  ...resp,
                  messages,
                  rowCount: messages.length,
                  offset: prevOffset + 1,
                },
              },
              isLoading: false,
            }),
            () => {
              cb();
            },
          );
        });
      },
    );
  };

  sendMessage = text => {
    const { history, currentRoom } = this.state;
    const message = {
      text,
      timestamp: Date.now(),
      userId: 3,
    };

    this.setState(
      {
        history: {
          ...history,
          [currentRoom]: {
            ...history[currentRoom],
            messages: [...history[currentRoom].messages, message],
          },
        },
      },
      () => this.scrollToRow(history[currentRoom].messages.length + 1),
    );
  };

  render() {
    const { classes } = this.props;
    const { isLoading, currentRoom, history } = this.state;

    return (
      <div className={classes.root}>
        {this.props.location.pathname === '/' && (
          <Redirect to={`/${rooms[currentRoom]}`} />
        )}
        <Grid container direction="row">
          <Grid className={classes.header} item xs={12}>
            <ChatHeader currentRoom={currentRoom} />
          </Grid>
        </Grid>
        <Grid className={classes.messages} container>
          <div className={classes.messageWrapper}>
            <Grid item xs={2}>
              <ChatRooms setRoom={this.setRoom} currentRoom={currentRoom} />
            </Grid>
            <Grid item xs={10}>
              <Route
                path="/:channel/:message?"
                render={({ match }) => (
                  <ChatList
                    scrollToRow={this.scrollToRow}
                    onResize={this.onResize}
                    setRef={this.setRef}
                    cache={this.cache}
                    {...match}
                    currentRoom={currentRoom}
                    changeRowCounter={this.changeRowCounter}
                    isLoading={isLoading}
                    fetchMore={this.fetchMore}
                    history={history[currentRoom]}
                  />
                )}
              />
            </Grid>
          </div>
        </Grid>
        <Grid className={classes.input} container>
          <Grid item xs={12}>
            <ChatInput sendMessage={this.sendMessage} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default flow(
  withStyles(styles),
  withRouter,
)(Chat);
