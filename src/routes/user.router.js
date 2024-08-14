const { Router } = require('express')
const transport = require('../utils/transport');
const UserDAO = require('../dao/UserDAO');
const UserService = require('../service/UserService');
const UserController = require('../controller/UserController')

const router = Router()


router.get('/users', UserController.getAllUsers);

router.post('/users/:id/toggleRol', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserDAO.findUserById(userId);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        user.rol = user.rol === 'usuario' ? 'premium' : 'usuario';
        await user.save();

        res.json({ success: true, newRole: user.rol });
    } catch (error) {
        console.error('Error al cambiar el rol:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
});

router.delete('/users/deleteInactive', async (req, res) => {
    try {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const inactiveUsers = await UserDAO.getInactiveUsers(twoDaysAgo);

        if (!inactiveUsers.length) {
            return res.status(200).json({ message: 'No hay usuarios inactivos para eliminar' });
        }

        for (const user of inactiveUsers) {
            try {
                await transport.sendMail({
                    from: 'giorginiciro@gmail.com',
                    to: user.email,
                    subject: 'Cuenta eliminada por inactividad',
                    html: `
                    <div>
                        <p>Hola ${user.firstName},</p>
                        <p>Tu cuenta ha sido eliminada debido a 2 días de inactividad.</p>
                        <p>Si tienes alguna pregunta, por favor contáctanos.</p>
                        <p>Saludos,</p>
                        <p>El equipo de tu aplicación</p>
                    </div>
                    `,
                });
            } catch (error) {
                console.error(`Error al enviar el correo a ${user.email}:`, error);
            }

            await UserDAO.deleteUserById(user._id);
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados' });
    } catch (error) {
        console.error('Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos', error: error.message });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const userDeleted = await UserService.deleteUserById(userId);
        if (userDeleted) {
            res.status(200).json({ message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
