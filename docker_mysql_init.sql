-- Create the main user and set password
CREATE USER IF NOT EXISTS 'accadmin'@'%' IDENTIFIED BY 'p@55w0rd';

-- Grant full privileges on the main and shadow databases to accadmin
GRANT ALL PRIVILEGES ON myaccapp.* TO 'accadmin'@'%' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON myaccapp_shadow.* TO 'accadmin'@'%' WITH GRANT OPTION;

-- Apply changes immediately
FLUSH PRIVILEGES;

-- Create the main database if it doesn’t already exist
CREATE DATABASE IF NOT EXISTS myaccapp
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- Create the shadow database for migrations if it doesn’t already exist
CREATE DATABASE IF NOT EXISTS myaccapp_shadow
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;
