/**
 * Facebook Messenger Bot - Main Entry Point
 * This file initializes the bot and loads all required modules
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const moment = require('moment-timezone');

// Set global variables
global.client = {};
global.config = {};
global.utils = {};
global.api = {};
global.startTime = new Date();

// Load global modules
require('./utils/global');

const logger = global.logger;
logger.system('Starting bot...');

// Log configuration loaded
try {
  console.log(chalk.green('[CONFIG]'), 'Loaded configuration successfully');
} catch (error) {
  console.error(chalk.red('[ERROR]'), 'Failed to load config.json:', error.message);
  process.exit(1);
}

// Create public directory if it doesn't exist
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
  logger.system('Created public directory for web server');
}

// ==================================================
// ✅ MONGODB DÉSACTIVÉ — ON DÉMARRE SANS ATTENDRE
// ==================================================
console.log('[CONSOLE] MongoDB skipped — running without database ✅');

// Start HTTP server for preview
const server = require('./utils/server');
server.startServer();

// Load main bot file directly — no MongoDB needed
require('./main.js');

// ==================================================
// 📋 TOUT CE QUI SUIT EST IDENTIQUE À TON FICHIER
// ==================================================

// Add global error handlers for better logging
process.on('uncaughtException', (err) => {
  global.logger.error('❌ Uncaught Exception:');
  global.logger.error(err);
  console.error('❌ Uncaught Exception:');
  console.error(err);
  // Don't exit the process to keep the bot running
});

process.on('unhandledRejection', (reason, promise) => {
  const timestamp = new Date().toISOString();
  
  // Enhanced logging with highlighting
  if (global.logger && global.logger.error) {
    global.logger.error('🚨 UNHANDLED PROMISE REJECTION DETECTED 🚨');
    global.logger.error('📍 Location:', promise);
    global.logger.error('🔥 Reason:', reason);
    global.logger.error('⏰ Timestamp:', timestamp);
  }
  
  // Create highlighted error box in console
  console.error('\n' + '🚨'.repeat(25));
  console.error('❌ UNHANDLED PROMISE REJECTION DETECTED');
  console.error('📍 Promise:', promise);
  console.error('🔥 Reason:', reason);
  console.error('⏰ Time:', timestamp);
  console.error('🚨'.repeat(25) + '\n');
  
  // Don't exit the process to keep the bot running
});

logger.system('Bot initialization complete');
