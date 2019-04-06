import React from 'react';
import './Track.css';

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  // Select and pass the track ID on click
  handleClick(e) {
      const ItemId = `${this.props.id}`;
      this.props.onClick(ItemId);
      e.preventDefault();
  }
  render() {
    return (
      <div className="Track" id={this.props.id}>
        <div className="Track-information">
          <h3>{this.props.name}</h3>
          <p>{this.props.artists} | {this.props.album}</p>
        </div>
        <a className="Track-action" onClick={this.handleClick}>{this.props.linkContent}</a>
      </div>
    );
  }
}

export default Track;