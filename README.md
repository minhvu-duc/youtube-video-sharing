# youtube-video-sharing

## Introduction
The YouTube Sharing App is a platform that allows users to share their favorite YouTube videos with others. Whether it's an inspiring tutorial, a funny cat video, or a heartwarming vlog, users can easily post and discover entertaining content.

## Prerequisites
- Node.js (version 16 or higher): Make sure you have Node.js installed on your system. You can download the latest version from the official Node.js website (https://nodejs.org). Node.js is required to run the backend server and the frontend development environment.
- PostgreSQL Database: Ensure that you have PostgreSQL installed and running on your system. You can download PostgreSQL from the official website (https://www.postgresql.org). The app uses PostgreSQL as the database to store user information and shared video data.

## Database setup
Ensure that your PostgresSQL server is up and running.

Create required databases:
- For development: `youtube_sharing_development`
- For testing: `youtube_sharing_test`
At the root directory of the project, run the following scripts:
- Install dependencies
```
yarn install
```
- Migration
```
yarn db:migration
```
- Seeding
```
yarn db:seed
```

## Running the Application
Initialize your `.env`
- Rename `.env.example` to `.env` and replace it's values
- Start the server:
```
yarn dev
```
- Start react app:
```
cd src/ui
yarn
yarn start
```
