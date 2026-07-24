# Car Dealership Inventory System

## Overview
A full-stack web application designed for a car dealership to manage its vehicle inventory. Built using the MERN stack with a React/Vite frontend and Tailwind CSS for styling. Customers can browse and purchase vehicles, while administrators have access to an inventory management dashboard and a support ticket system.

##Deployment
Live:  https://car-dealership-inventory-system-five.vercel.app/

*Note: The backend is hosted on Render's free tier, which automatically spins down the server after a period of inactivity. As a result, the first request may take 30–35 seconds while the server instance starts up ("cold start"). Subsequent requests will respond normally once the service is awake.*

Credential for testing:
- **admin**: admin@elitedrive.com  pass: admin
- **User**: test@gmail.com pass: test1234

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

---
### Screens
- **User**: 
<img width="1916" height="863" alt="Screenshot 2026-07-23 205933" src="https://github.com/user-attachments/assets/d1c2128b-ce45-4c6b-9718-b67407d58805" />
<img width="1917" height="863" alt="Screenshot 2026-07-23 205924" src="https://github.com/user-attachments/assets/8e65b049-b8cb-4091-8484-a047a48ae94a" />
<img width="1902" height="860" alt="Screenshot 2026-07-23 204350" src="https://github.com/user-attachments/assets/a1e09abb-f50d-4c6f-9bac-97454cc3b328" />
<img width="1897" height="857" alt="Screenshot 2026-07-23 204431" src="https://github.com/user-attachments/assets/15fe0aca-baaf-4460-aef6-aa1f24df4aba" />
<img width="1916" height="861" alt="Screenshot 2026-07-23 204525" src="https://github.com/user-attachments/assets/b2f04aae-2f50-4c68-ae8d-24fc20a8c57c" />
<img width="1917" height="867" alt="Screenshot 2026-07-23 204544" src="https://github.com/user-attachments/assets/d9b51e66-c05d-414a-9ef8-82a98396e276" />
<img width="1917" height="877" alt="Screenshot 2026-07-23 204555" src="https://github.com/user-attachments/assets/6cf7abc5-4aae-4c14-8f54-4f4ad0deef73" />
<img width="1892" height="857" alt="Screenshot 2026-07-23 204617" src="https://github.com/user-attachments/assets/7ce9f376-0d9b-4aea-9b3d-02a5e18964b3" />

- **admin**:
<img width="1905" height="858" alt="Screenshot 2026-07-23 204949" src="https://github.com/user-attachments/assets/ce8b0b79-8f6f-44b6-bf80-a983c31c88c1" />
<img width="1896" height="862" alt="Screenshot 2026-07-23 205033" src="https://github.com/user-attachments/assets/21110860-5a9d-4cac-a75b-71827704a586" />
<img width="1897" height="847" alt="Screenshot 2026-07-23 205011" src="https://github.com/user-attachments/assets/0614bea5-4a62-42c2-8eb3-0d851118d489" />
<img width="1901" height="860" alt="Screenshot 2026-07-23 205000" src="https://github.com/user-attachments/assets/475e42eb-5699-440e-972c-63ea31092f0b" />
<img width="1917" height="863" alt="Screenshot 2026-07-23 205047" src="https://github.com/user-attachments/assets/9444b9b0-ebf1-428c-b811-7ed71b0bd75f" />






