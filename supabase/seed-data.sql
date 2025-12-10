-- Optional: Seed data for testing
-- Run this after schema.sql if you want sample data

-- Sample Campaigns
INSERT INTO campaigns (title, description, category, location, event_date, goal_amount, status) VALUES
('Clean Water Initiative', 'Providing clean drinking water to underserved communities in Kenya', 'Health', 'Kenya', '2024-06-15', 20000, 'active'),
('Education for All', 'Supporting education programs for children in rural India', 'Education', 'India', '2024-07-01', 15000, 'active'),
('Disaster Relief Fund', 'Emergency relief for communities affected by natural disasters', 'Emergency', 'Global', '2024-05-20', 50000, 'active'),
('Youth Tech Training', 'Digital skills training for underprivileged youth', 'Education', 'Detroit', '2024-08-10', 25000, 'upcoming'),
('Reforestation Project', 'Planting trees to combat climate change', 'Environment', 'Brazil', '2024-09-01', 10000, 'upcoming')
ON CONFLICT DO NOTHING;

-- Note: You'll need to reference actual campaign IDs from your database
-- to create sample donations and volunteers. Adjust IDs accordingly.

