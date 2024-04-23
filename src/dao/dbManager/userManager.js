const { Users } = require('../models');

class UserManager {
    constructor() {
        this.adminUser = {
            _id: 'admin',
            firstName: 'Romina',
            lastName: 'Molina',
            age: 18,
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
            rol: 'admin'
        };
    }

    async prepare() {
        try {
            // Realizar la inicialización específica aquí, por ejemplo, conexión a la base de datos
            // En este ejemplo, no es necesario realizar ninguna inicialización especial
            console.log("UserManager preparado");
        } catch (error) {
            console.error("Error al preparar UserManager:", error);
            throw new Error("Error al preparar UserManager");
        }
    }

    async loginUser(email, password) {
        try {
            if (!email || !password) {
                throw new Error('El email y la contraseña son obligatorios.');
            }

            if (email === this.adminUser.email && password === this.adminUser.password) {
                return this.adminUser;
            }

            const user = await Users.findOne({ email, password })

            if (!user) {
                throw new Error('El usuario o contraseña son incorrectos');
            }

            return user

        } catch {
            throw new Error('El usuario o contraseña son incorrectos');
        }

    }

    async registerUser(firstName, lastName, age, email, password) {
        try {
            if (!email || !password) {
                throw new Error('El email y la contraseña son obligatorios.')
            }

            const firstNameManager = firstName ? firstName : 'Usuario'
            const lastNameManager = lastName ? lastName : 'Sin Identificar'

            const numericAge = age ? parseInt(age) : age = 1

            if (age <= 0) {
                throw new Error('La edad debe ser mayor a 0')
            }

            await Users.create({
                firstName: firstNameManager,
                lastName: lastNameManager,
                age: numericAge,
                email,
                password
            })
        } catch {
            throw new Error('Error al registrar el usuario')
        }
    }

    async getUser(id) {
        try {

            if (id === this.adminUser._id) {
                return this.adminUser
            } else {
                const user = await Users.findOne({ _id: id })
                return user
            }

        } catch {
            throw new Error('Error al cargar la sesion de usuario')
        }
    }
}

module.exports = UserManager;