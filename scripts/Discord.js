const SERVER_ID = "858390516223311922"; // 🔁 Replace with your Discord server ID

fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`)
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("discord-name").textContent = data.name;
    document.getElementById(
      "discord-members"
    ).textContent = `${data.presence_count} online now`;
    document.getElementById(
      "discord-icon"
    ).src = `https://cdn.discordapp.com/icons/${SERVER_ID}/${data.icon}.png`;
    document.getElementById("discord-invite").href = data.instant_invite;

    document.getElementById(
      "discord-channels"
    ).textContent = `${data.channels.length} channels total`;

    const avatars = data.members.slice(0, 10); // limit to 10
    const avatarRow = document.getElementById("discord-avatars");

    avatars.forEach((user) => {
      const img = document.createElement("img");
      img.src = user.avatar_url;
      img.title = user.username;
      avatarRow.appendChild(img);
    });
  })
  .catch((err) => {
    console.error("Failed to load Discord widget:", err);
    document.getElementById("discord-name").textContent = "Unavailable";
    document.getElementById("discord-members").textContent = "Try again later.";
    document.getElementById("discord-invite").style.display = "none";
  });
