const RegistrationRequest = require('../models/RegistrationRequest');

class RegistrationRequestRepository {
    async create(data) {
        return RegistrationRequest.create(data);
    }

    async findById(id) {
        return RegistrationRequest.findById(id);
    }

    async findPendingByEmail(email) {
        return RegistrationRequest.findOne({ email, status: 'pending' });
    }

    async findAll() {
        return RegistrationRequest.find();
    }

    async save(reqDoc) {
        return reqDoc.save();
    }
}

module.exports = new RegistrationRequestRepository();
