const mongoose = require('mongoose');

const client_detailsSchema = new mongoose.Schema(
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
        
        details:{

            type:[{
            dr_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'dr_details'
            },
            subscription_buy: {
                type: String
            },
            problem: {
                type: String
            }
        }]},

        refreshToken:{string:String},
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('client_detail', client_detailsSchema);
