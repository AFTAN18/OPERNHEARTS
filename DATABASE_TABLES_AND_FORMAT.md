# Database Tables and Data Format Guide

## Total Number of Tables: **6 Tables**

---

## Table 1: `volunteers`

**Purpose:** Stores volunteer registration and profile information

### Required Fields:
- `first_name` (VARCHAR(100)) - Volunteer's first name
- `last_name` (VARCHAR(100)) - Volunteer's last name
- `email` (VARCHAR(255)) - Email address (UNIQUE)

### Optional Fields:
- `phone` (VARCHAR(20)) - Phone number
- `skills` (TEXT[]) - Array of skills (e.g., ["Teaching", "First Aid"])
- `interests` (TEXT[]) - Array of interests (e.g., ["Education", "Medical Aid"])
- `availability` (TEXT[]) - Array of availability (e.g., ["Weekdays", "Weekends"])
- `assigned_campaign_id` (UUID) - Reference to campaigns table
- `profile_photo_url` (TEXT) - URL to profile photo
- `status` (VARCHAR(20)) - Values: 'active', 'inactive', 'pending' (default: 'pending')

### Auto-Generated Fields (Don't include):
- `id` (UUID) - Auto-generated
- `created_at` (TIMESTAMP) - Auto-generated
- `updated_at` (TIMESTAMP) - Auto-generated

