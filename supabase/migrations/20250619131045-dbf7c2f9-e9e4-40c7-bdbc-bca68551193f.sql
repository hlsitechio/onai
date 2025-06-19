
-- Create private schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS private;

-- Move the ONAI table to the private schema
-- Note: Using the correct case-sensitive table name
ALTER TABLE public."ONAI" SET SCHEMA private;
