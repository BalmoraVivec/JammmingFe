import React from 'react';
import './App.css';
import TrackList from '../TrackList/TrackList.js';
import Track from '../Track/Track.js';
import SearchBar from '../SearchBar/SearchBar.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tracklist: [],
      playlist: [],
      playlistName: {value: 'New playlist'},
    };
    this.searchResults = this.searchResults.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.changePlaylistName = this.changePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.enterPressed = this.enterPressed.bind(this);
  }
  searchResults() {
    Spotify.trackRequest().then(tracksArray => {
      this.setState({
        tracklist: tracksArray
      })
    });
  }
  enterPressed(e) {
    const unicode=e.keyCode
    if(unicode==13) {
      this.searchResults();
    }
  }
  addTrack(newPlayListItemId) {
    // Get the track from tracklist on click with the id
    const newPlayListItem = this.state.tracklist.filter(track => {
        return track.id === newPlayListItemId;
    });
    // Checks if this track is already included in the playlist
    const isIncluded = this.state.playlist.findIndex(track => {
        return track.id === newPlayListItemId;
    })
    // Updates playlist state if the track is not already included in the playlist
    if (isIncluded === -1) {
      this.setState(prevState => ({
        playlist: [...prevState.playlist, newPlayListItem[0]]
      }))
    }
  }
  removeTrack(playListItemId) {
    // On click, filter the playlist to keep only the tracks which does not correspond to the id.
    const newPlaylist = this.state.playlist.filter(track => {
        return track.id != playListItemId;
    });
    this.setState({
      playlist: newPlaylist
    })
  }
  changePlaylistName(e) {
    this.setState({playlistName: {value: e.target.value}});
  }
  savePlaylist() {
    const trackURIs = this.state.playlist.map(track => track.uri);
    const playlistName = this.state.playlistName.value;
    // Checks if the playlist has a name and is not empty before saving (otherwise error because of .then)
    if (!playlistName || !trackURIs.length) {return;};
    Spotify.savePlaylist(playlistName, trackURIs
      ).then(() => {
        this.setState({
        playlistName: {value: 'New Playlist', valuu: ''},
        playlist: []
      });
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar
            onClick={this.searchResults}
            onKeyUp={this.enterPressed}
          />
          <div className="App-playlist">
            <TrackList
              tracklist={this.state.tracklist}
              onClick={this.addTrack}
            />
            <Playlist
              playlist={this.state.playlist}
              onClick={this.removeTrack}
              onChange={this.changePlaylistName}
              playlistName={this.state.playlistName}
              onSave={this.savePlaylist}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;