# Deploying OneAI to IONOS Hosting

This guide explains how to deploy the OneAI application to IONOS web hosting.

## Prerequisites

- Access to your IONOS hosting control panel
- FTP access credentials for your IONOS hosting
- Git and Node.js installed on your local machine

## Build Process

1. Build the production version of the application:

```bash
# Navigate to your project directory
cd g:\onlinenoteai\github

# Install dependencies (if not already done)
npm install

# Build the production version
npm run build
```

2. The build process will create a `dist` folder containing all the static files for your application.

## Upload to IONOS

1. Use an FTP client (like FileZilla) to connect to your IONOS hosting using your FTP credentials.

2. Upload the contents of the `dist` directory to the root directory of your hosting (typically `htdocs` or `www`).

## Configure Server Routing (Important)

Since OneAI is a single-page application (SPA), you need to configure your server to redirect all requests to `index.html`.

1. Create a `.htaccess` file in the root directory of your hosting with the following content:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

2. Upload this `.htaccess` file to the root directory of your hosting.

## Verifying Deployment

1. Visit https://www.onlinenote.ai/ to ensure the main application loads correctly.
2. Test the following routes to ensure they're accessible:
   - https://www.onlinenote.ai/PrivacyPolicy
   - https://www.onlinenote.ai/TermsofUse
   - https://www.onlinenote.ai/CookieSettings
   - https://www.onlinenote.ai/roadmap

## Troubleshooting

If routes are not working:

1. Verify the `.htaccess` file is present and contains the correct configuration.
2. Check if your IONOS hosting has mod_rewrite enabled. If not, contact IONOS support to enable it.
3. Make sure all files were uploaded correctly, including the main `index.html` file.

## Automation Script (Optional)

You can create a deployment script to automate this process:

```bash
#!/bin/bash
# Build the application
npm run build

# Create .htaccess file
echo '<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>' > dist/.htaccess

# Upload to IONOS (requires lftp)
# lftp -u username,password ftp.your-ionos-server.com -e "mirror -R dist/ /; exit"
```

Remember to replace the FTP credentials with your actual IONOS FTP credentials.
