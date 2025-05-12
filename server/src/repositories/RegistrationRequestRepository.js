const RegistrationRequest = require('../models/RegistrationRequest');

class RegistrationRequestRepository {
    /**
     * Створити нову заявку
     * @param {{ name, email, role, password? }} data
     * @returns {Promise<RegistrationRequest>}
     */
    async create(data) {
        return RegistrationRequest.create(data);
    }

    /**
     * Знайти заявку за ID
     * @param {string} id
     * @returns {Promise<RegistrationRequest|null>}
     */
    async findById(id) {
        return RegistrationRequest.findById(id);
    }

    /**
     * Знайти заявку за email та статусом pending
     * @param {string} email
     * @returns {Promise<RegistrationRequest|null>}
     */
    async findPendingByEmail(email) {
        return RegistrationRequest.findOne({ email, status: 'pending' });
    }

    /**
     * Оновити заявку
     * @param {RegistrationRequest} reqDoc
     * @returns {Promise<RegistrationRequest>}
     */
    async save(reqDoc) {
        return reqDoc.save();
    }
}

module.exports = new RegistrationRequestRepository();
