const UserService = require('../service/UserService');

class UserController {
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.loginUser(email, password);
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async registerUser(req, res) {
        try {
            const { firstName, lastName, age, email, password } = req.body;
            await UserService.registerUser(firstName, lastName, age, email, password);
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async getUser(req, res) {
        try {
            const user = await UserService.getUser(req.params.id);
            return user;
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = new UserController();