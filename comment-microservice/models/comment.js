const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  versionKey: false,
  toJSON: { getters: true }
});

CommentSchema.plugin(mongoose_delete, {
    overrideMethods: 'all'
});

module.exports = comment = mongoose.model('comment', CommentSchema, 'comment')