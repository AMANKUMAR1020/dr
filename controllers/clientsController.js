const Client_details = require('../model/Client_details')
bcrypt = require('bcrypt')

const getAllClient = async (req, res) => {

    const client = await Client_details.find().lean();


    if (!client?.length) { return res.status(400).json({ message: 'No client found' })}

    res.json(client)
}

const updateClient = async (req, res) => {
    const {
        id, name, email, pwd, isDoctor, picture, details
    } = req.body;

    if (!id || !name || !email || !pwd || !details) {
        return res.status(400).json({ message: 'id, name, email, pwd, details are required' });
    }

    try {
        const foundUser = await Client_details.findById(id);
        if (!foundUser) {
            return res.status(400).json({ message: 'Client not found' });
        }

        const passwordMatch = await bcrypt.compare(pwd, foundUser.pwd);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        foundUser.name = name;
        foundUser.email = email;
        const paswrd = await bcrypt.hash(pwd, 10);
        foundUser.pwd = paswrd
        foundUser.isDoctor = isDoctor;
        foundUser.picture = picture;
        foundUser.details = details;

        const result = await foundUser.save();

        console.log(result);

        res.status(201).json({ success: `Client_details ${result._id} updated!` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const deleteClient = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'User ID Required' });
    }

    try {
        const deleteResult = await Client_details.deleteOne({ _id: id }); // Corrected usage of deleteOne

        if (deleteResult.deletedCount === 0) {
            return res.status(400).json({ message: 'User not found' });
        }

        const reply = `User with ID ${id} deleted`;

        res.json(reply);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getAllClient,
    updateClient,
    deleteClient
}