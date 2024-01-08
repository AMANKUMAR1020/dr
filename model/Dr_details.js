
const mongoose = require('mongoose')

const dr_detailsSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            require:true
        },
        pwd:{
            type:String,
            require:true
        },
        isDoctor:{
            type:Boolean,
            require:true
        },
        picture:{
            data: Buffer,
            contentType: String
        },
        specialization: {
            type: [String],
            validate: [function(val) {
                return val.length < 4;
            },
            'Specialization array length must be less than 4'],
            required: true
        },
        subscription_type: {
            type: [{
                price: Number,
                time: String,
                duration: String
            }],
            validate: [function(val) {
                return val.length < 5;
            }, 'Subscription type array length must be less than 5']
        },
        //validate: subscription_type.length < 5
        
        refreshToken:{string:String},
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('dr_detail', dr_detailsSchema)
