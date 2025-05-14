const userRepository = require('../repositories/userRepository');
const reqRepo = require('../repositories/registrationRequestRepository');
const EmailService = require('../utils/EmailService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

class RegistrationRequestService {
  /**
   * Подати заявку
   * @param {{ name, email, role, password? }} dto
   */
  async submitRequest(dto) {
    const { name, email, role, password } = dto;
    if (await reqRepo.findPendingByEmail(email) || await userRepository.findByEmail(email)) {
      const err = new Error('Email вже використовується');
      err.statusCode = 400;
      throw err;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    return reqRepo.create({ name, email, role, password: hashedPassword });
  }


  /**
   * Адмін затверджує заявку та створює користувача
   * @param {string} requestId
   */
  async approveRequest(requestId) {
    const reqDoc = await reqRepo.findById(requestId);
    if (!reqDoc) {
      const err = new Error('Заявка не знайдена');
      err.statusCode = 404;
      throw err;
    }
    if (reqDoc.status !== 'pending') {
      const err = new Error('Заявка вже оброблена');
      err.statusCode = 400;
      throw err;
    }
    const user = await User.create({
      name: reqDoc.name,
      email: reqDoc.email,
      password: reqDoc.password,
      role: reqDoc.role
    });
    reqDoc.status = 'approved';
    await reqRepo.save(reqDoc);
    EmailService.sendWelcome(user.email);
    return user;
  }

  async getAllRequests() {
    return reqRepo.findAll();
  }

  async getRequestById(id) {
    const reqDoc = await reqRepo.findById(id);
    if (!reqDoc) {
      const err = new Error('Заявка не знайдена');
      err.statusCode = 404;
      throw err;
    }
    return reqDoc;
  }
}

module.exports = new RegistrationRequestService();
