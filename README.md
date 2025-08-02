Project Name: Blog Site CRUD

Description
    This project is Blog management application and demonstration of CRUD operation and nextjs capabilitis for fullstack development 

Table of Contents
    Getting Started
    Features
    Technology Stack
    Installation
    Usage



Getting Started
To get started with this project, follow these steps:

Clone the repository: 
```
[git clone https://github.com/your-username/your-repo-name.git](https://github.com/NavinLamsal/Blog-CRUD-Application)
```

Install dependencies: 
```
npm install 
```
or
```
yarn install
```
Start the development server: 
```
npm run dev 
```
or 
```
yarn dev
```

Features

Authentication

    1. login and register pages.
    2. On successful login, store JWT token in cookie.
    3. useAuth hook: Handles login, logout,  isAuthenticated, and user state,
    4. Redirects unauthorized users and authorized user with the use of useAuth hook and Authlayout an Protected Layout

Blog Post Management

    1. Show a list of user posts on the dashboard.
    2. Allow Create, Edit, Delete of blog posts after login.
    3. Create usePosts hook:
        Fetches posts from the API.
        Supports add/update/delete.



Technology Stack

        Frontend: React, Next.js
        Backend: Node.js, Prisma
        Database: supabase postgresql
        Authentication: jwt cookie based


Installation

To install the project, follow these steps:

    Install Node.js and npm or yarn

    Install dependencies: 
```
npm install 
```
or 
```
yarn install
```

environment variables

    DATABASE_URL=

    DIRECT_URL=

    NODE_ENV="development"

    NEXT_PUBLIC_HOST_URL="http://localhost:3000"

Usage

    To use the project, follow these steps:

    Start the development server: 
```
npm run dev 
```
or 
```
yarn dev
```
Open the app in your browser:

    http://localhost:3000
