'use strict';

import React from 'react';
import Firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import $ from 'jquery';
import _ from 'lodash';

import {baseUrl} from '../connection';
import search from '../search';
import Post from './Post';

export default React.createClass({
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
    if (!this.state.posts) {
      $.when(...this.posts()).then(function() {
        this.setState({ posts: _.filter(arguments, job => search(job)) });
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
            <div className="row">
              <div className="job col-xs-12 col-sm-9">
                <h3 className="sub-header">Total Remote Positions Found test: { this.state.posts.length }</h3>
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