### Data Format Example (JSON):
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "skills": ["Teaching", "First Aid", "Public Speaking"],
  "interests": ["Education", "Medical Aid"],
  "availability": ["Weekdays", "Weekends"],
  "status": "pending"
}
```

### CSV Format:
```csv
first_name,last_name,email,phone,skills,interests,availability,status
John,Doe,john.doe@example.com,+1-555-123-4567,"Teaching,First Aid","Education,Medical Aid","Weekdays,Weekends",pending
Jane,Smith,jane.smith@example.com,+1-555-987-6543,"Event Planning,Communication","Fundraising,Event Planning","Weekends",active
```

---

## Table 2: `donors`

**Purpose:** Stores donor information

### Required Fields:
- `name` (VARCHAR(255)) - Donor's full name
- `email` (VARCHAR(255)) - Email address

### Optional Fields:
- `phone` (VARCHAR(20)) - Phone number
- `address` (TEXT) - Physical address

### Auto-Generated Fields (Don't include):
- `id` (UUID) - Auto-generated
- `created_at` (TIMESTAMP) - Auto-generated
- `updated_at` (TIMESTAMP) - Auto-generated

### Data Format Example (JSON):
```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-234-5678",
  "address": "123 Main St, New York, NY 10001"
}
```

### CSV Format:
```csv
name,email,phone,address
Alice Johnson,alice.johnson@example.com,+1-555-234-5678,"123 Main St, New York, NY 10001"
Bob Williams,bob.williams@example.com,+1-555-345-6789,"456 Oak Ave, Los Angeles, CA 90001"
```

---

## Table 3: `campaigns`

**Purpose:** Stores campaign/project information

### Required Fields:
- `title` (VARCHAR(255)) - Campaign title
- `category` (VARCHAR(50)) - Campaign category
- `location` (VARCHAR(255)) - Campaign location

### Optional Fields:
- `description` (TEXT) - Campaign description
- `event_date` (DATE) - Format: 'YYYY-MM-DD'
- `goal_amount` (DECIMAL(12, 2)) - Fundraising goal
- `raised_amount` (DECIMAL(12, 2)) - Amount raised (default: 0)
- `status` (VARCHAR(20)) - Values: 'active', 'completed', 'upcoming', 'cancelled' (default: 'upcoming')
- `image_url` (TEXT) - URL to campaign image

### Auto-Generated Fields (Don't include):
- `id` (UUID) - Auto-generated
- `created_at` (TIMESTAMP) - Auto-generated
- `updated_at` (TIMESTAMP) - Auto-generated

### Data Format Example (JSON):
```json
{
  "title": "Clean Water Initiative",
  "description": "Providing clean drinking water to underserved communities",
  "category": "Health",
  "location": "Kenya",
  "event_date": "2024-06-15",
  "goal_amount": 20000.00,
  "raised_amount": 12500.00,
  "status": "active",
  "image_url": "https://example.com/water-campaign.jpg"
}
```

### CSV Format:
```csv
title,description,category,location,event_date,goal_amount,raised_amount,status,image_url
Clean Water Initiative,"Providing clean drinking water",Health,Kenya,2024-06-15,20000.00,12500.00,active,https://example.com/water.jpg
Education for All,"Supporting education programs",Education,India,2024-07-01,15000.00,8200.00,active,https://example.com/education.jpg
```

---

## Table 4: `donations`

**Purpose:** Stores donation transaction records

### Required Fields:
- `donation_type` (VARCHAR(20)) - Values: 'monetary', 'in-kind', 'service'
- `donation_date` (DATE) - Format: 'YYYY-MM-DD'

### Optional Fields:
- `donor_id` (UUID) - Reference to donors table (if donor exists)
- `donor_name` (VARCHAR(255)) - Donor name (for anonymous donations)
- `amount` (DECIMAL(12, 2)) - Donation amount (required for monetary)
- `item_description` (TEXT) - Description (for in-kind donations)
- `campaign_id` (UUID) - Reference to campaigns table
- `status` (VARCHAR(20)) - Values: 'pending', 'completed', 'failed' (default: 'completed')
- `transaction_id` (VARCHAR(100)) - Unique transaction identifier

### Auto-Generated Fields (Don't include):
- `id` (UUID) - Auto-generated
- `created_at` (TIMESTAMP) - Auto-generated
- `updated_at` (TIMESTAMP) - Auto-generated

### Data Format Example (JSON):
```json
{
  "donor_id": "uuid-here-if-exists",
  "donor_name": "Alice Johnson",
  "donation_type": "monetary",
  "amount": 500.00,
  "donation_date": "2024-01-15",
  "campaign_id": "uuid-here-if-exists",
  "status": "completed",
  "transaction_id": "TRX-1705276800000"
}
```

### CSV Format:
```csv
donor_id,donor_name,donation_type,amount,item_description,donation_date,campaign_id,status,transaction_id
uuid-1,Alice Johnson,monetary,500.00,,2024-01-15,uuid-campaign-1,completed,TRX-1705276800000
uuid-2,Bob Williams,monetary,250.00,,2024-01-16,uuid-campaign-1,completed,TRX-1705276800001
,Anonymous Donor,monetary,100.00,,2024-01-17,uuid-campaign-2,completed,TRX-1705276800002
uuid-3,Charlie Brown,in-kind,,Food supplies for 50 families,2024-01-18,uuid-campaign-3,completed,TRX-1705276800003
```

---

## Table 5: `campaign_volunteers`

**Purpose:** Links volunteers to campaigns (Many-to-Many relationship)

### Required Fields:
- `campaign_id` (UUID) - Reference to campaigns table
- `volunteer_id` (UUID) - Reference to volunteers table

### Optional Fields:
- `role` (VARCHAR(100)) - Volunteer's role in campaign
- `status` (VARCHAR(20)) - Values: 'assigned', 'confirmed', 'completed' (default: 'assigned')

### Auto-Generated Fields (Don't include):
- `id` (UUID) - Auto-generated
- `assigned_at` (TIMESTAMP) - Auto-generated

### Data Format Example (JSON):
```json
{
  "campaign_id": "uuid-campaign-1",
  "volunteer_id": "uuid-volunteer-1",
  "role": "Event Coordinator",
  "status": "assigned"
}
```

### CSV Format:
```csv
campaign_id,volunteer_id,role,status
uuid-campaign-1,uuid-volunteer-1,Event Coordinator,assigned
uuid-campaign-1,uuid-volunteer-2,Field Worker,confirmed
uuid-campaign-2,uuid-volunteer-3,Teacher,completed
```

---

## Table 6: `beneficiaries`

**Purpose:** Stores beneficiary allocation information for campaigns

### Required Fields:
- `campaign_id` (UUID) - Reference to campaigns table
- `name` (VARCHAR(255)) - Beneficiary name

### Optional Fields:
- `contact_info` (TEXT) - Contact information
- `allocation_details` (TEXT) - Details about allocation
- `allocated_resources` (TEXT) - Resources allocated
- `allocation_date` (DATE) - Format: 'YYYY-MM-DD'

### Auto-Generated Fields (Don't include):
- `id` (UUID) - Auto-generated
- `created_at` (TIMESTAMP) - Auto-generated
- `updated_at` (TIMESTAMP) - Auto-generated

### Data Format Example (JSON):
```json
{
  "campaign_id": "uuid-campaign-1",
  "name": "Village Community Center",
  "contact_info": "Contact: John Manager, Phone: +254-123-456-789",
  "allocation_details": "Water filtration system installation",
  "allocated_resources": "2 filtration units, installation team",
  "allocation_date": "2024-06-20"
}
```

### CSV Format:
```csv
campaign_id,name,contact_info,allocation_details,allocated_resources,allocation_date
uuid-campaign-1,"Village Community Center","Contact: John Manager","Water filtration system","2 filtration units",2024-06-20
uuid-campaign-2,"Rural School District","Contact: Principal Smith","Educational materials","500 books, 50 tablets",2024-07-05
```

---

## Complete Sample Dataset (All Tables)

### Sample Data for Testing:

```sql
-- 1. Volunteers
INSERT INTO volunteers (first_name, last_name, email, phone, skills, interests, availability, status) VALUES
('John', 'Doe', 'john.doe@example.com', '+1-555-123-4567', ARRAY['Teaching', 'First Aid'], ARRAY['Education'], ARRAY['Weekdays'], 'active'),
('Jane', 'Smith', 'jane.smith@example.com', '+1-555-987-6543', ARRAY['Event Planning'], ARRAY['Fundraising'], ARRAY['Weekends'], 'pending');

