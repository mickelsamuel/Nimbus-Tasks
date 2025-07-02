# User Management Scripts for BNC Training Platform

This directory contains several utility scripts for managing user approval status and performing administrative tasks on the MongoDB database.

## 🚀 Quick Start

### Approve a Single User
```bash
# Method 1: Using the management script (recommended)
node scripts/manageUserStatus.js approve emily.jackson@bnc.ca

# Method 2: Using the dedicated approval script
node scripts/approveUser.js emily.jackson@bnc.ca

# Method 3: Using the interactive shell
node scripts/mongoShell.js approve emily.jackson@bnc.ca
```

### Approve All Pending Users
```bash
node scripts/bulkApproveUsers.js --all
```

### List Pending Users
```bash
node scripts/manageUserStatus.js list
```

## 📋 Available Scripts

### 1. `manageUserStatus.js` - Comprehensive User Management
The main script for all user status operations.

**Commands:**
```bash
# List all pending users
node scripts/manageUserStatus.js list

# Show detailed user information
node scripts/manageUserStatus.js details emily.jackson@bnc.ca

# Approve a specific user
node scripts/manageUserStatus.js approve emily.jackson@bnc.ca

# Show user statistics
node scripts/manageUserStatus.js stats

# Search users by criteria
node scripts/manageUserStatus.js search --department IT --status pending
node scripts/manageUserStatus.js search --role employee --name Emily
```

### 2. `approveUser.js` - Single User Approval
Simple script to approve individual users.

```bash
# Basic usage
node scripts/approveUser.js emily.jackson@bnc.ca

# Specify different approver
node scripts/approveUser.js emily.jackson@bnc.ca admin@bnc.ca
```

### 3. `bulkApproveUsers.js` - Bulk User Approval
Approve multiple users at once.

```bash
# Approve all pending users
node scripts/bulkApproveUsers.js --all

# Approve specific users by email
node scripts/bulkApproveUsers.js --emails emily.jackson@bnc.ca,james.smith@bnc.ca

# Approve all pending users in a department
node scripts/bulkApproveUsers.js --department "IT"
```

### 4. `setupAdmin.js` - Admin User Management
Manage admin users and ensure admin access.

```bash
# Ensure at least one admin exists (creates default if none found)
node scripts/setupAdmin.js ensure

# Create a new admin user
node scripts/setupAdmin.js create --email newadmin@bnc.ca --password NewPass123!

# Reset admin password
node scripts/setupAdmin.js reset --email admin@bnc.ca --password NewPass123!

# List all admin users
node scripts/setupAdmin.js list
```

### 5. `mongoShell.js` - Interactive MongoDB Shell
Interactive shell for database operations.

```bash
# Start interactive shell
node scripts/mongoShell.js

# Or run commands directly
node scripts/mongoShell.js pending
node scripts/mongoShell.js approve emily.jackson@bnc.ca
node scripts/mongoShell.js user emily.jackson@bnc.ca
```

**Interactive commands:**
- `pending` - List all pending users
- `approve <email>` - Approve a user
- `user <email>` - Show user details
- `stats` - Show user statistics
- `query <JSON>` - Execute MongoDB query
- `update <email> <JSON>` - Update user data
- `help` - Show help
- `exit` - Exit shell

## 🛠️ Configuration

All scripts use the environment variables from your `.env` file:
- `MONGODB_URI` - MongoDB connection string
- Other environment variables as needed

Make sure your `.env` file is properly configured before running any scripts.

## 📊 Database Schema Reference

### User Model - Approval Related Fields
```javascript
{
  isApproved: Boolean,        // Main approval status
  isActive: Boolean,          // Account active status
  approvedBy: ObjectId,       // Reference to admin who approved
  approvedAt: Date,          // Approval timestamp
  rejectedAt: Date,          // Rejection timestamp (if rejected)
  rejectionReason: String,   // Reason for rejection
  managerApprovalStatus: String, // Manager approval: 'pending', 'approved', 'rejected'
  accountHistory: [...]      // Audit trail of account actions
}
```

## 🔐 Admin API Alternative

You can also use the existing admin API endpoints:

### Approve User via API
```bash
# Login to get admin token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@bnc.ca", "password": "Admin123!"}'

# Use token to approve user
curl -X POST http://localhost:5000/api/admin/users/{USER_ID}/approve \
  -H "Authorization: Bearer {ADMIN_TOKEN}" \
  -H "Content-Type: application/json"
```

### Get Pending Users
```bash
curl -X GET http://localhost:5000/api/admin/pending-users \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

## 📝 Example Workflows

### Scenario 1: Daily User Approval Review
```bash
# 1. Check pending users
node scripts/manageUserStatus.js list

# 2. Review specific user details
node scripts/manageUserStatus.js details emily.jackson@bnc.ca

# 3. Approve user
node scripts/manageUserStatus.js approve emily.jackson@bnc.ca

# 4. Check overall stats
node scripts/manageUserStatus.js stats
```

### Scenario 2: Bulk Approval for Department
```bash
# 1. Search pending users in department
node scripts/manageUserStatus.js search --department "IT" --status pending

# 2. Bulk approve all IT department pending users
node scripts/bulkApproveUsers.js --department "IT"
```

### Scenario 3: Emergency Admin Access
```bash
# 1. Ensure admin exists
node scripts/setupAdmin.js ensure

# 2. Reset admin password if needed
node scripts/setupAdmin.js reset --password EmergencyPass123!
```

## 🛡️ Security Notes

1. **Environment Variables**: Ensure your `.env` file contains the correct `MONGODB_URI`
2. **Admin Credentials**: Default admin is `admin@bnc.ca` / `Admin123!` - change after setup
3. **Audit Trail**: All approval actions are logged in the user's `accountHistory`
4. **Backup**: Consider backing up your database before bulk operations

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `MONGODB_URI` in `.env`
   - Ensure MongoDB is running
   - Verify network connectivity

2. **User Not Found**
   - Verify email spelling
   - Check if user exists in database
   - Use search function to find user

3. **Admin Not Found**
   - Run `node scripts/setupAdmin.js ensure`
   - Create admin manually if needed

4. **Permission Denied**
   - Ensure you have proper file permissions
   - Check if scripts are executable

### Debug Mode
Add debugging to any script by setting:
```bash
DEBUG=* node scripts/manageUserStatus.js list
```

## 📞 Support

For issues with these scripts:
1. Check the console output for specific error messages
2. Verify your environment configuration
3. Ensure database connectivity
4. Check user permissions

Remember: These scripts directly modify the database, so use with caution in production environments!