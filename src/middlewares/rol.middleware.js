const { error } = require("winston");

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

const isPremium = (req, res, next) => {
    const user =  req.user;
     
    if (user.rol === 'premium'){
        return next();
    } 
    
    return res.status(403).json({ error: 'Acceso denegado por falta de autorizacion' })
}

const isNotAUser = (req, res, next) => {
    const user = req.user;

    if (user.rol === 'premium' || user.rol === 'admin') {
        return next();
    }

    return res.status(403).json({error: 'Acceso denegado por falta de autorizacion'})
} 

const isUserOrPremium = (req, res, next) => {
    const user = req.user;

    if (user.rol === 'premium' || user.rol === 'usuario') {
        return next();
    }

    return res.status(403).json({error: 'Acceso denegado por falta de autorizacion'})
} 




module.exports = {
    isAdmin,
    isUser,
    isPremium,
    isNotAUser,
    isUserOrPremium
};
