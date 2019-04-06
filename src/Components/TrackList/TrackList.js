import React from 'react';
import Track from '../Track/Track.js';
import './TrackList.css';

class TrackList extends React.Component {
  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className="TrackList">
          {this.props.tracklist.map(track => {
            // Build tracklist from the tracklist state (array)
            return (
                <Track
                  key={track.id}
                  id={track.id}
                  name={track.name}
                  artists={track.artists}
                  album={track.album}
                  // Informations specific to the tracklist tracks
                  onClick={this.props.onClick}
                  linkContent='+'
                />
            );
          })}
        </div>
      </div>
    );
  }
}

export default TrackList;