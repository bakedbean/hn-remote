'use strict';

import React from 'react';
import moment from 'moment';

export default React.createClass({
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
