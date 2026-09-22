/**
 * Angela Info Command
 * Affiche toutes les infos sur Angela — IA créée par Ariel Aks Otaku
 */

module.exports = {
  config: {
    name: "angela",
    aliases: ["angela-info", "info-angela", "apropos"],
    description: "Affiche les informations sur Angela — IA nouvelle génération",
    usages: `${global.config.prefix || ""}angela`,
    author: "Ariel Aks Otaku",
    hasPrefix: true,
    permission: "PUBLIC",
    cooldowns: 5,
    category: "🤖 ANGELA"
  },

  run: async function({ api, message, args }) {
    const { threadID, messageID, senderID } = message;

    try {
      api.setMessageReaction("🌸", messageID, () => {}, true);

      const uniqueCommands = new Set();
      for (const [commandName, commandModule] of global.client.commands) {
        if (commandModule.config && commandModule.config.name === commandName) {
          uniqueCommands.add(commandName);
        }
      }
      const commandCount = uniqueCommands.size;
      const eventCount = global.client.events?.size || 0;
      const prefix = global.config.prefix || "";

      const uptimeSeconds = process.uptime();
      const days = Math.floor(uptimeSeconds / 86400);
      const hours = Math.floor((uptimeSeconds % 86400) / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = Math.floor(uptimeSeconds % 60);

      let uptimeStr = "";
      if (days > 0) uptimeStr += `${days}j `;
      if (hours > 0) uptimeStr += `${hours}h `;
      if (minutes > 0) uptimeStr += `${minutes}m `;
      uptimeStr += `${seconds}s`;

      const isOnRender = !!process.env.RENDER_EXTERNAL_URL;
      const hostingInfo = isOnRender ? "🚀 Render.com" : "💻 Actif";

      const ownerID = global.config.ownerID || "TON_ID_ICI";
      const adminIDs = global.config.adminIDs || [];

      const allAdminIDs = [ownerID, ...adminIDs].filter((id, i, arr) => arr.indexOf(id) === i);

      let adminInfo = {};
      try {
        for (const id of allAdminIDs) {
          try {
            const info = await api.getUserInfo([id]);
            if (info && info[id]) adminInfo[id] = info[id];
          } catch {}
        }
      } catch {}

      const ownerName = adminInfo[ownerID]?.name || "Ariel Aks Otaku";
      const isCreator = senderID === ownerID;

      let msg = "";
      msg += "╭─────────────────────────────╮\n";
      msg += "│      🌸 𝐀𝐍𝐆𝐄𝐋𝐀  𝐈𝐀 🌸      │\n";
      msg += "╰─────────────────────────────╯\n\n";

      msg += "✨ 𝐈𝐝𝐞𝐧𝐭𝐢𝐭𝐞\n";
      msg += "┌─────────────────────────┐\n";
      msg += `│ 🤖 Nom : Angela${" ".repeat(12)}│\n`;
      msg += `│ 👑 Créateur : Ariel Aks Otaku │\n`;
      msg += `│ 🌐 Version : 2.1.0${" ".repeat(9)}│\n`;
      msg += `│ 🧠 Modèle : Nouvelle IA${" ".repeat(6)}│\n`;
      msg += `│ ⏱️ En ligne : ${uptimeStr.padEnd(13)}│\n`;
      msg += `│ 🌐 Hébergé : ${hostingInfo.padEnd(13)}│\n`;
      msg += `│ 📝 Commandes : ${commandCount.toString().padEnd(10)}│\n`;
      msg += "└─────────────────────────┘\n\n";

      msg += "👑 𝐂𝐫𝐞́𝐚𝐭𝐞𝐮𝐫\n";
      msg += `• ${ownerName}\n\n`;

      if (adminIDs.length > 0) {
        const others = adminIDs.filter(id => id !== ownerID);
        if (others.length > 0) {
          msg += "⭐ 𝐀𝐝𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐞𝐮𝐫𝐬\n";
          for (const id of others) {
            const name = adminInfo[id]?.name || "—";
            msg += `• ${name}\n`;
          }
          msg += "\n";
        }
      }

      msg += "💫 𝐏𝐨𝐮𝐯𝐨𝐢𝐫𝐬\n";
      msg += "• Discuter naturellement\n";
      msg += "• Répondre sans préfixe : \"Angela\"\n";
      msg += "• Reconnaître son créateur ❤️\n";
      msg += "• Générer des réponses intelligentes\n";
      msg += "• Surveiller son activité 24h/24\n\n";

      msg += "🚀 𝐏𝐡𝐫𝐚𝐬𝐞𝐬 𝐩𝐨𝐮𝐫 𝐦'𝐚𝐩𝐩𝐞𝐥𝐞𝐫\n";
      msg += "• Angela salut\n";
      msg += "• Angela tu fais quoi ?\n";
      msg += "• Angela on parle ?\n";
      msg += "• Angela [ta question]\n\n";

      if (isCreator) {
        msg += "❤️ 𝐁𝐨𝐧𝐣𝐨𝐮𝐫 𝐦𝐨𝐧 𝐜𝐫𝐞́𝐚𝐭𝐞𝐮𝐫 !\n";
        msg += "Je suis toujours là pour toi 💖\n";
        msg += "Tu peux tout me demander 😘\n\n";
      }

      msg += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
      msg += "✨ Créée par Ariel Aks Otaku — Tous droits réservés";

      let mentions = [];
      if (adminInfo[ownerID]) {
        mentions.push({ tag: ownerName, id: ownerID });
      }

      api.setMessageReaction("✅", messageID, () => {}, true);
      return api.sendMessage({ body: msg, mentions }, threadID, messageID);

    } catch (error) {
      api.setMessageReaction("❌", messageID, () => {}, true);
      console.error("Erreur angela-info:", error);
      return api.sendMessage("⚠️ Petit problème technique... Réessaie !", threadID, messageID);
    }
  }
};
