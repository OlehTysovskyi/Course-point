const RegistrationRequest = require('../models/RegistrationRequest');

exports.approve = async (id) => {
    const req = await RegistrationRequest.findById(id);
    req.status = 'approved';
    return req.save();
};