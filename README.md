# Next.js CMS Dashboard

A modern Content Management System (CMS) built with **Next.js**, **React**, **TypeScript**, **Redux Toolkit**, and **MongoDB**.

This project was developed as a one-week learning and portfolio project to demonstrate full-stack development skills, including authentication, state management, API development, and dashboard UI implementation.

In order to login, Type..

* /dashboard
* /login

Note:- 

In order to add a post you need to create One category first

---

## About Me

Hi, I'm **Manpreet Singh**.

I am a **Full Stack Developer** with over **3 years of professional experience** building modern web applications.

My primary expertise lies in:

* Next.js
* React
* TypeScript
* REST API Integration

I enjoy creating scalable, responsive, and high-performance web solutions.

Alongside JavaScript development, I have extensive experience with **WordPress CMS**, including:

* Custom Theme Development
* Theme Customization
* Page Builder-Based Websites

Currently, I am working at **Gemini Geeks, Patiala**, where I continue to contribute to modern web projects and improve my technical expertise.

My goal is to further master **Next.js** and **React** while taking on new challenges that help me grow both technically and professionally.

---

## Features

### Content Management

* Add Posts
* Update Posts
* Delete Posts
* Create Pages
* Manage Published/Draft Content

### Category Management

* Add Categories
* Remove Categories
* Assign Categories to Posts

### Authentication System

* User Registration
* User Login
* User Logout
* JWT Authentication
* Protected Dashboard Routes

### Dashboard

* Responsive Admin Dashboard
* Sidebar Navigation
* Redux State Management
* Structured Folder Architecture

### Frontend Website

* Dynamic Post Pages
* Dynamic CMS Pages
* Responsive Layout
* SEO-Friendly Routing

---

## Technologies Used

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Redux Toolkit

### Backend

* Next.js API Routes
* MongoDB

### Authentication

* JSON Web Token (JWT)
* bcrypt

### Validation & Utilities

* validator

### Charts & Analytics

* Recharts

---

## Project Structure

```bash
src/app/
│
├── (dashboard)/
├── (site)/
├── api/
├── lib/
├── login/
├── redux/
├── signup/
└── layout.tsx
```

### Dashboard Pages

```bash
/dashboard
/dashboard/post
/dashboard/page
/dashboard/post/categories
/dashboard/about
```

### Frontend Pages

```bash
/
/posts
/posts/[Id]
/pages
/pages/[Id]
/about
```

---

## Redux State Management

### Post State

```ts
export interface Post {
  _id?: string;
  title: string;
  slug: string;
  status: string;
  publishDate: string;
  categories?: string[] | null;
  content: string;
  featuredImage: {
    link: string;
    alt: string;
  } | null;
  visibility: string;
  postType: string;
}
```

#### Post APIs

```ts
addPost(PostItems: Post)

fetchPosts()

deletePost(id: string)

selectPost(id: string)

updatePost(PostItems: Post)
```

---

### Category State

```ts
export interface Category {
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  categoryCount: number;
}
```

#### Category APIs

```ts
fetchCategories()

addCategory(categoryName: string)

removeCategory(categoryId: string)
```

---

### User State

```ts
interface UserState {
  userid: string;
  name: string;
  email: string;
  isInstall: boolean;
  isLogin: boolean;
  loading: boolean;
  error: string | null;
}
```

#### User APIs

```ts
loginUser(LoginPayload)

signup(signupPayload)

logout()

fetchInstallStatus()

fetchUser()
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/your-username/nextjs-cms.git
```

### Navigate to Project

```bash
cd nextjs-cms
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Start Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Known Limitations

This project was completed within **one week**, so some features were intentionally skipped:

### Not Implemented Yet

* Advanced Toast Notification System
* Media Upload System
* Edit Category Functionality
* Rich Text Editor
* Role-Based Permissions
* Search & Filtering
* Pagination

These features are planned for future versions.

---

## Future Improvements

* Media Library
* Category Editing
* Dashboard Analytics
* Rich Text Editor
* User Roles & Permissions
* Post Search
* Pagination
* SEO Management
* Theme Settings

---

## Notes

This project was created primarily as a portfolio project to demonstrate:

* Full Stack Development
* Next.js App Router
* Redux Toolkit
* Authentication Flow
* REST API Development
* MongoDB Integration
* Responsive Dashboard Design

---

## Author

**Manpreet Singh**

Full Stack Developer

Skills:

* Next.js
* React
* TypeScript
* Redux Toolkit
* MongoDB
* REST APIs
* WordPress Development
