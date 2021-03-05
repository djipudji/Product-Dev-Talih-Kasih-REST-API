const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')


const campaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    goal: {
        type: Number,
        required: true
    },
    images: {
        type: String,
        required: false,
        default: null,
        get : getImage
    },
    due_date:{
        type: Date,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    story:{
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    view: {
        type: Number,
        required: false,
        default: null
    },
    total_donation: {
       type: Number,
       required: false,
       default: 0
    },
    total_donation_rupiah:{
        type: Number,
       required: false,
       default: 0 
    },
    total_share:{
        type: Number,
       required: false,
       default: 0 
    },
    status:{
        type:String,
        required: false,
        default:"pending"
    },
    wallet:{
        type:Number,
        required: false,
        default:0
    }

}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    versionKey: false ,
    toJSON:{ getters:true }
})
function getImage(images){
    return 'https://api.talikasih.tech:3001/img/' + images
}

campaignSchema.plugin(mongoose_delete, {overrideMethods: 'all' }) 

module.exports = campaign = mongoose.model('campaign', campaignSchema); 