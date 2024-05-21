const UserDAO = require('../dao/UserDAO');

class UserService {
    constructor() {
        this.adminUser = {
            _id: 'admin',
            firstName: 'Luciano',
            lastName: 'Staniszewski',
            age: 18,
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
            rol: 'admin'
        };
    }

    async loginUser(email, password) {
        if (!email || !password) {
            throw new Error('El email y la contraseña son obligatorios.');
        }

        if (email === this.adminUser.email && password === this.adminUser.password) {
            return { ...this.adminUser };
        }

        const user = await UserDAO.findUserByEmailAndPassword(email, password);

        if (!user) {
            throw new Error('El usuario o contraseña son incorrectos');
        }

        return user;
    }

    async registerUser(firstName, lastName, age, email, password) {
        if (!email || !password) {
            throw new Error('El email y la contraseña son obligatorios.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('El formato del correo electrónico es incorrecto');
        }

        if (password.length < 8) {
            throw new Error('La contraseña debe tener al menos 8 caracteres');
        }

        const firstNameManager = firstName || 'Usuario';
        const lastNameManager = lastName || 'Sin Identificar';
        const numericAge = age ? parseInt(age) : 1;

        if (numericAge <= 0) {
            throw new Error('La edad debe ser mayor a 0');
        }

        await UserDAO.createUser({
            firstName: firstNameManager,
            lastName: lastNameManager,
            age: numericAge,
            email,
            password
        });
    }

    async getUserById(id) {
        if (id === this.adminUser._id) {
            return this.adminUser;
        }

        return await UserDAO.findUserById(id);
    }

    isAdmin(user) {
        return user && user.rol === 'admin';
    }
}

module.exports = new UserService();
