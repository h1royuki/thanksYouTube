const PlaylistService = require("./services/PlaylistService");
const readline = require("./modules/readline");

try {
  PlaylistService.getAllLikedVideos().then(likedVideos => {
    console.log(likedVideos.length + " liked videos recived");

    PlaylistService.getPlaylists().then(items => {
      const itemsTitle = items.map(value => {
        return value.snippet.title;
      });

      readline
        .chooseOne(
          "Choose playlist to save liked videos (enter number):",
          itemsTitle
        )
        .then(index => {
          const choosedPlaylist = items[index];

          PlaylistService.addVideosToPlaylist(
            choosedPlaylist.id,
            likedVideos
          ).then(result => {
            console.log(
              result.added +
                " videos added to playlist, " +
                result.error +
                " not added"
            );

            process.exit();
          });
        });
    });
  });
} catch (err) {
  console.log(err);
  process.exit();
}
