const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

const client = { commands: new Collection() };

// Simulate the command loading from index.js
const commandsPath = path.join(__dirname, 'src/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));

console.log('Loading commands from:', commandsPath);
for (const file of commandFiles) {
  try {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
      client.commands.set(command.data.name, command);
      console.log('✅ Loaded:', command.data.name);
    } else {
      console.log('❌ Missing data or execute:', file);
    }
  } catch (error) {
    console.log('❌ Error loading:', file, error.message);
  }
}

console.log(`\nLoaded ${client.commands.size} commands`);

// Simulate the ready.js command collection
const commands = client.commands.map(command => {
  try {
    const json = command.data?.toJSON();
    return json;
  } catch (error) {
    console.log('❌ toJSON failed for', command.data?.name, ':', error.message);
    return null;
  }
}).filter(Boolean);

console.log(`Converted ${commands.length} commands to JSON`);
console.log('Command names:', commands.map(c => c.name).join(', '));

// Clean up
process.exit(0);
