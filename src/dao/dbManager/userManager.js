const Users = require('../models/user.model');

class UserManager {
    constructor() {
        // El usuario administrador está definido internamente en el código
        this.adminUser = {
            _id: 'admin',
            firstName: 'Luciano',
            lastName: 'Staniszewski',
            age: 18,
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
            rol: 'admin' // Se agrega el campo "role" para el rol del usuario
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
                return { ...this.adminUser }; // Devuelve una copia del usuario administrador
            }

            const user = await Users.findOne({ email, password });

            if (!user) {
                throw new Error('El usuario o contraseña son incorrectos');
            }

            return user;

        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            throw new Error('El usuario o contraseña son incorrectos');
        }
    }
    async registerUser(firstName, lastName, age, email, password) {
        try {
            if (!email || !password) {
                throw new Error('El email y la contraseña son obligatorios.');
            }

            // Validar formato de correo electrónico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                throw new Error('El formato del correo electrónico es incorrecto');
            }

            // Validar fortaleza de la contraseña
            if (password.length < 8) {
                throw new Error('La contraseña debe tener al menos 8 caracteres');
            }

            const firstNameManager = firstName ? firstName : 'Usuario';
            const lastNameManager = lastName ? lastName : 'Sin Identificar';
            const numericAge = age ? parseInt(age) : 1;

            if (numericAge <= 0) {
                throw new Error('La edad debe ser mayor a 0');
            }

            await Users.create({
                firstName: firstNameManager,
                lastName: lastNameManager,
                age: numericAge,
                email,
                password
            });

        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            throw new Error('Error al registrar el usuario');
        }
    }

    async getUser(id) {
        try {
            console.log(`Intentando cargar el usuario con id ${id}`);

            if (id === this.adminUser._id) {
                console.log('El usuario es el administrador');
                return this.adminUser
            } else {
                console.log('El usuario no es el administrador');
                const user = await Users.findOne({ _id: id })
                console.log(`Se encontró el usuario con id ${id}:`, user);
                return user
            }

        } catch (error) {
            console.error('Error al cargar la sesion de usuario:', error);
            throw new Error('Error al cargar la sesion de usuario');
        }
    }

    

    isAdmin(user) {
        // Función para verificar si el usuario es administrador
        return user && user.role === 'admin';
    }
}

module.exports = UserManager;
