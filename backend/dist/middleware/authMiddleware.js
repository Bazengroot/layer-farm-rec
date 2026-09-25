"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const logger_1 = require("../utils/logger");
// Supabase JWKS client
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder-project.supabase.co';
const jwks = (0, jwks_rsa_1.default)({
    jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    cache: true,
    rateLimit: true,
});
function getKey(header, callback) {
    jwks.getSigningKey(header.kid, (err, key) => {
        if (err || !key) {
            return callback(err || new Error('Signing key not found'));
        }
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Missing or malformed Authorization header' },
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = await new Promise((resolve, reject) => {
            jsonwebtoken_1.default.verify(token, getKey, { algorithms: ['RS256'] }, (err, decodedToken) => {
                if (err)
                    reject(err);
                else
                    resolve(decodedToken);
            });
        });
        req.user = {
            uid: decoded.sub,
            role: decoded.role || null,
            email: decoded.email,
        };
        next();
    }
    catch (err) {
        logger_1.logger.warn('JWT verification failed:', err.message);
        return res.status(401).json({
            success: false,
            error: { code: 'INVALID_TOKEN', message: 'Invalid or expired session token' },
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map