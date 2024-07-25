const { Schema, model } = require('mongoose');

const sessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  refreshToken: { type: String, required: true },
  accessTokenValidUntil: { type: Date, required: true },
  refreshTokenValidUntil: { type: Date, required: true },
});

const Session = model('Session', sessionSchema);

module.exports = { Session };
