'use strict'

import 'lodash/index';
import 'firebase/lib/firebase-web';
import 'reactfire/dist/reactfire';
import 'react/react';
import '../styles/sass/main.scss';

var baseUrl = 'https://hacker-news.firebaseio.com/v0/';
var user = 'whoishiring';

var Post = React.createClass({
  markUp: function(content) {
    return { __html: content };
  },
  render: function() {
    return (
      <div className="well well-lg">
        <div>{ moment.unix(this.props.item.time, 'YYYYMMDD').fromNow() }</div>
        <div dangerouslySetInnerHTML={ this.markUp(this.props.item.text) } />
      </div>
    ); 
  }
});

var Article = React.createClass({
  mixins: [ReactFireMixin],
  getInitialState: function() {
    return { item: {} };
  },
  posts: function(article) {
    return _.map(this.state.item.kids, id => {
      let def = $.Deferred();
      let post = new Firebase(baseUrl + 'item/' + id);
      post.once('value', snapshot => {
        def.resolve({
          id: snapshot.child('id').val(),
          time: snapshot.child('time').val(),
          text: snapshot.child('text').val()
        });
      });
      return def.promise();
    });
  },
  componentWillMount: function() {
    this.bindAsObject(new Firebase(baseUrl + 'item/' + this.props.id), 'item');
  },
  componentDidUpdate: function() {
    $.when(...this.posts()).then(function() {
      this.setState({ posts: _.filter(arguments, job => job.text && job.text.search('remote') >= 0) });
    }.bind(this));
  },
  render: function() {
    let article;
    if (!this.state.posts) {
      article = (
        <div>
          <h1>{ this.state.item.title }</h1>
          loading...
        </div>
      );
    } else {
      var posts = _.map(this.state.posts, post => (<Post item={ post } />));

      article = (
        <div>
          <h1>{ this.state.item.title }</h1>
          <h2>Total Remote Positions Found: { this.state.posts.length }</h2>
          { posts }
        </div>
      );
    }
    return article;
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
        <div className="container-fluid">
          <div className="row row-layout">
            <div className="col-xs-12 col-sm-9">
              <Article id={ post } />
            </div>
          </div>
        </div>
      );
    }

    return content;
  }
});

React.render(<App />, document.getElementsByTagName('body')[0]);
