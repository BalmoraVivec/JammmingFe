import React from 'react';
import Track from '../Track/Track.js';
import './Playlist.css';

class Playlist extends React.Component {
  render() {
    return (
      <div className="Playlist">
        <input type='text' value={this.props.playlistName.valuu} placeholder={this.props.playlistName.value} onChange={this.props.onChange}/>
        <div className="TrackList">
          {this.props.playlist.map(track => {
            // Build playlist from the playlist state (array)
            return (
              <Track
                key={track.id}
                id={track.id}
                name={track.name}
                artists={track.artists}
                album={track.album}
                // Informations specific to the playlist tracks
                uri={track.uri}
                onClick={this.props.onClick}
                linkContent='-'
              />
            );
          })}
        </div>
        <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
      </div>
    );
  }
}

export default Playlist;