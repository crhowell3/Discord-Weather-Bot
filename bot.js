const { Client } = require("discord.js");
const { token } = require("./auth.json");
var omni = "";
var pppp = "";

const client = new Client({
	disableEveryone: true,
});

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setPresence({
		activity: {
			name: "EVERYTHING",
			type: "WATCHING",
		},
		status: "online",
	});
	console.log(
		client.guilds.cache
			.get("690763269543034902")
			.members.cache.get("696937315804643362").presence
	);

	setInterval(function () {
		if (
			client.guilds.cache
				.get("690763269543034902")
				.members.cache.get("696937315804643362")
				.presence.equals("offline")
		) {
			if (omni != "offline") {
				client.channels.cache
					.get("690763269543034905")
					.send("@omni-bot#3177 is offline.");
			}
			omni = "offline";
		} else {
			if (omni != "online") {
				client.channels.cache
					.get("690763269543034905")
					.send("@omni-bot#3177 is online");
			}
			omni = "online";
		}

		if (
			client.guilds.cache
				.get("690763269543034902")
				.members.cache.get("752028279099097109")
				.presence.equals("offline")
		) {
			if (pppp != "offline") {
				client.channels.cache
					.get("690763269543034905")
					.send("@PPPP_Bot#8649 is offline.");
			}
			pppp = "offline";
		} else {
			if (pppp != "online") {
				client.channels.cache
					.get("690763269543034905")
					.send("@PPPP_Bot#8649 is online");
			}
			pppp = "online";
		}
	}, 5 * 1000);
});

client.login(token);
