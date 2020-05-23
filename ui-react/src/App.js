import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { withRouter } from "react-router";

import UserList from "./UserList";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/" component={UserList} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
