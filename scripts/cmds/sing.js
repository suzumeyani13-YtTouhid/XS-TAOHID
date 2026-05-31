const axios = require("axios");

module.exports = {
  config: {
    name: "sing",
    version: "1.0",
    author: "S AY EM + RI F AT API",
    countDown: 5,
    role: 0,
    shortDescription: "Search & download song",
    longDescription: "Search song and send audio using API",
    category: "media",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ api, event, args }) {
    try {
      const query = args.join(" ");
      if (!query) {
        return api.sendMessage("⚠️ | Please enter a song name.", event.threadID, event.messageID);
      }

      const apiUrl = `https://rifatapiv3.vercel.app/api/media/song?prompt=${encodeURIComponent(query)}`;

      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data.status || !data.result) {
        return api.sendMessage("❌ | Song not found!", event.threadID, event.messageID);
      }

      const song = data.result;

      const msg = 
`🎵 | Title: ${song.title}
👤 | Artist: ${song.author}
⏱️ | Duration: ${song.duration}
👀 | Views: ${song.views}
🔗 | URL: ${song.url}`;

      // audio stream
      const audio = (await axios.get(song.download_url, { responseType: "stream" })).data;

      return api.sendMessage({
        body: msg,
        attachment: audio
      }, event.threadID, event.messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ | Error fetching song!", event.threadID, event.messageID);
    }
  }
};
