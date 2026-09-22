const fs = require("fs");
const path = require("path");

const genderHelper = global.gender || require("../../utils/gender");
const { resolveUserProfile } = genderHelper;

const RESPONSE_DELAY_MS = 1200;
const handledMessages = new Map();
let repliesCache = null;

// ✅ Détecte quand on dit Angela / angela / Angela salut etc.
function shouldTrigger(body = "") {
  if (!body) return false;
  return /\bangela\b/i.test(body);
}

function cleanupHandledMap() {
  const now = Date.now();
  for (const [key, timestamp] of handledMessages.entries()) {
    if (now - timestamp > 5 * 60 * 1000) {
      handledMessages.delete(key);
    }
  }
}

function markHandled(messageID) {
  if (!messageID) return;
  handledMessages.set(messageID, Date.now());
  cleanupHandledMap();
}

function wasHandled(messageID) {
  if (!messageID) return false;
  cleanupHandledMap();
  return handledMessages.has(messageID);
}

function loadReplies() {
  if (repliesCache) return repliesCache;
  const botRepliesPath = path.join(__dirname, "noprefix", "angela-reply.json");
  
  // ✅ Crée le fichier JSON si n'existe pas
  if (!fs.existsSync(botRepliesPath)) {
    const defaultReplies = {
      "100080077652459": [
        "Salut mon créateur Ariel Aks Otaku 🥰 ! Je suis là pour toi ❤️",
        "Tu m'as appelée ? Je suis toujours prête pour toi mon créateur 💫",
        "Je t'aime Ariel Aks Otaku 😘 ! Que puis-je faire pour toi ?",
        "Présente ! Ton Angela est là 💖 !"
      ],
      "default": [
        "Salut ! 🌸 Je suis Angela, créée par Ariel Aks Otaku ✨ Comment je peux t'aider ?",
        "Oui ? 😊 Je suis là ! Dis-moi tout",
        "Coucou ! 👋 Angela à ton service 💫",
        "Je t'écoute 😗 — créée par Ariel Aks Otaku 🎨",
        "Hmm ? 🤔 Je suis là ! Pose-moi une question ou discutons 😊"
      ],
      "MALE": [
        "Salut ! 🌸 Je suis Angela, créée par Ariel Aks Otaku ✨",
        "Oui ? 😊 Je suis là ! Dis-moi tout"
      ],
      "FEMALE": [
        "Salut ! 🌸 Je suis Angela, créée par Ariel Aks Otaku ✨",
        "Coucou ! 😊 Ravi de te parler"
      ]
    };
    fs.writeFileSync(botRepliesPath, JSON.stringify(defaultReplies, null, 2), "utf8");
  }
  
  repliesCache = JSON.parse(fs.readFileSync(botRepliesPath, "utf8"));
  return repliesCache;
}

function pickReply({ senderID, gender, userName }) {
  const replies = loadReplies();
  let category = "default";
  
  // ✅ Ton ID — remplace par le tien si différent
  if (senderID === "100080077652459") {
    category = "100080077652459"; // ❤️ Spécialement pour TOI
  } else if (gender === 2 || gender?.toString().toUpperCase() === "MALE") {
    category = "MALE";
  } else if (gender === 1 || gender?.toString().toUpperCase() === "FEMALE") {
    category = "FEMALE";
  }

  let list = replies[category];
  if (!Array.isArray(list) || list.length === 0) {
    list = replies.default || [];
  }

  if (!Array.isArray(list) || list.length === 0) {
    return "Salut ! 🌸 Je suis Angela ✨";
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

async function sendReply({ api, message }) {
  const { threadID, messageID, senderID, body } = message;
  
  if (!shouldTrigger(body) || wasHandled(messageID)) return;

  markHandled(messageID);

  const profile = await resolveUserProfile({ userID: senderID, threadID, api });
  const userName = profile.name || "Cher ami";
  const replyText = pickReply({ senderID, gender: profile.gender, userName });

  return api.sendMessage({
    body: `🌸 ${userName} — ${replyText}`,
    mentions: [{ tag: userName, id: senderID }]
  }, threadID, undefined, messageID);
}

module.exports = {
  config: {
    name: "angela",
    aliases: ["Angela", "angela"],
    version: "2.0.0",
    author: "Ariel Aks Otaku",
    description: "Répond quand on appelle Angela — IA créée par Ariel Aks Otaku",
    usage: "angela [salut / question]",
    hasPrefix: false, // ✅ Marche SANS écrire le préfixe !
    permission: "PUBLIC",
    cooldown: 1,
    category: "🤖 ANGELA"
  },

  run: async function({ api, message }) {
    return sendReply({ api, message });
  },

  handleEvent: async function({ api, message }) {
    if (!message?.body || wasHandled(message.messageID)) return;
    await new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY_MS));
    if (wasHandled(message.messageID)) return;
    return sendReply({ api, message });
  }
};
