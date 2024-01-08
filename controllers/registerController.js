const Client_details = require('../model/Client_details');
const Dr_details = require('../model/Dr_details');
const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {

    const value = req.body;
    
    if (!value.name || !value.email || !value.pwd || typeof value.isDoctor !== 'boolean' || (value.picture !== null)) {
        return res.status(400).json({ 'message': 'Username, email, password, and isDoctor status are required.' });
    }

    const duplicateDr = await Dr_details.find(
        { name: value.name,
        email: value.email,
        isDoctor: value.isDoctor
    }).exec();

    if (duplicateDr.length > 1) {
        return res.status(409).send('Duplicate of name and email found isDoctor');
    }
    const duplicateCl = await Client_details.find(
        { name: value.name,
        email: value.email,
        isDoctor: value.isDoctor
    }).exec();
    if (duplicateCl.length > 1) {
        return res.status(409).send('Duplicate of name and email found Client');
    }
    
    const hashedPwd = await bcrypt.hash(value.pwd, 10); // Correctly hash the password using bcrypt
  
    if(value.isDoctor === false){
        
        value.details = null
        value.picture = null
        try{
            const result = await Client_details.create({
                name: value.name,
                email: value.email,
                pwd: hashedPwd,//value.pwd,
                isDoctor: value.isDoctor,
                picture: value.picture,
                details: value.details });
    
            console.log(result);
    
            res.status(201).json({ success: `New Client_details ${result._id} created!` }); // Respond with the ID of the created client
        } catch (err) {
            res.status(500).json({ message: err.message });
        }

    }else{

        value.subscription_type = undefined;
        
        try{
            const result = await Dr_details.create({
                name: value.name,
                email: value.email,
                pwd: hashedPwd,//value.pwd,
                isDoctor: value.isDoctor,
                picture: value.picture,
                specialization:value.specialization,
                subscription_type:value.subscription_type 
            });
    
            console.log(result);
    
            res.status(201).json({ success: `New Dr_details ${result._id} created!` }); // Respond with the ID of the created client
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}

module.exports = { handleNewUser };


//65953e8f3c3525465fd4cdf8
//65953eea3c3525465fd4cdfb
//65953f123c3525465fd4cdfe
//65953f3a3c3525465fd4ce01