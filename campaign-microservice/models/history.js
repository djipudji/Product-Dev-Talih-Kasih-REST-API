const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const HistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    get: getCampaign
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false,
  toJSON: { getters: true }
});

function getCampaign(value) {
  value.images = 'https://api.talikasih.tech:3001/img/' + value.images
  return value
}

HistorySchema.plugin(mongoose_delete, {
    overrideMethods: 'all'
});

module.exports = history = mongoose.model('history', HistorySchema, 'history')