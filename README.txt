==================================================
ENTERPRISE TASK MANAGEMENT PORTAL - DEPLOYMENT
==================================================

Project Description:
A full-stack Task Allocation and Management Portal built using a decoupled architecture. The application utilizes an interactive frontend interface communicating with a Node.js and Express backend server, backed by a persistent relational SQLite3 database.

Live Production URL:
https://lavish-creativity-production.up.railway.app

Source Code Repository:
https://github.com/PranaviGopale/Task-Manager-Portal

Tech Stack & Infrastructure:
- Frontend: HTML5, CSS3, JavaScript (Dynamic API Origin Routing)
- Backend: Node.js, Express.js framework
- Database: SQLite3 (Localized relational storage engine)
- Cloud Hosting Platform: Railway (Automated continuous deployment)

Key Implementation Details:
1. Configured dynamic runtime network listener hooks via process.env.PORT for seamless cloud container stability.
2. Synchronized internal dependency manifests (package.json and package-lock.json) ensuring reproducible cloud environment builds.
3. Implemented smart browser window location matching to securely switch route requests between local testing environments and production links.