-- 2. Donors
INSERT INTO donors (name, email, phone, address) VALUES
('Alice Johnson', 'alice.johnson@example.com', '+1-555-234-5678', '123 Main St, New York'),
('Bob Williams', 'bob.williams@example.com', '+1-555-345-6789', '456 Oak Ave, Los Angeles');

-- 3. Campaigns
INSERT INTO campaigns (title, description, category, location, event_date, goal_amount, status) VALUES
('Clean Water Initiative', 'Providing clean drinking water', 'Health', 'Kenya', '2024-06-15', 20000.00, 'active'),
('Education for All', 'Supporting education programs', 'Education', 'India', '2024-07-01', 15000.00, 'active');

-- 4. Donations (Note: Use actual UUIDs from donors and campaigns tables)
INSERT INTO donations (donor_id, donor_name, donation_type, amount, donation_date, campaign_id, status, transaction_id) VALUES
('donor-uuid-1', 'Alice Johnson', 'monetary', 500.00, '2024-01-15', 'campaign-uuid-1', 'completed', 'TRX-001'),
('donor-uuid-2', 'Bob Williams', 'monetary', 250.00, '2024-01-16', 'campaign-uuid-1', 'completed', 'TRX-002');

-- 5. Campaign Volunteers (Note: Use actual UUIDs)
INSERT INTO campaign_volunteers (campaign_id, volunteer_id, role, status) VALUES
('campaign-uuid-1', 'volunteer-uuid-1', 'Event Coordinator', 'assigned'),
('campaign-uuid-1', 'volunteer-uuid-2', 'Field Worker', 'confirmed');

-- 6. Beneficiaries (Note: Use actual campaign UUIDs)
INSERT INTO beneficiaries (campaign_id, name, contact_info, allocation_details, allocation_date) VALUES
('campaign-uuid-1', 'Village Community Center', 'Contact: John Manager', 'Water filtration system', '2024-06-20'),
('campaign-uuid-2', 'Rural School District', 'Contact: Principal Smith', 'Educational materials', '2024-07-05');
```

---

## Important Notes:

1. **UUIDs**: When inserting data with foreign keys (donor_id, campaign_id, volunteer_id), you must use actual UUIDs from the referenced tables.

2. **Arrays**: For PostgreSQL arrays (skills, interests, availability), use PostgreSQL array syntax: `ARRAY['value1', 'value2']` in SQL or `["value1", "value2"]` in JSON.

3. **Dates**: Always use format: `'YYYY-MM-DD'` (e.g., '2024-06-15')

4. **Decimals**: Use numeric format: `1234.56` (no currency symbols)

5. **Auto-Generated**: Never include `id`, `created_at`, `updated_at` in your data - they're auto-generated

6. **Foreign Keys**: Ensure referenced records exist before inserting related data

---

## Quick Reference Summary:

| Table | Required Fields | Optional Fields | Auto-Generated |
|-------|----------------|-----------------|---------------|
| **volunteers** | first_name, last_name, email | phone, skills[], interests[], availability[], assigned_campaign_id, profile_photo_url, status | id, created_at, updated_at |
| **donors** | name, email | phone, address | id, created_at, updated_at |
| **campaigns** | title, category, location | description, event_date, goal_amount, raised_amount, status, image_url | id, created_at, updated_at |
| **donations** | donation_type, donation_date | donor_id, donor_name, amount, item_description, campaign_id, status, transaction_id | id, created_at, updated_at |
| **campaign_volunteers** | campaign_id, volunteer_id | role, status | id, assigned_at |
| **beneficiaries** | campaign_id, name | contact_info, allocation_details, allocated_resources, allocation_date | id, created_at, updated_at |

**Total: 6 Tables**

