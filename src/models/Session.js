const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenExpiresAt: { type: Date, required: true },
  refreshTokenExpiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Session', SessionSchema);
