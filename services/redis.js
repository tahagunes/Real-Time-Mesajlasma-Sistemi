const { createClient } = require('redis');
const client = createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('Redis Client Error', err));
client.connect();

const ONLINE_USERS_SET = 'online_users';

async function addOnlineUser(userId) {
  await client.sAdd(ONLINE_USERS_SET, userId);
}

async function removeOnlineUser(userId) {
  await client.sRem(ONLINE_USERS_SET, userId);
}

async function getOnlineUsers() {
  return await client.sMembers(ONLINE_USERS_SET);
}

async function isUserOnline(userId) {
  return await client.sIsMember(ONLINE_USERS_SET, userId);
}

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  isUserOnline,
  client
};
