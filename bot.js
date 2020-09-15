const { Client } = require("discord.js");
const { token } = require("./auth.json");
var status = "";

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
	setInterval(function () {
		if (
			client.guilds.cache
				.get("690763269543034902")
				.members.cache.get("696937315804643362")
				.presence.equals("offline")
		) {
			if (status == "online") {
				client.channels.cache
					.get("690763269543034905")
					.send("@omni-bot is offline.");
			}
			status = "offline";
		} else {
			if (status == "offline") {
				client.channels.cache
					.get("690763269543034905")
					.message.send("@omni-bot is online");
			}
			status = "online";
		}
	}, 5 * 1000);
});

client.login(token);
