const Dr_details = require('../model/Dr_details')
const bcrypt = require('bcrypt');

const getAllDrs = async (req, res) => {
    console.log("eii ")
    const drs = await Dr_details.find().lean();

    if (!drs?.length) {
        return res.status(400).json({ message: 'No doctors found' });
    }

    res.json(drs);

}


const addDrsDetails = async (req, res) => {
    const {
        id, name, email, pwd,
        isDoctor, picture, specialization,
        subscription_type
    } = req.body;

    if (!id || !name || !email || !pwd || !specialization || !subscription_type) {
        return res.status(400).json({ message: 'id, name, email, pwd, specialization, subscription_type fields are required' });
    }

    try {
        const foundUser = await Dr_details.findById(id);
        if (!foundUser) {
            return res.status(400).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(pwd, foundUser.pwd);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        for (let i = 0; i < subscription_type.length; i++) {
            const subscription = subscription_type[i];
            foundUser.subscription_type.push({
                _id: subscription._id,
                price: subscription.price,
                time: subscription.time,
                duration: subscription.duration
            });
        }

        const result = await foundUser.save();

        console.log(result);

        res.status(201).json({ success: `Dr_details ${result._id} updated!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const deleteDrs = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    const userid = await Dr_details.findById(id).lean().exec();

    if (!userid) {
        return res.status(400).json({ message: 'User not found' });
    }

    const user_result = await Dr_details.deleteOne({ _id: id });

    const reply = `User with id ${id} deleted`;

    res.json(reply);
}



module.exports = {
    getAllDrs,
    addDrsDetails,
    deleteDrs
}




