const isAdmin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        return next(); 
    }

    return res.status(403).json({ error: 'Acceso no autorizado' });
};

const isUser = (req, res, next) => {
    if (req.user && req.user.rol === 'usuario') {
        return next(); 
    }

    return res.status(403).json({ error: 'Acceso no autorizado' });
    
};

module.exports = {
    isAdmin,
    isUser
};
