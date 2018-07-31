import React from 'react';
import ChatMessage from './ChatMessage';
import {
  List,
  AutoSizer,
  CellMeasurer,
  InfiniteLoader,
} from 'react-virtualized';
import { isNaN } from 'lodash-es';
import { isRecentMessage, isRecentDay } from '../utils/dateHelpers';

import { withStyles } from '@material-ui/core/styles';

const styles = {
  header: {
    margin: 0,
  },
};

class ChatList extends React.Component {
  static defaultProps = {
    history: {
      offset: 0,
      messages: [],
      rowCount: 0,
    },
  };

  state = {
    scrollToIdx: -1,
    loadByLink: false,
    initial: true,
  };

  componentDidMount() {
    if (this.getMessageNumber()) {
      return this.jumpToMessage();
    }

    return this.props.fetchMore();
  }

  getSnapshotBeforeUpdate(prevProps) {
    if (
      prevProps.history.messages.length === 0 &&
      this.props.history.messages.length > 0
    ) {
      return true;
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.params.channel !== this.props.params.channel) {
      this.props.fetchMore();
    }

    // on initial load scroll to bottom
    if (snapshot !== null) {
      return this.scrollToIndex({ idx: 49, initial: true });
    }
  }

  getMessageNumber = () => {
    const {
      params: { message },
    } = this.props;

    return isNaN(parseInt(message, 10)) ? false : parseInt(message, 10);
  };

  isScrolledAlready = (scrollTo, currentScroll) => scrollTo === currentScroll;

  jumpToMessage = () => {
    this.setState({ loadByLink: true }, () => {
      const { history, fetchMore } = this.props;
      const { loadByLink, scrollToIdx } = this.state;

      const minimalMessageOffset = 5;
      const messageInt = this.getMessageNumber();
      const count = history.messages.length;
      const amountToFetch =
        count < messageInt ? messageInt + minimalMessageOffset : 0;

      // we do have message number, did not scroll to it
      if (
        messageInt &&
        !this.isScrolledAlready(messageInt, scrollToIdx) &&
        loadByLink
      ) {
        if (amountToFetch) {
          fetchMore(
            {
              from: count,
              pageSize: messageInt - (count - minimalMessageOffset),
            },
            () => {
              this.scrollToIndex({ idx: 0 });
            },
          );
        } else {
          this.scrollToIndex({ idx: 0 });
        }
      }

      this.setState({ loadByLink: false });
    });
  };

  scrollToIndex = ({ idx, initial }) => {
    const { changeRowCounter } = this.props;

    if (this.isScrolledAlready(this.state.scrollToIdx, idx)) {
      return;
    }

    // just to ensure we won't trigger infinite right after rows rendered
    this.setState(
      {
        scrollToIdx: idx,
      },
      () => {
        if (initial) {
          this.setState(
            {
              initial: false,
            },
            () => changeRowCounter(idx),
          );
        }
      },
    );
  };

  isRowLoaded = ({ index }) => {
    if (this.props.isLoading || this.state.initial) {
      return true;
    }

    return index > 0;
  };

  rowRender = ({ index, key, parent, style }) => {
    const {
      history: { messages },
      currentRoom,
      classes,
      cache,
    } = this.props;
    const message = messages[index];
    // used to merge messages
    const hasRecentBefore =
      index !== 0 && isRecentMessage(messages[index - 1], message);
    const hasRecentDay =
      index !== 0 && isRecentDay(messages[index - 1], message);

    const date = new Date(message.timestamp);

    return (
      <CellMeasurer
        parent={parent}
        cache={cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
      >
        <div key={key} style={style} className={classes.row}>
          {hasRecentDay && (
            <h3 className={classes.header}>
              {`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`}
            </h3>
          )}
          <ChatMessage
            date={date}
            hasRecentBefore={hasRecentBefore}
            {...message}
            currentRoom={currentRoom}
          />
        </div>
      </CellMeasurer>
    );
  };

  render() {
    const { history, fetchMore, classes, cache, onResize } = this.props;

    return (
      <InfiniteLoader
        minimumBatchSize={1}
        isRowLoaded={this.isRowLoaded}
        threshold={0}
        rowCount={history.rowCount}
        loadMoreRows={() => fetchMore()}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer onResize={onResize}>
            {({ width, height }) => (
              <List
                ref={ref => {
                  this.props.setRef(ref);

                  registerChild(ref);
                }}
                className={classes.list}
                onRowsRendered={onRowsRendered}
                deferredMeasurementCache={cache}
                rowHeight={cache.rowHeight}
                rowCount={history.messages.length}
                rowRenderer={this.rowRender}
                width={width}
                height={height}
                scrollToIndex={this.state.scrollToIdx}
                scrollToAlignment={'center'}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    );
  }
}

export default withStyles(styles)(ChatList);
