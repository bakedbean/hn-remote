'use strict';

import _ from 'lodash';
import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import * as conn from '../connection';

import Article from './Article';

export default React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return { user: {} };
  },
  componentWillMount: function() {
    this.bindAsObject(new Firebase(conn.baseUrl + 'user/' + conn.user), 'user');
  },
  render: function() {
    let post = _.first(this.state.user.submitted) - 2;

    let content = (
      <div>loading...</div>
    );

    if (post) {
      content = (
        <Article id={ post } />
      );
    }

    return content;
  }
});
