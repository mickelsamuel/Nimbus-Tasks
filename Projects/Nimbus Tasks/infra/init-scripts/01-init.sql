-- Initialize PostgreSQL database for Nimbus Tasks
-- This script is run when the container starts for the first time

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE nimbus_tasks'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'nimbus_tasks')\gexec

-- Connect to the nimbus_tasks database
\c nimbus_tasks;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE nimbus_tasks TO postgres;