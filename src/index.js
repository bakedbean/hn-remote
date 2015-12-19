'use strict'

import 'lodash/index';
import 'firebase/lib/firebase-web';
import 'reactfire/dist/reactfire';
import 'react/react';

var baseUrl = 'https://hacker-news.firebaseio.com/v0/';
var user = 'whoishiring';

var Article = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return { article: {} };
  },
  componentWillMount: function() {
    this.bindAsObject(new Firebase(baseUrl + 'item/' + this.props.id), 'article');
  },
  render: function() {
    return (
      <div>
        <strong>{ (this.state.article.by) }</strong> { this.state.article.title }
      </div>
    );
  }
});

var App = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return { user: {} };
  },
  componentWillMount: function() {
    this.bindAsObject(new Firebase(baseUrl + 'user/' + user), 'user');
  },
  render: function() {
    let post = _.first(this.state.user.submitted) - 2;

    let content = (
      <div>loading...</div>
    );

    if (post) {
      content = (
        <div>
          <Article id={ post } />
        </div>
      );
    }

    return content;
  }
});

React.render(<App />, document.getElementsByTagName('body')[0]);
