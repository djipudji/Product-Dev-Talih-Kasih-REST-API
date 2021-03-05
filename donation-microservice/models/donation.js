const mongoose = require('mongoose');
const mongoose_delete = require('mongoose-delete');

const DonationSchema = new mongoose.Schema({
    amount: {
        type: Number,
        require: true
    },
    name : {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: false
    },
    isVerified: {
        type: Boolean,
        required: false,
        default: false
    },
    verification_images: {
        type: String,
        required: true,
        get : getImage
    },
    user : {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    campaign: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    token: {
        type: String,
        required: false,
        default: "MIDTRANS PURPOSES ONLY"
    },
    redirect_url: {
        type: String,
        required: false,
        default: "MIDTRANS PURPOSES ONLY"
    },
    user_token: {
        type: String,
        required: false,
        default: "MIDTRANS PURPOSES ONLY"
    }
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    },
    versionKey: false,
    toJSON:{ getters:true }
});

function getImage(images){
    return 'https://api.talikasih.tech:3002/img/' + images
}

DonationSchema.plugin(mongoose_delete, {overrideMethods: 'all'});

module.exports = donation = mongoose.model('donation', DonationSchema, 'donation');