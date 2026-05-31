module.exports = {
	config: {
		name: "autoreact",
		version: "1.0",
		author: "S AY EM",
		countDown: 5,
		role: 1,
		shortDescription: {
			en: "Auto react to messages"
		},
		longDescription: {
			en: "Bot will automatically react to random user messages"
		},
		category: "fun",
		guide: {
			en: "{pn} on/off"
		}
	},

	onStart: async function ({ api, event, args, threadsData, message }) {
		const threadID = event.threadID;

		const data = await threadsData.get(threadID, "data") || {};

		if (args[0] == "on") {
			data.autoreact = true;
			await threadsData.set(threadID, data, "data");

			return message.reply("✅ | Auto React has been enabled.");
		}

		if (args[0] == "off") {
			data.autoreact = false;
			await threadsData.set(threadID, data, "data");

			return message.reply("❌ | Auto React has been disabled.");
		}

		return message.reply("⚙️ | Use:\n/autoreact on\n/autoreact off");
	},

	onChat: async function ({ event, api, threadsData }) {
		try {
			if (!event.body) return;
			if (event.senderID == api.getCurrentUserID()) return;

			const threadData = await threadsData.get(event.threadID, "data") || {};

			if (!threadData.autoreact) return;

			const reacts = [
				"😸",
				"😹",
				"😮",
				"😿",
				"👍",
				"😩",
				"🤍",
				"💀",
				"🥰",
				"😎",
				"🤡",
				"🐸",
				"😛",
				"🤖",
				"✨"
			];

			const randomReact = reacts[Math.floor(Math.random() * reacts.length)];

			api.setMessageReaction(
				randomReact,
				event.messageID,
				(err) => {},
				true
			);

		} catch (e) {
			console.log(e);
		}
	}
};
