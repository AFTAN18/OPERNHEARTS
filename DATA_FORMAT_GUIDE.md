# Data Format Guide for Database Import

## Quick Summary

**Total Tables: 6**

1. `volunteers` - Volunteer information
2. `donors` - Donor information  
3. `campaigns` - Campaign/project details
4. `donations` - Donation transactions
5. `campaign_volunteers` - Volunteer-campaign assignments
6. `beneficiaries` - Beneficiary allocation records

---

## Import Methods

### Method 1: Using Supabase Dashboard (Easiest)

1. Go to **Table Editor** in Supabase
2. Select the table
3. Click **Insert** → **Insert row**
4. Fill in the fields manually

### Method 2: Using SQL Editor

1. Go to **SQL Editor** in Supabase
2. Copy and paste the SQL from `SAMPLE_DATA_IMPORT.sql`
3. Click **Run**

### Method 3: Using CSV Import

1. Go to **Table Editor** → Select table → **Import data via CSV**
2. Use the CSV formats provided below

---

## CSV Format Examples

### 1. Volunteers CSV
```csv
first_name,last_name,email,phone,skills,interests,availability,status
John,Doe,john.doe@example.com,+1-555-123-4567,"Teaching,First Aid","Education,Medical Aid","Weekdays,Weekends",active
Jane,Smith,jane.smith@example.com,+1-555-987-6543,"Event Planning","Fundraising","Weekends",pending
```

### 2. Donors CSV
```csv
name,email,phone,address
Alice Johnson,alice.johnson@example.com,+1-555-234-5678,"123 Main St, New York"
Bob Williams,bob.williams@example.com,+1-555-345-6789,"456 Oak Ave, Los Angeles"
```

### 3. Campaigns CSV
```csv
title,description,category,location,event_date,goal_amount,raised_amount,status
Clean Water Initiative,"Providing clean drinking water",Health,Kenya,2024-06-15,20000.00,12500.00,active
Education for All,"Supporting education programs",Education,India,2024-07-01,15000.00,8200.00,active
```

### 4. Donations CSV
```csv
donor_name,donation_type,amount,donation_date,status,transaction_id
Alice Johnson,monetary,500.00,2024-01-15,completed,TRX-001
Bob Williams,monetary,250.00,2024-01-16,completed,TRX-002
```

**Note:** For donations with foreign keys, you'll need to:
- First insert campaigns and donors
- Get their UUIDs
- Then insert donations with those UUIDs

---

## JSON Format for API/Programmatic Insert

### Example: Insert Volunteer via API
```json
POST /rest/v1/volunteers
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-123-4567",
  "skills": ["Teaching", "First Aid"],
  "interests": ["Education"],
  "availability": ["Weekdays"],
  "status": "active"
}
```

### Example: Insert Donation via API
```json
POST /rest/v1/donations
{
  "donor_name": "Alice Johnson",
  "donation_type": "monetary",
  "amount": 500.00,
  "donation_date": "2024-01-15",
  "status": "completed",
  "transaction_id": "TRX-001"
}
```

---

## Field Value Constraints

### Status Values:
- **volunteers.status**: 'active', 'inactive', 'pending'
- **campaigns.status**: 'active', 'completed', 'upcoming', 'cancelled'
- **donations.status**: 'pending', 'completed', 'failed'
- **campaign_volunteers.status**: 'assigned', 'confirmed', 'completed'

### Donation Types:
- 'monetary' - Cash donations
- 'in-kind' - Goods/services
- 'service' - Volunteer services

### Categories (Campaigns):
- 'Health'
- 'Education'
- 'Environment'
- 'Emergency'

---

## Important Notes

1. **Arrays**: Use PostgreSQL array format: `ARRAY['value1', 'value2']` in SQL
2. **Dates**: Always use `YYYY-MM-DD` format
3. **UUIDs**: Foreign keys must reference existing records
4. **Email**: Must be unique for volunteers
5. **Auto-fields**: Never include id, created_at, updated_at

See `DATABASE_TABLES_AND_FORMAT.md` for complete details.

