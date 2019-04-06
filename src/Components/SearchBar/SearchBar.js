import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  render() {
    return (
      <div className="SearchBar">
        <input type="search" id="searchInput" placeholder="Enter A Song Title" onKeyUp={this.props.onKeyUp} />
        <a onClick={this.props.onClick}>SEARCH</a>
      </div>
    );
  }
}

export default SearchBar;