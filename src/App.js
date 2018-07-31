import React, { Component } from 'react';
import ChatLayout from './chat/ChatLayout';
import { Router } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import createHistory from 'history/createBrowserHistory';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: purple[300],
      main: purple[500],
      dark: purple[700],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <Router history={createHistory({ basename: process.env.PUBLIC_URL })}>
          <ChatLayout />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
