# 🌾 FarmConnect – Full Stack Web Application

FarmConnect is a **role-based full-stack web application** designed to connect **Farm Owners** with **Suppliers/Admins** for managing livestock, medicines, feeds, requests, and feedback efficiently.

The application is built using **Angular** for the frontend and **ASP.NET Core Web API** for the backend, following real-world enterprise project structure.

***

## 🚀 Features

### 🔐 Authentication & Authorization

*   Secure **Login & Registration**
*   **JWT-based authentication**
*   **Role-based access control** (Owner / Supplier / Admin)
*   Protected routes using **Angular AuthGuard**
*   Secure APIs using `[Authorize]`

***

### 👤 Owner (User) Module

*   Owner dashboard with welcome message
*   Add, view, edit, and delete **Livestock**
*   Browse available **Medicines** and **Feeds**
*   Create **Requests** for medicines or feeds
*   Track **Request status**
*   Submit and view **Feedback**

***

### 🏢 Supplier / Admin Module

*   Supplier/Admin dashboard
*   Add, view, edit, delete **Medicines**
*   Add, view, edit, delete **Feeds**
*   View and manage **Incoming Requests**
*   Approve / Reject requests
*   View feedback submitted by owners

***

### ✅ Common Features

*   Dynamic dashboards for each role
*   Search functionality (starts-with filtering)
*   Loading indicators while fetching data
*   Confirmation popups for success actions
*   Alert dialogs for errors
*   Clean UI with reusable components
*   Responsive design

***

## 🛠 Tech Stack

### 💻 Frontend

*   **Angular**
*   TypeScript
*   HTML5 & CSS3
*   Angular Routing & Guards
*   Template-driven forms

### ⚙️ Backend

*   **ASP.NET Core Web API**
*   Entity Framework Core
*   JWT Authentication
*   RESTful APIs

### 🗄 Database

*   SQL Server (or any relational DB supported by EF Core)

***

## 📂 Project Structure (High Level)

```text
FarmConnect/
│
├── frontend-angular/
│   ├── src/app/components/
│   │   ├── login/
│   │   ├── registration/
│   │   ├── ownerhome/
│   │   ├── adminhome/
│   │   ├── createlivestock/
│   │   ├── viewlivestock/
│   │   ├── createmedicine/
│   │   ├── viewmedicine/
│   │   ├── createfeed/
│   │   ├── viewfeed/
│   │   ├── requestform/
│   │   └── feedback/
│   │
│   ├── guards/
│   ├── services/
│   └── app-routing.module.ts
│
├── backend-dotnet/
│   ├── Controllers/
│   ├── Models/
│   ├── Services/
│   ├── Repositories/
│   └── Program.cs
│
└── README.md
```

***

## 🔑 Role-Based Routing

### Public Routes

*   `/`
*   `/home`
*   `/login`
*   `/register`

### Owner Routes

*   `/owner/home`
*   `/owner/createlivestock`
*   `/owner/viewlivestock`
*   `/owner/medicines`
*   `/owner/feeds`
*   `/owner/requestform`
*   `/owner/ownerviewrequest`
*   `/owner/useraddfeedback`

### Supplier / Admin Routes

*   `/admin/home`
*   `/admin/medicine/add`
*   `/admin/medicine/view`
*   `/admin/feed`
*   `/admin/feed/view`
*   `/admin/requests`
*   `/admin/feedbacks`

***

## 🔐 Security Implementation

### Frontend

*   `authGuard` protects routes based on:
    *   Token existence
    *   User role (`Owner`, `Supplier`, `Admin`)
*   JWT stored securely in `localStorage`

### Backend

*   `[Authorize]` attribute on protected APIs
*   Role-based API protection using `Roles`

***

## ✅ Authentication Flow

1.  User logs in
2.  Backend returns:
    *   JWT Token
    *   UserId
3.  Frontend decodes:
    *   Role
    *   Username (email claim)
4.  Data stored in `localStorage`
5.  User redirected to role-specific dashboard
6.  Success popup displayed on login

***

## 🧪 Validations & UX Improvements

*   Form validations for required fields
*   Loading indicators on API calls
*   Search with **starts-with match**
*   Popups for success actions
*   Alert dialogs for errors
*   Role-specific navigation menus

***

## 📌 How to Run the Project

### ▶️ Backend (ASP.NET Core Web API)

```bash
dotnet restore
dotnet ef database update
dotnet run
```

### ▶️ Frontend (Angular)

```bash
npm install
ng serve
```

Open in browser:

    http://localhost:4200

***

## 📷 Screens Implemented

*   Login & Registration
<img width="1366" height="768" alt="Screenshot 2026-04-09 121402" src="https://github.com/user-attachments/assets/9564f3c6-bbc3-4a71-9e8e-eabc3671e5a4" />
<img width="1366" height="768" alt="Screenshot 2026-04-09 093517" src="https://github.com/user-attachments/assets/1d5f6227-d78d-4e47-a84a-6728ad8f4ba4" />
<img width="1366" height="768" alt="Screenshot 2026-04-09 093503" src="https://github.com/user-attachments/assets/f3e63c0a-09ef-4356-9bfc-73ad0fc31af9" />




*   Owner Dashboard
*   Supplier/Admin Dashboard
*   Livestock Management
*   Medicine & Feed Management
*   Request Management
*   Feedback Management

***

## ✨ Future Enhancements

*   Pagination on tables
*   Profile management
*   Email notifications
*   Charts and analytics on dashboards
*   Image upload for medicines and feeds

***

## 🧑‍💻 Developed By

**FarmConnect Project Team**  
Frontend + Backend Full Stack Project
























