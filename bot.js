const { Client } = require("discord.js");
const { token } = require("./auth.json");
var omni = "";
var pppp = "";

const client = new Client({
	disableEveryone: true,
});

client.on("ready", async () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		activity: {
			name: "EVERYTHING",
			type: "WATCHING",
		},
		status: "online",
	});

	setInterval(function () {
		if (
			client.guilds.cache
				.get("690763269543034902")
				.members.cache.get("696937315804643362")
				.presence.status === "offline"
		) {
			if (omni != "offline") {
				client.channels.cache
					.get("690763269543034905")
					.send("カーリー is offline");
			}
			omni = "offline";
		} else {
			if (omni != "online") {
				client.channels.cache
					.get("690763269543034905")
					.send("カーリーis online");
			}
			omni = "online";
		}

		if (
			client.guilds.cache
				.get("690763269543034902")
				.members.cache.get("752028279099097109")
				.presence.status === "offline"
		) {
			if (pppp != "offline") {
				client.channels.cache
					.get("690763269543034905")
					.send("PPPP_Bot is offline");
			}
			pppp = "offline";
		} else {
			if (pppp != "online") {
				client.channels.cache
					.get("690763269543034905")
					.send("PPPP_Bot is online");
			}
			pppp = "online";
		}
	}, 5 * 1000);
});

client.login(token);
