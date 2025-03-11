# Google Drive Uploader

A simple tool to upload multiple files to Google Drive and view the uploaded files.

## Technologies Used

- Docker (for easy setup and deployment)
- Google Drive API (for uploading and viewing files)
- PostgreSQL (for storing data related to file uploads)

## Setup Instructions

### 1. Clone the repository:

```bash
git clone https://github.com/your-username/google-drive-uploader.git
cd google-drive-uploader
```

### 2. Get Google Drive credentials:

To interact with Google Drive, you'll need to set up Google Drive API credentials using a **service account**:

- Go to the [Google Cloud Console](https://console.cloud.google.com/).
- **Create a project**: Click on "Select a Project" at the top, then click "New Project." Follow the prompts to create a new project.
- **Enable Google Drive API**: In the left sidebar, go to "APIs & Services" → "Library". Search for "Google Drive API" and click "Enable."
- **Create Service Account credentials**:
    - Navigate to "IAM & Admin" → "Service Accounts."
    - Click "Create Service Account."
    - Provide a name for the service account, and under "Role," select **Project > Owner** (or the least privileged role required for your use case).
    - Once the service account is created, click on it to open its details.
    - Under the "Keys" section, click "Add Key" → "Create new key" and select **JSON**. This will download the service account key file.
- **Base64 encode the credentials file**:
    - Open a terminal and run the following command (replace `path/to/your/google-drive-credentials.json` with the path to your downloaded credentials file):

      ```bash
      base64 path/to/your/google-drive-credentials.json
      ```

    - Copy the output (the base64-encoded string) and paste it in the `GOOGLE_DRIVE_CREDENTIALS` variable in your `.env` file.

### 3. Get PostgreSQL credentials:

You'll need PostgreSQL credentials to connect to your database.

#### Set up PostgreSQL locally:

- Install PostgreSQL on your local machine if you don't have it. Follow the instructions on [PostgreSQL's official website](https://www.postgresql.org/download/).
- After installation, create a new database, user, and set the password using PostgreSQL's command line or a tool like pgAdmin.
- Run the following commands to set up your database (replace values as necessary):

  ```bash
  psql -U postgres
  CREATE DATABASE your-db-name;
  CREATE USER your-db-user WITH ENCRYPTED PASSWORD 'your-db-password';
  GRANT ALL PRIVILEGES ON DATABASE your-db-name TO your-db-user;
  ```
  - Use these credentials for DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, and DB_PORT in your .env file.
  - By default, PostgreSQL runs on localhost and port 5432.

### 5. Run the project using Docker Compose:

Once you've set up your `.env` file, you can start the application:

```bash
docker-compose up --build
```
