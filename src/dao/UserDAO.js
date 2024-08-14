const Users = require('../models/user.model');

class UserDAO {
    async findUserByEmailAndPassword(email, password) {
        return Users.findOne({ email, password });
    }

    async findUserByEmail(Email){
        return Users.findOne({ email: Email })
    }

    async createUser(userData) {
        return Users.create(userData);
    }

    async findUserById(id) {
        return Users.findOne({ _id: id });
    }

    async getAllUsers(){
        return await Users.find();           
    }

    async getInactiveUsers(lastActiveDate) {
        const inactiveUsers = await Users.find({ Last_conecction: { $lt: lastActiveDate } });
        return inactiveUsers;
    }

    async deleteUserById(userId){
        const deletedUser = await Users.findByIdAndDelete(userId);
        return deletedUser;
    }
}

module.exports = new UserDAO();