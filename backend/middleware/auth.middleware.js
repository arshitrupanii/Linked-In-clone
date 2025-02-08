import jwt from 'jsonwebtoken';
import User from '../model/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

export const protectedRoute = async (req, res, next) => {
    try {
        // get cookies from request
        console.log(req)
        const token_ = req.headers.cookie
            .split("; ")
            .map(cookie => cookie.split("="))
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        const token = token_.jwt_LinkedIn_token


        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        const verified = jwt.verify(token, process.env.JWT_TOKEN);

        if (!verified) {
            return res.status(401).json({ msg: 'Token is not valid, authorization denied' });
        }

        const user = await User.findById(verified.userId)

        if (!user) {
            return res.status(401).json({ msg: 'User no longer exists, authorization denied' });
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(500).json({ msg: 'Server Error in auth.middleware.js in ProtectedRoute.' });
        console.log(err)
    }
};
