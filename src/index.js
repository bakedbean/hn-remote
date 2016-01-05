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
    let firstLine = this.props.item.text.split('\n')[0];
    let findParagraph = firstLine.search('<p>');
    if (findParagraph > 0) {
      firstLine = firstLine.substring(0, findParagraph);
    }
    let restOfText = this.props.item.text.substring(findParagraph);

    return (
      <div className="card">
        <div className="card-header">
          <h6 className="card-subtitle text-muted">Posted: { moment.unix(this.props.item.time, 'YYYYMMDD').fromNow() }</h6>
        </div>
        <div className="card-block">
          <h5 className="card-title" dangerouslySetInnerHTML={ this.markUp(firstLine) } />
          <p className="card-text" dangerouslySetInnerHTML={ this.markUp(restOfText) } />
        </div>
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
  search: function(job) {
    let distance = 0;

    if (!job.text) return false;
    let remote = job.text.toLowerCase().search('remote');
    let onsite = job.text.toLowerCase().search('onsite');

    if (remote > onsite) {
      distance = remote - onsite;
    } else if (remote > 0 && onsite > remote) {
      distance = onsite - remote;
    }

    if (distance < 25 && distance > 0) return true;
    return remote >= 0 && onsite < 0;
  },
  componentWillMount: function() {
    this.bindAsObject(new Firebase(baseUrl + 'item/' + this.props.id), 'item');
  },
  componentDidUpdate: function() {
    if (!this.state.posts) {
      $.when(...this.posts()).then(function() {
        this.setState({ posts: _.filter(arguments, job => this.search(job)) });
      }.bind(this));
    }
  },
  render: function() {
    let article;
    if (!this.state.posts) {
      article = (
        <div>
          <h1 className="header">{ this.state.item.title }</h1>
          loading...
        </div>
      );
    } else {
      var posts = _.map(this.state.posts, post => (<Post item={ post } />));

      article = (
        <div>
          <h1 className="header">{ this.state.item.title }</h1>
          <div className="container-fluid">
            <div className="row row-layout">
              <div className="col-xs-12 col-sm-9">
                <h3 className="sub-header">Total Remote Positions Found: { this.state.posts.length }</h3>
                { posts }
              </div>
            </div>
          </div>
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
        <Article id={ post } />
      );
    }

    return content;
  }
});

React.render(<App />, document.getElementsByTagName('body')[0]);
