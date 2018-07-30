import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    flexGrow: 1,
  },
});

class ChatInput extends React.Component {
  state = {
    value: '',
  };

  onChange = e => {
    const { value } = e.target;

    this.setState({ value });
  };

  onSubmit = e => {
    const { value } = this.state;
    const { sendMessage } = this.props;
    e.preventDefault();

    if (value.length > 0) {
      sendMessage(value);
      this.setState({
        value: '',
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.form} onSubmit={this.onSubmit}>
        <TextField
          className={classes.input}
          placeholder="Send message"
          value={this.state.value}
          onChange={this.onChange}
        />
        <Button onClick={this.onSubmit} type="submit">
          Submit
        </Button>
      </form>
    );
  }
}

export default withStyles(styles)(ChatInput);
