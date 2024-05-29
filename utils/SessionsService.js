const cron = require('node-cron');
const Session = require('../models/Session');



const deleteExpiredSessions = async () => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
  
    try {
      const result = await Session.deleteMany({ sessionDate: { $lt: oneHourAgo } });
      console.log(`Deleted ${result.deletedCount} expired sessions.`);
    } catch (err) {
      console.error('Error deleting expired sessions:', err);
    }
}

cron.schedule('0 * * * *', () => {
    console.log('Checking for expired subscriptions...');
    deleteExpiredSessions();
  });



  module.exports = deleteExpiredSessions;