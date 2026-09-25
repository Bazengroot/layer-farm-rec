"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserIdFromJwt = exports.supabaseAdmin = void 0;
// backend/src/utils/supabaseAdmin.ts
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_key';
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
    global: {
        fetch: (url, init) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 30_000);
            const modifiedInit = { ...(init || {}), signal: controller.signal };
            return fetch(url, modifiedInit).finally(() => clearTimeout(timeout));
        },
    },
});
const getUserIdFromJwt = (jwt) => {
    try {
        const payload = jwt.split('.')[1];
        const decoded = Buffer.from(payload, 'base64').toString('utf-8');
        const obj = JSON.parse(decoded);
        return obj.sub || null;
    }
    catch {
        return null;
    }
};
exports.getUserIdFromJwt = getUserIdFromJwt;
//# sourceMappingURL=supabaseAdmin.js.map