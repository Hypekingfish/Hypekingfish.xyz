var embed = new Twitch.Embed("twitch-embed", {
  width: 854,
  height: 480,
  channel: "hypekingfish",
  layout: "video",
  autoplay: false,
});

embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
  var player = embed.getPlayer();
  player.play();
});
