-- 018_feed_rls.sql
-- Row Level Security policies for feed module tables

-- Helper function has_permission(user_id UUID, perm_code TEXT) is assumed to exist.

-- feed_units
CREATE POLICY select_feed_units ON feed_units
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_units ON feed_units
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_units ON feed_units
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_units ON feed_units
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_types
CREATE POLICY select_feed_types ON feed_types
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_types ON feed_types
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_types ON feed_types
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_types ON feed_types
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_suppliers
CREATE POLICY select_feed_suppliers ON feed_suppliers
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_suppliers ON feed_suppliers
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_suppliers ON feed_suppliers
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_suppliers ON feed_suppliers
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_warehouses
CREATE POLICY select_feed_warehouses ON feed_warehouses
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_warehouses ON feed_warehouses
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_warehouses ON feed_warehouses
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_warehouses ON feed_warehouses
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_storage_bins
CREATE POLICY select_feed_storage_bins ON feed_storage_bins
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_storage_bins ON feed_storage_bins
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_storage_bins ON feed_storage_bins
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_storage_bins ON feed_storage_bins
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_batches
CREATE POLICY select_feed_batches ON feed_batches
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_batches ON feed_batches
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'receive_feed'));
CREATE POLICY update_feed_batches ON feed_batches
  FOR UPDATE USING (has_permission(auth.uid(), 'receive_feed')) WITH CHECK (has_permission(auth.uid(), 'receive_feed'));
CREATE POLICY delete_feed_batches ON feed_batches
  FOR DELETE USING (has_permission(auth.uid(), 'receive_feed'));

-- feed_prices
CREATE POLICY select_feed_prices ON feed_prices
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_prices ON feed_prices
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_prices ON feed_prices
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_prices ON feed_prices
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_nutritional_specifications
CREATE POLICY select_feed_nutrition ON feed_nutritional_specifications
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_nutrition ON feed_nutritional_specifications
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_nutrition ON feed_nutritional_specifications
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_nutrition ON feed_nutritional_specifications
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_formulas
CREATE POLICY select_feed_formulas ON feed_formulas
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_formulas ON feed_formulas
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_formulas ON feed_formulas
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_formulas ON feed_formulas
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_requests
CREATE POLICY select_feed_requests ON feed_requests
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_requests ON feed_requests
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'create_feed_request'));
CREATE POLICY update_feed_requests ON feed_requests
  FOR UPDATE USING (has_permission(auth.uid(), 'approve_feed_request')) WITH CHECK (has_permission(auth.uid(), 'approve_feed_request'));
CREATE POLICY delete_feed_requests ON feed_requests
  FOR DELETE USING (has_permission(auth.uid(), 'approve_feed_request'));

-- feed_receiving_documents
CREATE POLICY select_feed_receiving_documents ON feed_receiving_documents
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_receiving_documents ON feed_receiving_documents
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'receive_feed'));
CREATE POLICY update_feed_receiving_documents ON feed_receiving_documents
  FOR UPDATE USING (has_permission(auth.uid(), 'receive_feed')) WITH CHECK (has_permission(auth.uid(), 'receive_feed'));
CREATE POLICY delete_feed_receiving_documents ON feed_receiving_documents
  FOR DELETE USING (has_permission(auth.uid(), 'receive_feed'));

-- feed_receiving_items
CREATE POLICY select_feed_receiving_items ON feed_receiving_items
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_receiving_items ON feed_receiving_items
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'receive_feed'));
CREATE POLICY update_feed_receiving_items ON feed_receiving_items
  FOR UPDATE USING (has_permission(auth.uid(), 'receive_feed')) WITH CHECK (has_permission(auth.uid(), 'receive_feed'));
CREATE POLICY delete_feed_receiving_items ON feed_receiving_items
  FOR DELETE USING (has_permission(auth.uid(), 'receive_feed'));

-- feed_stock_ledger
CREATE POLICY select_feed_stock_ledger ON feed_stock_ledger
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_stock_ledger ON feed_stock_ledger
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY update_feed_stock_ledger ON feed_stock_ledger
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_feed_inventory')) WITH CHECK (has_permission(auth.uid(), 'manage_feed_inventory'));
CREATE POLICY delete_feed_stock_ledger ON feed_stock_ledger
  FOR DELETE USING (has_permission(auth.uid(), 'manage_feed_inventory'));

-- feed_issue_records
CREATE POLICY select_feed_issue_records ON feed_issue_records
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_issue_records ON feed_issue_records
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'issue_feed'));
CREATE POLICY update_feed_issue_records ON feed_issue_records
  FOR UPDATE USING (has_permission(auth.uid(), 'issue_feed')) WITH CHECK (has_permission(auth.uid(), 'issue_feed'));
CREATE POLICY delete_feed_issue_records ON feed_issue_records
  FOR DELETE USING (has_permission(auth.uid(), 'issue_feed'));

-- feed_consumption_records
CREATE POLICY select_feed_consumption_records ON feed_consumption_records
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_feed_consumption_records ON feed_consumption_records
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'record_feed_consumption'));
CREATE POLICY update_feed_consumption_records ON feed_consumption_records
  FOR UPDATE USING (has_permission(auth.uid(), 'record_feed_consumption')) WITH CHECK (has_permission(auth.uid(), 'record_feed_consumption'));
CREATE POLICY delete_feed_consumption_records ON feed_consumption_records
  FOR DELETE USING (has_permission(auth.uid(), 'record_feed_consumption'));

-- procurement_requests
CREATE POLICY select_procurement_requests ON procurement_requests
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_procurement_requests ON procurement_requests
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY update_procurement_requests ON procurement_requests
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_procurement')) WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY delete_procurement_requests ON procurement_requests
  FOR DELETE USING (has_permission(auth.uid(), 'manage_procurement'));

-- supplier_quotations
CREATE POLICY select_supplier_quotations ON supplier_quotations
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_supplier_quotations ON supplier_quotations
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY update_supplier_quotations ON supplier_quotations
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_procurement')) WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY delete_supplier_quotations ON supplier_quotations
  FOR DELETE USING (has_permission(auth.uid(), 'manage_procurement'));

-- purchase_orders
CREATE POLICY select_purchase_orders ON purchase_orders
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_purchase_orders ON purchase_orders
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY update_purchase_orders ON purchase_orders
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_procurement')) WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY delete_purchase_orders ON purchase_orders
  FOR DELETE USING (has_permission(auth.uid(), 'manage_procurement'));

-- purchase_invoices
CREATE POLICY select_purchase_invoices ON purchase_invoices
  FOR SELECT USING (has_permission(auth.uid(), 'view_feed_reports'));
CREATE POLICY insert_purchase_invoices ON purchase_invoices
  FOR INSERT WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY update_purchase_invoices ON purchase_invoices
  FOR UPDATE USING (has_permission(auth.uid(), 'manage_procurement')) WITH CHECK (has_permission(auth.uid(), 'manage_procurement'));
CREATE POLICY delete_purchase_invoices ON purchase_invoices
  FOR DELETE USING (has_permission(auth.uid(), 'manage_procurement'));

-- End of 018_feed_rls.sql
