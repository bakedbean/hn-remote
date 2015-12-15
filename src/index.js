'use strict'

import 'lodash/index';
import 'firebase/lib/firebase-web';
import 'reactfire/dist/reactfire';
import 'react/react';

var Articles = React.createClass({
  render: function() {
    var _this = this;
    var createItem = function(item, index) {
      return (
        <li key={ index }>
          { item['.value'] }
        </li>
      );
    };
    return <ul>{ this.props.items.map(createItem) }</ul>;
  }
});

var App = React.createClass({
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    this.bindAsArray(new Firebase('https://hacker-news.firebaseio.com/v0/askstories'), 'items');
  },
  render: function() {
    return (
      <div>
        <Articles items={ this.state.items } />
      </div>
    );
  }
});

React.render(<App />, document.getElementsByTagName('body')[0]);
