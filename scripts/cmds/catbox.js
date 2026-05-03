const axios = require("axios");

module.exports = {
  config: {
    name: "catbox",
    aliases: ["cb"],
    version: "2.0",
    author: "S AY EM",
    countDown: 5,
    role: 0,
    description: "Convert media to Catbox link",
    category: "tools",
    guide: "{pn}: Reply to image/video"
  },

  onStart: async function ({ api, event, message }) {
    try {

      if (
        event.type !== "message_reply" ||
        !event.messageReply.attachments ||
        event.messageReply.attachments.length === 0
      ) {
        return message.reply("📌 | Reply to an image or video!");
      }

      const attachment = event.messageReply.attachments[0];

      api.setMessageReaction("⏳", event.messageID, () => {}, true);
      const waitMsg = await message.reply("⬆️ Uploading to Catbox...");

      const fileUrl = encodeURIComponent(attachment.url);

      const apiUrl = `https://sayem-catbox-apixs.onrender.com/api/catbox?url=${fileUrl}`;

      const res = await axios.get(apiUrl, { timeout: 120000 });

      if (res.data && res.data.status && res.data.link) {

        if (waitMsg?.messageID) {
          api.unsendMessage(waitMsg.messageID);
        }

        return message.reply(
          `✅ Uploaded Successfully!\n\n🔗 ${res.data.link}`,
          () => api.setMessageReaction("✅", event.messageID, () => {}, true)
        );
      }

      throw new Error(res.data?.error || "Upload failed");

    } catch (err) {
      console.error(err);

      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return message.reply(`❌ Error: ${err.message}`);
    }
  }
};
