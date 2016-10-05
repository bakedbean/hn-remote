'use strict';

import React from 'react';
import Rebase from 're-base';
import * as conn from '../connection';

import search from '../search';
import Post from './Post';

let base = Rebase.createClass({
  databaseURL: conn.baseUrl
});

export default class App extends React.Component {
  constructor(props) {
    super(props);
    base.bindToState(conn.path + 'user/' + conn.user, {
      context: this,
      state: 'user',
      then: this.user
    });
  }

  state = {
    user: {},
    post: {},
    jobs: []
  }

  user() {
    let post = this.state.user.submitted.shift() - 2;
    base.bindToState(conn.path + 'item/' + post, {
      context: this,
      state: 'post',
      then: this.post
    });
  }

  post() {
    Promise.all(this.state.post.kids.map(id => base.fetch(conn.path + 'item/' + id, {
      context: this
    }))) 
    .then(kids => Promise.all(kids.filter(k => search(k))))
    .then(jobs => this.setState({ jobs: jobs }));
  }

  render() {
    return <div>
      <h1 className="header">{ this.state.post.title }</h1>
      <div className="container-fluid">
        <div className="row">
          <div className="job col-xs-12 col-lg-9">
            {this.state.jobs.length > 0 && <h3 className="sub-header">Total Remote Positions Found: { this.state.jobs.length }</h3>}
            {this.state.jobs.length > 0 ? this.state.jobs.map((j, i) => <Post key={i} item={j} />) : <div>loading...</div>}
          </div>
        </div>
      </div>
    </div>;
  }
}
