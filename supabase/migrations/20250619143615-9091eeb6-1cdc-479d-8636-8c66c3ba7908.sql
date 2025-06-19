
-- Let's check what tables exist that might be related to the ONAI foreign table
SELECT schemaname, tablename, tableowner 
FROM pg_tables 
WHERE tablename ILIKE '%onai%' OR tablename ILIKE '%ai%'
ORDER BY schemaname, tablename;

-- Also check for foreign tables specifically
SELECT foreign_table_schema, foreign_table_name, foreign_server_name
FROM information_schema.foreign_tables
WHERE foreign_table_name ILIKE '%onai%' OR foreign_table_name ILIKE '%ai%'
ORDER BY foreign_table_schema, foreign_table_name;

-- Check for any tables that might contain AI-related data
SELECT schemaname, tablename 
FROM pg_tables 
WHERE tablename ILIKE '%usage%' OR tablename ILIKE '%tracking%'
ORDER BY schemaname, tablename;
