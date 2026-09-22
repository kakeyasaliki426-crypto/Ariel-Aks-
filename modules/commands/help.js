/**
 * Help Command — Devient le menu d'Angela
 * Écris simplement "help" → affiche toutes les commandes
 */

module.exports = {
  config: {
    name: 'help',
    aliases: ['aide', 'menu', 'cmds'],
    description: 'Affiche les commandes d\'Angela — IA créée par Ariel Aks Otaku',
    usage: 'help [page/tout/commande]',
    author: "Ariel Aks Otaku",
    hasPrefix: false, // ✅ MARCHE SANS PRÉFIXE ! Écris juste "help"
    permission: 'PUBLIC',
    cooldown: 2,
    category: '🤖 ANGELA'
  },

  run: async function ({ api, message, args }) {
    const { threadID, messageID, senderID } = message;
    const prefix = global.config.prefix || "";
    const ownerID = global.config.ownerID;
    const isCreator = senderID === ownerID;

    // Détail d'une commande
    if (args.length > 0 && isNaN(args[0]) && !["tout", "all"].includes(args[0].toLowerCase())) {
      const commandName = args[0].toLowerCase();
      const command = global.client.commands.get(commandName) ||
        [...global.client.commands.values()].find(cmd =>
          cmd.config.aliases && cmd.config.aliases.includes(commandName)
        );

      if (!command) {
        return api.sendMessage(`❌ Commande "${commandName}" introuvable.`, threadID, messageID);
      }

      const ok = await global.permissions.checkPermission(senderID, command.config.permission);
      if (!ok) {
        return api.sendMessage(`❌ Tu n'as pas l'autorisation de voir cette commande.`, threadID, messageID);
      }

      const cmdUsage = command.config.usage?.replace('{prefix}', prefix) || 
                      (command.config.hasPrefix === false ? command.config.name : `${prefix}${command.config.name}`);

      let reply = `╭─────────────────────╮
│    🌸 COMMANDE 🌸    │
╰─────────────────────╯

📌 𝗡𝗢𝗠: ${command.config.name}
📝 𝗗𝗘𝗦𝗖𝗥𝗜𝗣𝗧𝗜𝗢𝗡: ${command.config.description || 'Aucune description'}
🔄 𝗨𝗦𝗔𝗚𝗘: ${cmdUsage}
⏱️ 𝗔𝗧𝗧𝗘𝗡𝗧𝗘: ${command.config.cooldown || 5}s
🔑 𝗔𝗩𝗘𝗖 𝗣𝗥𝗘́𝗙𝗜𝗫𝗘: ${command.config.hasPrefix === false ? 'Non ✅' : 'Oui'}
📂 𝗖𝗔𝗧𝗘́𝗚𝗢𝗥𝗜𝗘: ${command.config.category || 'Autres'}
👑 𝗔𝗨𝗧𝗘𝗨𝗥: ${command.config.author || 'Ariel Aks Otaku'}`;

      if (command.config.aliases?.length > 0) {
        reply += `\n🔄 𝗔𝗟𝗜𝗔𝗦𝗘𝗦: ${command.config.aliases.join(', ')}`;
      }

      reply += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Créée par Ariel Aks Otaku`;

      return api.sendMessage(reply, threadID, messageID);
    }

    const PAR_PAGE = 15;
    let toutVoir = false;
    let page = 1;

    if (args.length > 0) {
      if (["tout", "all"].includes(args[0].toLowerCase())) toutVoir = true;
      else if (!isNaN(args[0])) {
        page = parseInt(args[0]);
        if (page < 1) page = 1;
      }
    }

    const commandes = [...new Set(global.client.commands.values())];
    const autorisees = [];
    for (const cmd of commandes) {
      const ok = await global.permissions.checkPermission(senderID, cmd.config.permission || 'PUBLIC');
      if (ok) autorisees.push(cmd);
    }
    autorisees.sort((a, b) => a.config.name.localeCompare(b.config.name, 'fr'));

    const categoriesEmojis = {
      '🤖 ANGELA': '🌸',
      'SYSTEM': '⚙️',
      'UTILITY': '🔧',
      'FUN': '🎮',
      'ADMIN': '👑',
      'MODERATION': '🛡️',
      'ECONOMY': '💰',
      'GENERAL': '📋',
      'Autres': '📁'
    };

    const formatCmd = (cmd) => cmd.config.hasPrefix === false ? cmd.config.name : `${prefix}${cmd.config.name}`;

    if (toutVoir) {
      const parCategorie = {};
      for (const cmd of autorisees) {
        const cat = cmd.config.category || 'Autres';
        if (!parCategorie[cat]) parCategorie[cat] = [];
        parCategorie[cat].push(formatCmd(cmd));
      }

      let msg = `╭─────────────────────╮
│   🌸 𝗠𝗘𝗡𝗨 𝗗'𝗔𝗡𝗚𝗘𝗟𝗔 🌸   │
╰─────────────────────╯

📊 𝗧𝗢𝗧𝗔𝗟: ${autorisees.length} commandes
📝 𝗗𝗘́𝗧𝗔𝗜𝗟𝗦: help [commande]
📄 𝗣𝗔𝗚𝗘: help [numero]

`;

      if (isCreator) {
        msg += `❤️ 𝗕𝗢𝗡𝗝𝗢𝗨𝗥 𝗠𝗢𝗡 𝗖𝗥𝗘́𝗔𝗧𝗘𝗨𝗥 !\nJe suis toujours là pour toi 💖\n\n`;
      }

      const ordre = ['🤖 ANGELA', 'SYSTEM', 'UTILITY', 'FUN', 'ADMIN', 'MODERATION', 'ECONOMY', 'GENERAL', 'Autres'];
      const triees = Object.keys(parCategorie).sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b));

      for (const cat of triees) {
        const emoji = categoriesEmojis[cat] || '📁';
        msg += `┌─ ${emoji} ${cat} ───────────┐\n`;
        const liste = parCategorie[cat].sort();
        for (let i = 0; i < liste.length; i += 2) {
          msg += `│ ${liste.slice(i, i + 2).join(' • ')}\n`;
        }
        msg += '└─────────────────────────┘\n\n';
      }

      msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Angela — IA créée par Ariel Aks Otaku
💫 M'appeler : écris simplement "Angela" !`;

      return api.sendMessage(msg, threadID, messageID);
    }

    const totalPages = Math.ceil(autorisees.length / PAR_PAGE);
    const debut = (page - 1) * PAR_PAGE;
    const fin = debut + PAR_PAGE;
    const pageCmds = autorisees.slice(debut, fin);

    if (!pageCmds.length) {
      return api.sendMessage(`❌ Page ${page} introuvable. Total : ${totalPages} page(s)`, threadID, messageID);
    }

    const parCategorie = {};
    for (const cmd of pageCmds) {
      const cat = cmd.config.category || 'Autres';
      if (!parCategorie[cat]) parCategorie[cat] = [];
      parCategorie[cat].push(formatCmd(cmd));
    }

    let msg = `╭─────────────────────╮
│  🌸 𝗣𝗔𝗚𝗘 ${page}/${totalPages} 🌸  │
╰─────────────────────╯

📊 𝗧𝗢𝗧𝗔𝗟: ${autorisees.length} commandes
📄 𝗖𝗨𝗥𝗥𝗘𝗡𝗧: Page ${page}/${totalPages}
📝 𝗗𝗘́𝗧𝗔𝗜𝗟𝗦: help [nom]
📚 𝗧𝗢𝗨𝗧: help tout

`;

    if (isCreator) {
      msg += `❤️ Toujours là pour toi mon créateur 💖\n\n`;
    }

    const ordre = ['🤖 ANGELA', 'SYSTEM', 'UTILITY', 'FUN', 'ADMIN', 'MODERATION', 'ECONOMY', 'GENERAL', 'Autres'];
    const triees = Object.keys(parCategorie).sort((a, b) => ordre.indexOf(a) - ordre.indexOf(b));

    for (const cat of triees) {
      const emoji = categoriesEmojis[cat] || '📁';
      msg += `┌─ ${emoji} ${cat} ───────────┐\n`;
      const liste = parCategorie[cat].sort();
      for (let i = 0; i < liste.length; i += 2) {
        msg += `│ ${liste.slice(i, i + 2).join(' • ')}\n`;
      }
      msg += '└─────────────────────────┘\n\n';
    }

    if (totalPages > 1) {
      const prec = page > 1 ? page - 1 : totalPages;
      const suiv = page < totalPages ? page + 1 : 1;
      msg += `┌─ 𝗡𝗔𝗩𝗜𝗚𝗔𝗧𝗜𝗢𝗡 ─────────┐
│ ◀️ Précédent : help ${prec}
│ ▶️ Suivant   : help ${suiv}
│ 📚 Tout voir : help tout
└─────────────────────┘\n`;
    }

    msg += `✨ Créée par Ariel Aks Otaku`;
    return api.sendMessage(msg, threadID, messageID);
  }
};
