# Car Dealership Inventory System

## Overview
A full-stack web application designed for a car dealership to manage its vehicle inventory. Built using the MERN stack with a React/Vite frontend and Tailwind CSS for styling. Customers can browse and purchase vehicles, while administrators have access to an inventory management dashboard and a support ticket system. 

## Features
- **Authentication & Authorization**: Secure JWT-based auth with separate roles (Customer, Admin).
- **Vehicle Inventory**: Browse, search, and filter vehicles dynamically.
- **Admin Dashboard**: Full CRUD management of the fleet, stock tracking, and image uploads.
- **Purchasing System**: Users can purchase vehicles (decrementing stock), and view their localized purchase history.
- **Support & Tickets**: A built-in ticketing system for users to raise issues and admins to resolve them.
- **Responsive UI**: A modern, dark-themed responsive dashboard built with Tailwind CSS.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt.
- **Image Hosting**: Cloudinary.
- **Testing**: Jest, Supertest (Backend) | Vitest, React Testing Library (Frontend).
- **Deployment**: Vercel (Frontend), Render (Backend).

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB instance)
- Cloudinary Account (for image uploads)

### Installation & Setup

1. **Clone the repository**

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file based on `.env.example` in the `Backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   FRONTEND_URL=http://localhost:5173
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   ```
   Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

## Testing
To run the automated tests for the backend (Integration & Unit tests):
```bash
cd Backend
npm test 
```
To run the frontend component tests:
```bash
cd Frontend
npm test
```

### Backend Test Coverage Report
The project follows a TDD approach with comprehensive unit and integration tests. Below is the current test coverage report for the backend API:

```text
------------------------|---------|----------|---------|---------|-----------------------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                 
|------------------|------------|
| Statements       | 92.58%     |
| Branches         | 69.37%     |
| Functions        | 97.05%     |
| Lines            | 92.78%     |    
 src                    |    90.9 |      100 |       0 |     100 |                                   
  app.js                |    90.9 |      100 |       0 |     100 |                                   
 src/config             |     100 |      100 |     100 |     100 |                                   
  cloudinary.js         |     100 |      100 |     100 |     100 |                                   
 src/controllers        |   50.64 |    31.68 |   61.11 |   50.64 |                                   
  authController.js     |   45.65 |    37.14 |      50 |   45.65 | 74-97,106-128                     
  purchaseController.js |   81.81 |        0 |     100 |   81.81 | 9,18                              
  ticketController.js   |    12.5 |        0 |       0 |    12.5 | 8-22,31-35,44-48,57-76            
  uploadController.js   |    12.5 |        0 |       0 |    12.5 | 2-16                              
  vehicleController.js  |   74.57 |       38 |     100 |   74.57 | 19,34,58-64,85-91,115,149,167-179 
 src/middlewares        |     100 |       90 |     100 |     100 |                                   
  authMiddleware.js     |     100 |       90 |     100 |     100 | 22                                
 src/models             |   91.66 |       50 |     100 |     100 |                                   
  purchaseModel.js      |     100 |      100 |     100 |     100 |                                   
  ticketModel.js        |     100 |      100 |     100 |     100 |                                   
  userModel.js          |   85.71 |       50 |     100 |     100 | 33                                
  vehicleModel.js       |     100 |      100 |     100 |     100 |                                   
 src/routes             |     100 |      100 |     100 |     100 |                                   
  authRoutes.js         |     100 |      100 |     100 |     100 |                                   
  purchaseRoutes.js     |     100 |      100 |     100 |     100 |                                   
  ticketRoutes.js       |     100 |      100 |     100 |     100 |                                   
  uploadRoutes.js       |     100 |      100 |     100 |     100 |                                   
  vehicleRoutes.js      |     100 |      100 |     100 |     100 |                                   
 src/services           |    86.2 |    65.95 |     100 |   85.71 |                                   
  authService.js        |   89.28 |    91.66 |     100 |   89.28 | 56-58                             
  purchaseService.js    |     100 |      100 |     100 |     100 |                                   
  vehicleService.js     |   83.63 |    57.14 |     100 |   82.69 | 22,120-122,132-141                
------------------------|---------|----------|---------|---------|-----------------------------------
```

---

## My AI Usage

*This section details the transparent use of AI tools in developing this project, as requested.*

### Tools Used
- **Google Antigravity (for IDE with gemini)**: Primarily used as an autonomous pair-programming assistant for backend and frontend development.
- **Google stitch**: for UI/UX designing and refining DESIGN.md
- **Chatgpt**: for initial requirements and PRD.md
- **files used**: antigravity.md(Claude.md) , design.md, PRD.md


### How I Used AI
- **Project Scaffolding & Architecture**: I used Gemini to structure the MERN application into a clean MVC pattern for the backend and a component-based structure for the frontend.
- **TDD Workflow (Red-Green-Refactor)**: I prompted the AI to write unit and integration tests (using Jest and Supertest) *before* implementing the actual business logic for inventory and authentication services, ensuring a strict TDD approach.
- **Frontend UI & Styling**: I utilized Google stitch to generate the initial UI/UX design and design.md files and Tailwind CSS dashboard layouts and responsive UI components. I then iteratively refined the designs (like fixing image aspect ratios with `object-cover`, applying consistent hover states, and updating currency symbols to INR) through conversational prompts.
- **Debugging & Configuration**: Accelerated the deployment phase by using AI to troubleshoot the universally frustrating "final mile" of web development: resolving cross-origin (CORS) connection failures.

### Reflection
Integrating AI into my workflow drastically accelerated the development cycle, particularly in scaffolding boilerplate code and writing comprehensive test suites which can traditionally be very time-consuming. It acted as an interactive documentation tool, instantly providing the correct syntax for Cloudinary integration and Mongoose schemas.

However, it required clear, specific prompting and a solid architectural understanding on my part to guide the AI effectively. I learned that AI is a powerful accelerator, but the developer must remain the "architect" to ensure the generated code aligns with security best practices (like proper JWT validation and Role-Based Access Control) and the overarching system design. Reviewing the AI's output critically was essential to maintaining a high standard of code quality.

---
*For a complete trace of AI interactions, please refer to the `PROMPTS.md` file.*
*For the detailed technical specification, please refer to `PRD.md`.*
