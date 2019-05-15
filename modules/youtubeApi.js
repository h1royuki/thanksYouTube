const api = require("youtube-api");
const open = require("open");
const readline = require("./readline");
const fs = require("fs");

class YouTubeApi {
  constructor(secretPath) {
    this.isAuthorized = false;
    this.secretPath = secretPath;
  }

  async authorization() {
    try {
      if (this.isAuthorized) {
        console.log("You already authorized");
        return;
      }

      // Parse JSON from file
      let apiKeys = JSON.parse(
        fs.readFileSync(__dirname + this.secretPath, "utf8")
      );

      const auth = api.authenticate({
        type: "oauth",
        client_id: apiKeys.installed.client_id,
        client_secret: apiKeys.installed.client_secret,
        redirect_url: apiKeys.installed.redirect_uris[0]
      });

      // oAuth URL
      const authUrl = auth.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/youtube"]
      });

      // Open in a browser
      open(authUrl);

      // Get auth token from command-line
      const token = await readline.askQuestion(
        "Please send me auth tokens: \n"
      );

      return new Promise((res, rej) => {
        auth.getToken(token, (err, tokens) => {
          if (err) {
            rej("Error generate token :c Try again maybe: " + err);
          }
          // Set tokens
          auth.setCredentials(tokens);

          this.isAuthorized = true;
          res();
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getPlaylists() {
    try {
      if (!this.isAuthorized) {
        await this.authorization();
      }
      // get user playlists
      return new Promise((res, rej) => {
        api.playlists.list(
          { part: "snippet", maxResults: 25, mine: true },
          (err, data) => {
            if (err) {
              rej("Error get playlists: " + err);
            }
            res(data);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getLikedVideos(nextPageToken = null) {
    try {
      if (!this.isAuthorized) {
        await this.authorization();
      }

      return new Promise((res, rej) => {
        api.videos.list(
          {
            part: "id",
            myRating: "like",
            maxResults: 50,
            pageToken: nextPageToken
          },
          (err, data) => {
            if (err) {
              rej("Error get liked videos: " + err);
            }
            res(data);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }

  async addToPlaylist(playlistId, videoId) {
    try {
      if (!this.isAuthorized) {
        await this.authorization();
      }
      return new Promise(res => {
        api.playlistItems.insert(
          {
            part: "snippet",
            resource: {
              snippet: {
                playlistId: playlistId,
                resourceId: {
                  kind: "youtube#video",
                  videoId: videoId
                }
              }
            }
          },
          (err, data) => {
            if (err) {
              res(err);
            }
            res(data);
          }
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = YouTubeApi;
