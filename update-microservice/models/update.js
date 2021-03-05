const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete')

const UpdateSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: false,
        default: 0
    },
    message: {
        type: String,
        require: true
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
        createdAt: 'createAt',
        updatedAt: 'updatedAt'
    },
    versionKey: false
});

UpdateSchema.plugin(mongoose_delete, {
    overrideMethods: 'all'
})
module.exports = update = mongoose.model('update', UpdateSchema, 'update')