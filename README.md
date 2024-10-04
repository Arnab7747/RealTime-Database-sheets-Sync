# RealTime-Database-sheets-Sync

## Overview

This project provides a solution to synchronize data in real-time between a Google Sheet and a PostgreSQL database. The solution ensures that changes made to the Google Sheet are automatically reflected in the database and vice versa. The system supports full CRUD operations for both platforms and maintains consistency across them. The project is designed for businesses and teams that utilize both Google Sheets for collaboration and databases for robust, scalable data management.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Real-Time Sync Strategy](#real-time-sync-strategy)
6. [Conflict Handling](#conflict-handling)
7. [Scalability](#scalability)
8. [Challenges and Solutions](#challenges-and-solutions)
9. [Testing and Simulating Conflicts](#testing-and-simulating-conflicts)
10. [Video Demonstration](#video-demonstration)
11. [Checklist](#checklist)
12. [Approach](#approach)

---

## Features

- **Real-Time Synchronization**: Automatically detect changes in Google Sheets and update the PostgreSQL database, and vice versa.
- **CRUD Operations**: Supports Create, Read, Update, and Delete operations on both platforms.
- **Conflict Handling** (Optional Challenge): Manage conflicts when simultaneous changes are made on both platforms.
- **Scalability** (Optional Challenge): Efficient handling of large datasets and frequent updates.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Google Sheets API**: Google Apps Script for Google Sheets interaction
- **Version Control**: Git

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/real-time-sync.git
   cd real-time-sync

2. Install dependencies:
   ```bash
   npm install

3. Set up environment variables in a .env file:
  
  * PG_HOST=
  * PG_USER=
  * PG_DATABASE=
  * PG_PASSWORD=
  * API_URL=
  * GOOGLE_SHEETS_ID=


  


4. Run the server:
   npm start


# Usage
The application will listen for changes in Google Sheets and update the database accordingly.
You can perform CRUD operations on both Google Sheets and the database through the provided endpoints:
/api/realtime: To get the latest updates and sync data between platforms.
CRUD operations via POST, PUT, DELETE requests.

Real-Time Sync Strategy
Google Sheets to PostgreSQL:
A trigger is set up in Google Apps Script that listens for changes to a specified Google Sheet. When a change is detected, an API request is sent to the Node.js server, updating the database with the modified data.
PostgreSQL to Google Sheets:
A polling mechanism checks for changes in the PostgreSQL database, and updates are sent to Google Sheets when any new entries, deletions, or modifications occur.

# Conflict Handling
Conflicts may arise when simultaneous changes are made in both Google Sheets and the PostgreSQL database. To handle this:

* Last Write Wins: By default, the last change made (whether in Google Sheets or the database) will overwrite the previous one.
* Custom Conflict Resolution: Optional implementation to detect and resolve conflicts based on user-defined rules or timestamps.

# Scalability
* Optimization: The solution is designed to efficiently handle large datasets by batching updates and using indexed database queries.
* Frequency Handling: The system is optimized to handle frequent updates through rate-limiting and deduplication techniques.
Challenges and Solutions

# Biggest Blocker
One of the biggest blockers was ensuring that Google Sheets, which is generally not designed for high-frequency real-time updates, could handle the data sync. We overcame this by:

* Using Apps Script triggers to detect real-time changes in Google Sheets.
* Optimizing the API calls to PostgreSQL by batching updates to avoid overloading the system.

# Testing and Simulating Conflicts
To simulate conflict scenarios:

* Google Sheets changes: Manually modify cells in the Google Sheet while simultaneously updating the PostgreSQL database using API requests.
* Database changes: Use the Node.js API to perform CRUD operations on the database, and ensure that changes are reflected in Google Sheets.
* Conflict Testing: Introduce deliberate timing conflicts by scheduling updates on both platforms within a short window of time to test how conflicts are handled and resolved.


# Video Demonstration


In this video, I walk through how the real-time synchronization between Google Sheets and PostgreSQL works, as well as my strategy for conflict handling. I also discuss the main challenges I encountered and how I addressed them.


[![Demo](https://img.youtube.com/vi/-StG4stT6tE/maxresdefault.jpg)](https://youtu.be/-StG4stT6tE)





Checklist
 My code's working just fine!

✅ I have recorded a video showing it working and embedded it in the README

✅ I have tested all the normal working cases  
✅ I have even solved some edge cases (brownie points)  
✅ I added my very planned-out approach to the problem at the end of this README  

# Approach
Real-Time Synchronization:

Google Sheets → API integration using Google Apps Script to push updates to the Node.js server.
PostgreSQL → Polling mechanism in Node.js to check for updates and push changes to Google Sheets.
CRUD Operations:

For Google Sheets, I used Google Apps Script to modify the data. For PostgreSQL, I leveraged Sequelize ORM to handle database operations.
Conflict Handling:
