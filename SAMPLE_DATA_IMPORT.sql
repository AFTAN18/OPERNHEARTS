-- Sample Data Import Script for NGO Management System
-- Run this AFTER running schema.sql
-- Replace UUIDs with actual IDs from your database after inserting campaigns and volunteers

-- ============================================
-- 1. CAMPAIGNS (Insert first - no dependencies)
-- ============================================
INSERT INTO campaigns (title, description, category, location, event_date, goal_amount, raised_amount, status, image_url) VALUES
('Clean Water Initiative', 'Providing clean drinking water to underserved communities in Kenya through installation of filtration systems', 'Health', 'Kenya', '2024-06-15', 20000.00, 12500.00, 'active', 'https://picsum.photos/400/300?random=1'),
('Education for All', 'Supporting education programs for children in rural India with books, supplies, and teacher training', 'Education', 'India', '2024-07-01', 15000.00, 8200.00, 'active', 'https://picsum.photos/400/300?random=2'),
('Disaster Relief Fund', 'Emergency relief for communities affected by natural disasters worldwide', 'Emergency', 'Global', '2024-05-20', 50000.00, 45000.00, 'active', 'https://picsum.photos/400/300?random=3'),
('Youth Tech Training', 'Digital skills training for underprivileged youth in urban areas', 'Education', 'Detroit', '2024-08-10', 25000.00, 15000.00, 'upcoming', 'https://picsum.photos/400/300?random=5'),
('Reforestation Project', 'Planting trees to combat climate change and restore ecosystems', 'Environment', 'Brazil', '2024-09-01', 10000.00, 3200.00, 'upcoming', 'https://picsum.photos/400/300?random=4'),
('Mobile Medical Clinic', 'Bringing healthcare services to remote communities', 'Health', 'Syria', '2024-10-15', 40000.00, 28000.00, 'active', 'https://picsum.photos/400/300?random=6');

-- ============================================
-- 2. VOLUNTEERS
-- ============================================
INSERT INTO volunteers (first_name, last_name, email, phone, skills, interests, availability, status) VALUES
('John', 'Doe', 'john.doe@example.com', '+1-555-123-4567', ARRAY['Teaching', 'First Aid', 'Public Speaking'], ARRAY['Education', 'Medical Aid'], ARRAY['Weekdays', 'Weekends'], 'active'),
('Jane', 'Smith', 'jane.smith@example.com', '+1-555-987-6543', ARRAY['Event Planning', 'Communication'], ARRAY['Fundraising', 'Event Planning'], ARRAY['Weekends'], 'pending'),
('Michael', 'Johnson', 'michael.j@example.com', '+1-555-456-7890', ARRAY['Logistics', 'Distribution'], ARRAY['Logistics & Distribution'], ARRAY['Weekdays', 'Mornings'], 'active'),
('Sarah', 'Williams', 'sarah.w@example.com', '+1-555-321-0987', ARRAY['Teaching', 'Childcare'], ARRAY['Education'], ARRAY['Weekdays', 'Evenings'], 'active'),
('David', 'Brown', 'david.brown@example.com', '+1-555-654-3210', ARRAY['Medical Aid', 'First Aid'], ARRAY['Medical Aid'], ARRAY['Weekends', 'Mornings'], 'active');

-- ============================================
-- 3. DONORS
-- ============================================
INSERT INTO donors (name, email, phone, address) VALUES
('Alice Johnson', 'alice.johnson@example.com', '+1-555-234-5678', '123 Main St, New York, NY 10001'),
('Bob Williams', 'bob.williams@example.com', '+1-555-345-6789', '456 Oak Ave, Los Angeles, CA 90001'),
('Carol Davis', 'carol.davis@example.com', '+1-555-456-7890', '789 Pine Rd, Chicago, IL 60601'),
('Daniel Miller', 'daniel.miller@example.com', '+1-555-567-8901', '321 Elm St, Houston, TX 77001'),
('Emma Wilson', 'emma.wilson@example.com', '+1-555-678-9012', '654 Maple Ave, Phoenix, AZ 85001');

-- ============================================
-- 4. DONATIONS
-- Note: Replace campaign_id and donor_id with actual UUIDs from your database
-- You can get them by running: SELECT id FROM campaigns; and SELECT id FROM donors;
-- ============================================
-- First, get campaign and donor IDs (run these queries first):
-- SELECT id, title FROM campaigns;
-- SELECT id, name FROM donors;

-- Then insert donations (replace UUIDs with actual values):
INSERT INTO donations (donor_id, donor_name, donation_type, amount, donation_date, campaign_id, status, transaction_id) 
SELECT 
  d.id as donor_id,
  d.name as donor_name,
  'monetary' as donation_type,
  (100 + (random() * 900))::decimal(12,2) as amount,
  CURRENT_DATE - (random() * 90)::int as donation_date,
  c.id as campaign_id,
  'completed' as status,
  'TRX-' || to_char(EXTRACT(EPOCH FROM NOW())::bigint * 1000 + (random() * 1000)::int, 'FM999999999999') as transaction_id
FROM donors d
CROSS JOIN campaigns c
WHERE random() < 0.3  -- Insert donations for ~30% of donor-campaign combinations
LIMIT 20;

-- Or insert specific donations manually:
-- INSERT INTO donations (donor_id, donor_name, donation_type, amount, donation_date, campaign_id, status, transaction_id) VALUES
-- ((SELECT id FROM donors WHERE email = 'alice.johnson@example.com'), 'Alice Johnson', 'monetary', 500.00, '2024-01-15', (SELECT id FROM campaigns WHERE title = 'Clean Water Initiative'), 'completed', 'TRX-001'),
-- ((SELECT id FROM donors WHERE email = 'bob.williams@example.com'), 'Bob Williams', 'monetary', 250.00, '2024-01-16', (SELECT id FROM campaigns WHERE title = 'Clean Water Initiative'), 'completed', 'TRX-002'),
-- ((SELECT id FROM donors WHERE email = 'carol.davis@example.com'), 'Carol Davis', 'monetary', 1000.00, '2024-01-17', (SELECT id FROM campaigns WHERE title = 'Education for All'), 'completed', 'TRX-003');

-- ============================================
-- 5. CAMPAIGN VOLUNTEERS (Many-to-Many)
-- ============================================
-- Assign volunteers to campaigns
INSERT INTO campaign_volunteers (campaign_id, volunteer_id, role, status)
SELECT 
  c.id as campaign_id,
  v.id as volunteer_id,
  CASE 
    WHEN random() < 0.3 THEN 'Event Coordinator'
    WHEN random() < 0.6 THEN 'Field Worker'
    ELSE 'Volunteer'
  END as role,
  CASE 
    WHEN random() < 0.4 THEN 'assigned'
    WHEN random() < 0.7 THEN 'confirmed'
    ELSE 'completed'
  END as status
FROM campaigns c
CROSS JOIN volunteers v
WHERE random() < 0.4  -- Assign ~40% of volunteer-campaign combinations
LIMIT 15;

-- Or assign manually:
-- INSERT INTO campaign_volunteers (campaign_id, volunteer_id, role, status) VALUES
-- ((SELECT id FROM campaigns WHERE title = 'Clean Water Initiative'), (SELECT id FROM volunteers WHERE email = 'john.doe@example.com'), 'Event Coordinator', 'assigned'),
-- ((SELECT id FROM campaigns WHERE title = 'Clean Water Initiative'), (SELECT id FROM volunteers WHERE email = 'jane.smith@example.com'), 'Field Worker', 'confirmed'),
-- ((SELECT id FROM campaigns WHERE title = 'Education for All'), (SELECT id FROM volunteers WHERE email = 'michael.j@example.com'), 'Teacher', 'assigned');

-- ============================================
-- 6. BENEFICIARIES
-- ============================================
INSERT INTO beneficiaries (campaign_id, name, contact_info, allocation_details, allocated_resources, allocation_date)
SELECT 
  c.id as campaign_id,
  'Beneficiary ' || row_number() OVER (PARTITION BY c.id) as name,
  'Contact: Manager ' || row_number() OVER (PARTITION BY c.id) || ', Phone: +1-555-' || (1000 + (random() * 9000))::int as contact_info,
  'Resource allocation for ' || c.title as allocation_details,
  'Resources allocated: ' || (10 + (random() * 90))::int || ' units' as allocated_resources,
  CURRENT_DATE + (random() * 60)::int as allocation_date
FROM campaigns c
CROSS JOIN generate_series(1, 2)  -- 2 beneficiaries per campaign
LIMIT 12;

-- Or insert manually:
-- INSERT INTO beneficiaries (campaign_id, name, contact_info, allocation_details, allocated_resources, allocation_date) VALUES
-- ((SELECT id FROM campaigns WHERE title = 'Clean Water Initiative'), 'Village Community Center', 'Contact: John Manager, Phone: +254-123-456-789', 'Water filtration system installation', '2 filtration units, installation team', '2024-06-20'),
-- ((SELECT id FROM campaigns WHERE title = 'Education for All'), 'Rural School District', 'Contact: Principal Smith, Phone: +91-987-654-3210', 'Educational materials distribution', '500 books, 50 tablets, teaching supplies', '2024-07-05');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify your data:

-- SELECT COUNT(*) as total_campaigns FROM campaigns;
-- SELECT COUNT(*) as total_volunteers FROM volunteers;
-- SELECT COUNT(*) as total_donors FROM donors;
-- SELECT COUNT(*) as total_donations FROM donations;
-- SELECT COUNT(*) as total_assignments FROM campaign_volunteers;
-- SELECT COUNT(*) as total_beneficiaries FROM beneficiaries;

-- View all data:
-- SELECT * FROM campaigns;
-- SELECT * FROM volunteers;
-- SELECT * FROM donors;
-- SELECT * FROM donations ORDER BY donation_date DESC;
-- SELECT * FROM campaign_volunteers;
-- SELECT * FROM beneficiaries;

