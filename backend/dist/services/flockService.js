"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlocks = getFlocks;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
async function getFlocks() {
    const { data, error } = await supabaseAdmin_1.supabaseAdmin
        .from('flocks')
        .select('id, name')
        .order('name');
    if (error) {
        console.error('Error fetching flocks:', error);
        throw error;
    }
    return data;
}
//# sourceMappingURL=flockService.js.map