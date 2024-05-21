const Users = require('../models/user.model');

class UserDAO {
    async findUserByEmailAndPassword(email, password) {
        return Users.findOne({ email, password });
    }

    async createUser(userData) {
        return Users.create(userData);
    }

    async findUserById(id) {
        return Users.findOne({ _id: id });
    }
}

module.exports = new UserDAO();