"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_js_1 = require("@supabase/supabase-js");
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || '*',
    supabaseUrl: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY || 'placeholder-service-key',
    jwtSecret: process.env.JWT_SECRET || 'development-secret-key-change-in-production',
};
exports.supabase = (0, supabase_js_1.createClient)(exports.config.supabaseUrl, exports.config.supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});
//# sourceMappingURL=index.js.map