// Necessary element to get a Spotify API token
const authorizationUrl = 'https://accounts.spotify.com/authorize?'
const clientId = "b9933fd974314dfda2dba0f734a34afa";
const responseType = "token";
const redirectUri = "http://localhost:3000/";
      // These scopes are necessary to ask for a token which permit to get tracks and save a playlist.
const scope = "user-read-private playlist-modify playlist-modify-private";

// Necessary element to search tracks
const searchUrl = 'https://api.spotify.com/v1/search?';
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }
    const URLToken = window.location.href.match(/access_token=([^&]*)/);
    const tokenExpiration = window.location.href.match(/expires_in=([^&]*)/);
    if (URLToken && tokenExpiration) {
      accessToken = URLToken[1];
      const expires = Number(tokenExpiration[1]);
      window.setTimeout(()=> accessToken = '', expires * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const authEndpoint = `${authorizationUrl}client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authEndpoint;
    }
  },
  async trackRequest() {
    this.getAccessToken();
    const inputValue = document.querySelector('#searchInput').value;
    // Handles query containing spaces
    const inputValueQuery = inputValue.replace(/ /g, '+');
    const searchEndpoint = `${searchUrl}q=${inputValueQuery}&type=track`;
    try {
      const response = await fetch(searchEndpoint , {
        headers: {
         Authorization: 'Bearer ' + accessToken
        },
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        const tracksArray = jsonResponse.tracks.items.map(item =>
          ({
          name: item.name,
          album: item.album.name,
          artists: item.artists[0].name,
          id: item.id,
          uri: item.uri
        }));
        return tracksArray;
      }
     } catch (error) {
      console.log(error);
    }
  },
  savePlaylist(playlistName, trackUris) {
    this.getAccessToken();
    let userId;
    const userIdEndpoint = 'https://api.spotify.com/v1/me';
    return fetch(userIdEndpoint, {
      // Get the user ID from Spotify
      headers: {
        Authorization: `Bearer ${accessToken}`
      }}).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      // Use the user ID to create a playlist and get the playlist ID
      const playlistEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;
      return fetch(playlistEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: playlistName})
    }).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Request failed!');
    }, networkError => {
      console.log(networkError.message)
    }).then(jsonResponse => {
      const playlistId = jsonResponse.id;
      // Add tracks to the playlist (using the user ID and the playlist ID)
      const playlistTracksEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
      return fetch(playlistTracksEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: JSON.stringify({uris: trackUris})
      });
    })
  })
  }
}

export default Spotify;