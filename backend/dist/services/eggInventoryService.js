"use strict";
// backend/src/services/eggInventoryService.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.eggInventoryService = void 0;
const supabaseAdmin_1 = require("../utils/supabaseAdmin");
const uuid_1 = require("uuid");
/** Service for managing egg inventory transactions (in/out movements). */
exports.eggInventoryService = {
    /** Record a new inventory transaction */
    async createTransaction(params) {
        const { organizationId, farmId, siteId, houseId, flockId, transactionDate, type, quantity, storageLocationId, notes, recorderProfileId } = params;
        if (quantity <= 0)
            throw new Error('Quantity must be positive');
        const { data, error } = await supabaseAdmin_1.supabaseAdmin
            .from('egg_inventory_transactions')
            .insert({
            id: (0, uuid_1.v4)(),
            organization_id: organizationId,
            farm_id: farmId,
            site_id: siteId,
            house_id: houseId,
            flock_id: flockId,
            transaction_date: transactionDate,
            transaction_type: type,
            quantity,
            storage_location_id: storageLocationId,
            notes,
            recorder_profile_id: recorderProfileId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
            .single();
        if (error)
            throw error;
        return data;
    },
    /** Get current stock balance per farm/house */
    async getBalance(filter) {
        let query = supabaseAdmin_1.supabaseAdmin
            .from('egg_inventory_transactions')
            .select('quantity, transaction_type');
        if (filter.farmId)
            query = query.eq('farm_id', filter.farmId);
        if (filter.houseId)
            query = query.eq('house_id', filter.houseId);
        const { data, error } = await query;
        if (error)
            throw error;
        // Compute balance
        const balance = data.reduce((acc, rec) => {
            return acc + (rec.transaction_type === 'IN' ? rec.quantity : -rec.quantity);
        }, 0);
        return { balance };
    },
};
//# sourceMappingURL=eggInventoryService.js.map