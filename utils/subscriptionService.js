const cron = require('node-cron');
const Subs = require('../models/Subs');

const deleteExpiredSubscriptions = async () => {
  const now = new Date();
  const result = await Subs.deleteMany({ endDate: { $lt: now } });
  console.log(`Deleted ${result.deletedCount} expired subscriptions`);
};

// Schedule the job to run every hour
cron.schedule('0 * * * *', () => {
  console.log('Checking for expired subscriptions...');
  deleteExpiredSubscriptions();
});

module.exports = deleteExpiredSubscriptions;