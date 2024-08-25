## Database Setup for Petition App

This README provides instructions on how to set up the database for the Petition App using PostgreSQL. The setup includes creating the database and tables required for the application.

### Prerequisites

-   PostgreSQL installed and running on your local machine.
-   Node.js installed if you choose to run the setup script programmatically.
-   PostgreSQL user and database already created, or follow the instructions below to create them.

### Setting Up the Database

**Run the SQL Script Directly in your CLI**

1. **Locate the SQL Script**

Ensure that you have the setup_db.sql file in your project directory. This file contains the SQL commands needed to create and configure the database and tables.

2. **Open Terminal**

3. **Run the SQL Script**

Use the `psql` command-line utility to execute the SQL script. Replace `petition_user` with your PostgreSQL username if needed. If your PostgreSQL server is running on a different host or port, adjust the command accordingly.

```bash
psql -U petition_user -f setup_db.sql
```

This command will create the database and tables as defined in setup_db.sql.

### Starting PostgreSQL Service

1. **Check PostgreSQL Service Status**

To verify if the PostgreSQL service is running, use the following command:

```bash
sudo service postgresql status
```

2. **Start PostgreSQL Service**

If PostgreSQL is not running, start the service with:

```bash
sudo service postgresql start
```

### Connecting to the Database

To connect to your PostgreSQL database using the command-line utility psql, use the following command:

```bash
psql -U petition_user -d petitiondb -h localhost -p 5432
```

**NOTE**: Replace `petition_user` with your PostgreSQL username and `petitiondb` with your database name. If you are using a different port or host, adjust the command accordingly.
