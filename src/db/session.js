const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenExpiresAt: { type: Date, required: true },
  refreshTokenExpiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = { Session };
