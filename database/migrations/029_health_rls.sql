-- 022_health_rls.sql
-- Row Level Security policies for health module tables

-- Helper function assumed: has_permission(user_id UUID, perm_code TEXT)

-- medication_units
CREATE POLICY select_med_units ON medication_units FOR SELECT USING (has_permission(auth.uid(),'medication:view'));
CREATE POLICY manage_med_units ON medication_units FOR ALL USING (has_permission(auth.uid(),'medication:manage')) WITH CHECK (has_permission(auth.uid(),'medication:manage'));

-- medication_products
CREATE POLICY select_med_products ON medication_products FOR SELECT USING (has_permission(auth.uid(),'medication:view'));
CREATE POLICY manage_med_products ON medication_products FOR ALL USING (has_permission(auth.uid(),'medication:manage')) WITH CHECK (has_permission(auth.uid(),'medication:manage'));

-- veterinarians
CREATE POLICY select_vets ON veterinarians FOR SELECT USING (has_permission(auth.uid(),'health:view'));
CREATE POLICY manage_vets ON veterinarians FOR ALL USING (has_permission(auth.uid(),'health:manage')) WITH CHECK (has_permission(auth.uid(),'health:manage'));

-- vaccines
CREATE POLICY select_vaccines ON vaccines FOR SELECT USING (has_permission(auth.uid(),'vaccination:view'));
CREATE POLICY manage_vaccines ON vaccines FOR ALL USING (has_permission(auth.uid(),'vaccination:manage')) WITH CHECK (has_permission(auth.uid(),'vaccination:manage'));

-- diseases
CREATE POLICY select_diseases ON diseases FOR SELECT USING (has_permission(auth.uid(),'health:view'));
CREATE POLICY manage_diseases ON diseases FOR ALL USING (has_permission(auth.uid(),'health:manage')) WITH CHECK (has_permission(auth.uid(),'health:manage'));

-- symptoms
CREATE POLICY select_symptoms ON symptoms FOR SELECT USING (has_permission(auth.uid(),'health:view'));
CREATE POLICY manage_symptoms ON symptoms FOR ALL USING (has_permission(auth.uid(),'health:manage')) WITH CHECK (has_permission(auth.uid(),'health:manage'));

-- treatment_protocols
CREATE POLICY select_treatment_protocols ON treatment_protocols FOR SELECT USING (has_permission(auth.uid(),'health:view'));
CREATE POLICY manage_treatment_protocols ON treatment_protocols FOR ALL USING (has_permission(auth.uid(),'health:manage')) WITH CHECK (has_permission(auth.uid(),'health:manage'));

-- withdrawal_overrides
CREATE POLICY select_withdrawal_overrides ON withdrawal_overrides FOR SELECT USING (has_permission(auth.uid(),'health:view'));
CREATE POLICY manage_withdrawal_overrides ON withdrawal_overrides FOR ALL USING (has_permission(auth.uid(),'health:manage')) WITH CHECK (has_permission(auth.uid(),'health:manage'));

-- vaccine_schedules
CREATE POLICY select_vaccine_schedules ON vaccine_schedules FOR SELECT USING (has_permission(auth.uid(),'vaccination:view'));
CREATE POLICY manage_vaccine_schedules ON vaccine_schedules FOR ALL USING (has_permission(auth.uid(),'vaccination:manage')) WITH CHECK (has_permission(auth.uid(),'vaccination:manage'));

-- biosecurity_checklist_templates
CREATE POLICY select_biosecurity_templates ON biosecurity_checklist_templates FOR SELECT USING (has_permission(auth.uid(),'biosecurity:view'));
CREATE POLICY manage_biosecurity_templates ON biosecurity_checklist_templates FOR ALL USING (has_permission(auth.uid(),'biosecurity:manage')) WITH CHECK (has_permission(auth.uid(),'biosecurity:manage'));

-- daily_health_records
CREATE POLICY select_daily_health ON daily_health_records FOR SELECT USING (has_permission(auth.uid(),'health:view'));
CREATE POLICY manage_daily_health ON daily_health_records FOR ALL USING (has_permission(auth.uid(),'health:record')) WITH CHECK (has_permission(auth.uid(),'health:record'));

-- medication_administrations
CREATE POLICY select_med_administration ON medication_administrations FOR SELECT USING (has_permission(auth.uid(),'medication:view'));
CREATE POLICY manage_med_administration ON medication_administrations FOR ALL USING (has_permission(auth.uid(),'medication:prescribe')) WITH CHECK (has_permission(auth.uid(),'medication:prescribe'));

-- vaccination_records
CREATE POLICY select_vaccination_records ON vaccination_records FOR SELECT USING (has_permission(auth.uid(),'vaccination:view'));
CREATE POLICY manage_vaccination_records ON vaccination_records FOR ALL USING (has_permission(auth.uid(),'vaccination:record')) WITH CHECK (has_permission(auth.uid(),'vaccination:record'));

-- biosecurity_checklist_records
CREATE POLICY select_biosecurity_records ON biosecurity_checklist_records FOR SELECT USING (has_permission(auth.uid(),'biosecurity:view'));
CREATE POLICY manage_biosecurity_records ON biosecurity_checklist_records FOR ALL USING (has_permission(auth.uid(),'biosecurity:manage')) WITH CHECK (has_permission(auth.uid(),'biosecurity:manage'));

-- End of 022_health_rls.sql
