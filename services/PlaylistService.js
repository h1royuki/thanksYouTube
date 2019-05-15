const youtubeApi = require("../modules/youtubeApi");
const api = new youtubeApi("/../secret.json");

class PlaylistService {
  static async getAllLikedVideos(pageToken = null) {
    let likedVideos = [];

    const videos = await api.getLikedVideos(pageToken);

    likedVideos = videos.items;

    // if next page exist
    if (videos.nextPageToken) {
      const array = await this.getAllLikedVideos(videos.nextPageToken);
      return likedVideos.concat(array);
    }

    return likedVideos;
  }

  static async getPlaylists() {
    const playlists = await api.getPlaylists();
    if (playlists.items.length < 1) {
      throw new Error("Playlists not found. Please create one");
    }

    return playlists.items;
  }

  static async addVideosToPlaylist(playlistId, videos) {
    try {
      // statistic
      const result = {
        added: 0,
        error: 0
      };

      for (let i = 0; i < videos.length; i++) {
        let data = await api.addToPlaylist(playlistId, videos[i].id);

        if (data.snippet) {
          console.log(data.snippet.title + " added to playlist");
          result.added++;
        } else {
          result.error++;
          console.log("Error add item to playlist: " + data);
        }
      }
      return result;
    } catch (err) {
      console.log("Error add to playlist: " + err.message);
    }
  }
}

module.exports = PlaylistService;
