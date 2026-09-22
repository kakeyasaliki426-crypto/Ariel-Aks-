/**
 * Angela Info — Sans préfixe
 * Écris "prefix" ou "info" → Angela répond
 */

module.exports = {
  config: {
    name: 'prefix',
    aliases: ['info', 'angela-info', 'monbot'],
    description: 'Affiche les infos d\'Angela — IA créée par Ariel Aks Otaku',
    usage: 'prefix / info',
    author: "Ariel Aks Otaku",
    hasPrefix: false, // ✅ Marche SANS préfixe !
    permission: 'PUBLIC',
    cooldown: 5,
    category: '🤖 ANGELA'
  },

  run: async function ({ api, message, args }) {
    const { threadID, messageID, senderID } = message;

    try {
      const userName = message.senderName || "Cher ami";
      const prefix = global.config.prefix || "";
      const ownerID = global.config.ownerID;
      const isCreator = senderID === ownerID;

      const uniqueCommands = new Set([...global.client.commands.values()].map(cmd => cmd.config.name)).size;

      let messageText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃     🌸 𝐀𝐍𝐆𝐄𝐋𝐀  𝐈𝐀 🌸     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━┛

👋 Bonjour ${userName} !

🤖 Nom : Angela
✨ Créée par : Ariel Aks Otaku
📌 Préfixe : ${prefix || "Aucun — écris simplement le nom !"}
📊 Commandes : ${uniqueCommands} disponibles

💫 Comment m'utiliser :
• Écris "Angela" → je réponds
• Écris "help" → la liste des commandes
• Écris "angela [ta question]" → on discute

`;

      if (isCreator) {
        messageText += `❤️ 𝐁𝐨𝐧𝐣𝐨𝐮𝐫 𝐦𝐨𝐧 𝐜𝐫𝐞́𝐚𝐭𝐞𝐮𝐫 !
Je suis toujours là pour toi 💖
Tout ce que j'ai, c'est grâce à toi 😘

`;
      }

      messageText += `👑 Créateur : Ariel Aks Otaku
✨ Tous droits réservés — 2026`;

      return api.sendMessage(messageText, threadID, messageID);

    } catch (error) {
      console.error("❌ Erreur Angela-info:", error.message);
      return api.sendMessage(
        `⚠️ Petit problème... Réessaie !`,
        threadID,
        messageID
      );
    }
  }
};
