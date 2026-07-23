**To the Gemini ai:**

Role: Act as a Senior Technical Product Manager and Software Architect.

Context: We are building a Car Dealership Inventory System for a strict TDD (Test-Driven Development) Kata. I am acting as the Lead Full-Stack Developer. I need this system strictly scoped to the Kata requirements to ensure we can execute a clean Red-Green-Refactor cycle using Jest and Supertest.

Tech Stack Selection:
- Backend: Node.js with Express (ES Modules)
- Database: MongoDB (using Mongoose for schemas and models)
- Frontend: React, HTML5, Vanilla CSS, Tailwind CSS, Vite
- Auth: JWT-based token authentication
- Cloud: Cloudinary (for vehicle image uploads)

Task: Generate a comprehensive, developer-ready PRD.md (Product Requirements Document) tailored to the MERN stack. Do NOT generate any application code yet. This PRD will serve as our source of truth for the AI-assisted TDD workflow.

Required Structure for the PRD.md:
1. Overview & Objectives: Brief summary of the system and the strict TDD methodology we are enforcing.
2. User Roles & Permissions: Define the Public, Authenticated Customer, and Admin boundaries.
3. Core Epics & User Stories: Break down the Kata requirements (Auth, Vehicle Management, Inventory/Purchasing, Support Tickets, Frontend Dashboard) into small, testable user stories.
4. Data Schema (Entity Relationship): Define the database collections, relationships, and constraints (e.g., Users, Vehicles, Purchases, Tickets) in markdown tables or Mermaid.js format.
5. API Contract: Outline the exact RESTful API endpoints, methods, payload structures, and expected status codes required by the Kata.
6. Milestones for AI-Assisted Implementation: Propose a step-by-step roadmap for how we should tackle the coding phase using TDD (e.g., Step 1: Auth API Tests, Step 2: Auth API Implementation, etc.).


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
**Prompt to antigravity:**


I am building the backend for a Car Dealership Inventory System using Node.js, Express, MongoDB (Mongoose), and ES Modules (type: "module"). I need to implement the Authentication module (Register and Login) with JWT.

I must follow a strict Test-Driven Development (TDD) process and maintain a clean N-tier architecture. Please generate the code for the following files.

Important: Output the test file first, then output the implementation files so I can review the test coverage before implementing the logic.

1. The Tests (RED Phase):

tests/auth.test.js: Write integration tests using Jest and Supertest for POST /api/auth/register and POST /api/auth/login. Cover successful registration/login, password hashing verification, and error cases (missing fields, duplicate email, wrong password).

-------------------------------------------------------------------------------------------------------

2. The Implementation (GREEN Phase):

src/models/userModel.js: Create a Mongoose schema for the User (email, password, role). Include a pre('save') hook to automatically hash the password using bcryptjs before saving.

src/services/authService.js: Write the business logic to create a user, verify credentials, and generate a JWT using jsonwebtoken.

src/controllers/authController.js: Write the Express controller to parse req.body, call the authService, and return standard HTTP responses.

src/routes/authRoutes.js: Map the Express router to the controller functions.

src/app.js: Provide the code to import authRoutes and mount it to /api/auth inside the Express app instance."

-------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------
To the antigravity:
role is not required for the post localhost:5000/api/auth/register this request

we dont require to add role thing we just use one email:admin@car.com and pass:admin only this is the admin all other are the regular customer so first create one waltkthrough/planning file i will review it 


-----------------------------------------------------------------------------------------------------------------------------------------------------------------

I have successfully implemented the Auth module. We are now moving to Phase 2 of the Car Dealership Inventory System backend (Node.js, Express, MongoDB, ES Modules). I need to implement the Auth Middlewares and the core Vehicle CRUD operations.

Please follow the strict Test-Driven Development (TDD) process and N-tier architecture. Output the test file first, then output the implementation files.

1. The Tests (RED Phase):

tests/vehicles.test.js: Write integration tests using Jest and Supertest for the /api/vehicles endpoints.

You must mock JWT tokens (one for a 'customer' role, one for an 'admin' role) to test the security barriers.

Write tests for: GET /api/vehicles (allows any valid token), GET /api/vehicles/search (tests query filters like make or category), POST /api/vehicles (Admin only - test success and 403 Forbidden for customers), PUT /api/vehicles/:id (Admin only), and DELETE /api/vehicles/:id (Admin only).

2. The Implementation (GREEN Phase):

src/middlewares/authMiddleware.js: Implement verifyToken (validates JWT) and requireAdmin (checks if req.user.role === 'admin').

src/models/vehicleModel.js: Create the Mongoose schema (make, model, category, price, quantity). Ensure quantity defaults to 0 and price/quantity cannot be negative.

src/services/vehicleService.js: Write the business logic to fetch all vehicles, perform dynamic searches based on query parameters, create, update, and delete vehicles.

src/controllers/vehicleController.js: Write the Express controllers to handle req and res, calling the vehicleService.

src/routes/vehicleRoutes.js: Map the endpoints. Apply verifyToken to all routes, and add requireAdmin to the POST, PUT, and DELETE routes.

src/app.js: Provide the updated lines to import vehicleRoutes and mount it to /api/vehicles."


-------------------------------------------------------------------------------------------------------

untill now i have not added .env than how they able to pass the test cases

-------------------------------------------------------------------------------------------------------


We are moving to Phase 3 of the Car Dealership Inventory System backend. I need to implement the Business Transactions: Purchasing and Restocking vehicles.

Please continue to follow the strict Test-Driven Development (TDD) process (outputting the test file first) and maintain the N-tier architecture (ES Modules).

1. The Tests (RED Phase):

tests/inventory.test.js (or append to the existing vehicles test): Write integration tests for the following endpoints. Use async/await properly so the tests actually execute and fail.

Purchase: Test POST /api/vehicles/:id/purchase. It requires a standard JWT. Test a successful purchase (quantity decreases by 1). Crucial: Write a strict test that attempts to purchase a vehicle when quantity === 0 and verify it fails with a 400 Bad Request.

Restock: Test POST /api/vehicles/:id/restock. It requires an Admin JWT. Test a successful restock (quantity increases).

2. The Implementation (GREEN Phase):

src/services/vehicleService.js: Add a purchaseVehicle function. You MUST use MongoDB's atomic operators (e.g., findOneAndUpdate with $inc: { quantity: -1 } and a query condition ensuring quantity: { $gt: 0 }) to prevent race conditions. Add a restockVehicle function as well.

src/controllers/vehicleController.js: Add the controller methods to handle these new service functions.

src/routes/vehicleRoutes.js: Map POST /api/vehicles/:id/purchase (protected by verifyToken) and POST /api/vehicles/:id/restock (protected by verifyToken and requireAdmin)."


-------------------------------------------------------------------------------------------------------

{

    "success": true,

    "message": "User registered successfully",

    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWZjNjM0OThmNzc2MDcwYTRlZWU4NCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3ODQ2NjE1NTYsImV4cCI6MTc4NDc0Nzk1Nn0.YtISUJuqBwWECqyV2YQwsCN4MGFRCk9hsBL-pLWG9VU",

    "data": {

        "name": "user1",

        "email": "test@gmail.com",

        "role": "customer",

        "_id": "6a5fc63498f776070a4eee84",

        "createdAt": "2026-07-21T19:19:16.459Z",

        "updatedAt": "2026-07-21T19:19:16.459Z",

        "__v": 0,

        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWZjNjM0OThmNzc2MDcwYTRlZWU4NCIsImVtYWlsIjoidGVzdEBnbWFpbC5jb20iLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3ODQ2NjE1NTYsImV4cCI6MTc4NDc0Nzk1Nn0.YtISUJuqBwWECqyV2YQwsCN4MGFRCk9hsBL-pLWG9VU"

    }

}

Remove the redundat token from data as well as __v

-------------------------------------------------------------------------------------------------------

"I need to fix an oversight in my Car Dealership Inventory System. We have a purchase endpoint (POST /api/vehicles/:id/purchase), but we are not tracking the purchase history.

I need to create a Purchase model and update my existing purchase logic to log the transaction. Please follow the strict Test-Driven Development (TDD) process. Output the test file updates first.

1. The Tests (RED Phase):

tests/purchase.test.js (or update the existing inventory tests): Write a test that verifies when a user successfully purchases a vehicle, a new record is created in the Purchase collection linking the userId and vehicleId.

Write a test for a new endpoint: GET /api/users/purchases to fetch the logged-in user's purchase history.

2. The Implementation (GREEN Phase):

src/models/purchaseModel.js: Create a Mongoose schema containing user (ObjectId referencing User), vehicle (ObjectId referencing Vehicle), purchasePrice (Number), and purchaseDate (Date, default to Date.now).

src/services/vehicleService.js: Update the purchaseVehicle function. When the vehicle quantity is successfully decremented via $inc, it must now also create and save a new Purchase document using the user's ID and the vehicle's price.

src/controllers/userController.js (New/Update): Create a controller function to handle fetching a user's purchase history.

src/routes/userRoutes.js (New/Update): Map the GET /api/users/purchases endpoint and protect it with the verifyToken middleware. Mount this in app.js."

--------------------------------------------------------------------------------------------------

I need to implement a system that tracks vehicle purchases, allowing users to see their own history and admins to see all platform transactions.

Please follow the strict Test-Driven Development (TDD) process. Output the test file first, then output the implementation files.

1. The Tests (RED Phase):

tests/purchase.test.js: Write integration tests using Jest and Supertest.

Test 1: Modify or add to the existing POST /api/vehicles/:id/purchase test to verify that a successful purchase now also creates a document in the Purchase collection.

Test 2: GET /api/purchases/my-history (Protected). Verify a logged-in user can retrieve an array of their own purchases.

Test 3: GET /api/purchases (Admin Only). Verify an admin can retrieve a list of all purchases made by all users on the platform.

2. The Implementation (GREEN Phase):

src/models/purchaseModel.js: Create a Mongoose schema containing user (ObjectId referencing User), vehicle (ObjectId referencing Vehicle), purchasePrice (Number), and purchaseDate (Date, default Date.now).

src/services/purchaseService.js: Write the logic for getUserPurchases(userId) and getAllPurchases(). Also, provide the code snippet needed to update my existing vehicleService.js so that purchaseVehicle() automatically creates a Purchase record when the vehicle stock is decremented.

src/controllers/purchaseController.js: Write the Express controllers (getMyPurchases and getAllPurchases) to handle the HTTP requests and format the JSON responses cleanly.

src/routes/purchaseRoutes.js: Map the routes and protect them with the verifyToken and requireAdmin middlewares where appropriate. Mount this in app.js."

-------------------------------------------------------------------------------------------------------

**Prompt to stitch:**

I am attaching a reference image to show the design theme, color palette, and general layout style I want.

However, I am building a specific Car Dealership Inventory System using React and Tailwind CSS. Please ignore any extra features in the image. Only build the UI components and pages required for the features listed below.

Please generate a modern, responsive Single-Page Application (SPA) structure with the following requirements:

1. Global Requirements:

Use React components and Tailwind CSS for all styling.

Create a persistent Navigation Bar with links to: Dashboard, My Purchases, Admin Panel (hidden if not admin), and a Logout button.

2. Authentication Pages:

Clean, centered forms for Login and Registration (Email, Password, Name).

3. The Customer Dashboard (Main Page):

A top section for Search and Filtering (inputs for Make, Model, Category, and Price Range).

A responsive CSS Grid displaying VehicleCard components.

VehicleCard Component: Must display the car's imageUrl, Make, Model, Category, Price, and current Quantity. It must have a "Purchase" button. Design a distinct disabled state (grayed out) for the Purchase button if quantity === 0.

4. Admin Panel (Protected View):

A data table or list view of all vehicles and analytics dashboard.

Action buttons on each row: "Edit", "Delete", and "Restock".

A clean modal or form to "Add New Vehicle" with inputs for Make, Model, Category, Price, Quantity, and Image URL.

5. Purchase History Page:

A simple, elegant table displaying the user's past transactions (Vehicle Name, Purchase Price, and Date).

-------------------------------------------------------------------------------------------------------

I want to upgrade my Car Dealership Inventory System backend (Node.js, Express) to support actual image uploads using Cloudinary and Multer. I need a dedicated image upload endpoint so my frontend can upload an image, receive the Cloudinary URL back, and then include that URL when creating a new vehicle.

Please follow the strict Test-Driven Development (TDD) process. Output the test file first, then output the implementation files.

1. Install Instructions:

Please list the exact npm install command for the required packages (e.g., multer, cloudinary, multer-storage-cloudinary).

2. The Tests (RED Phase):

tests/upload.test.js: Write an integration test using Jest and Supertest for a new endpoint POST /api/upload.

Use Supertest's .attach() method to simulate a file upload.

Crucial: You must mock the Cloudinary uploader in the test file so the test does not actually upload dummy files to my real cloud bucket. Verify the endpoint returns a 200 status, success message, and the mock image URL.

3. The Implementation (GREEN Phase):

src/config/cloudinary.js: Create the configuration file to initialize Cloudinary using environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET). Set up the Multer storage engine.

src/controllers/uploadController.js: Write the controller to handle the response once Multer processes the file, returning the file path/URL cleanly.

src/routes/uploadRoutes.js: Create the route that applies the verifyToken middleware (to prevent anonymous uploads) and the Multer middleware before hitting the controller.

src/app.js: Provide the snippet to mount this route at /api/upload."


-------------------------------------------------------------------------------------------------------

update the vehicleSchema by adding the imagUrl field in it

-------------------------------------------------------------------------------------------------------

My React frontend is currently displaying a blank screen. I have placed the Stitch output files (the HTML/JSX code and design.md) inside src/reference/ (or specify your folder path).

Please fix the blank screen issue and implement the complete authentication flow (Login and Register pages) following these steps:

1. Fix the Blank Screen & Set Up Routing (src/App.jsx & src/main.jsx):

Inspect src/main.jsx and ensure BrowserRouter from react-router-dom wraps <App/>.

In src/App.jsx, set up routes:

/login -> <Login/>

/register -> <Register/>

/ -> Redirect to /login if unauthenticated.

2. Implement src/pages/Login.jsx:

Read the code and design.md inside my reference folder.

Convert any static HTML into clean React/Tailwind JSX syntax (fix class to className, self-closing tags, for to htmlFor).

Add useState hooks for email and password.

Add a link at the bottom of the form: "Don't have an account? Sign up" pointing to /register.

Connect the form submission to POST http://localhost:5000/api/auth/login. On success, save the token and user to localStorage and navigate to /dashboard.

3. Build src/pages/Register.jsx (Derived from Login Design):

Using the exact same visual styling, color palette, card layout, and button designs from the Login page, create src/pages/Register.jsx.

Add input fields for: Full Name, Email Address, and Password.

Add a link at the bottom: "Already have an account? Log in" pointing to /login.

Connect the form submission to POST http://localhost:5000/api/auth/register. On success, automatically save the returned token and navigate to /dashboard.

4. Handle Errors & Loading States:

Display clean inline alert messages (using Tailwind red text/banners) if the backend returns an authentication error (e.g., 'Invalid credentials' or 'User already exists').

Output the updated App.jsx, Login.jsx, and Register.jsx files."


-------------------------------------------------------------------------------------------------------

I need to connect my React frontend's authentication pages to my Node.js backend. My backend is running locally on http://localhost:5000.

Please generate the necessary code to complete this integration by following these steps:

1. Create the API Service (src/services/api.js):

Import Axios and create a base instance pointing to http://localhost:5000/api.

Add an Axios request interceptor. This interceptor must check localStorage for a token. If a token exists, attach it to the Authorization: Bearer <token> header.

Export two functions: loginAPI(credentials) (POST to /auth/login) and registerAPI(userData) (POST to /auth/register).

2. Update src/pages/Login.jsx:

Import the loginAPI function and useNavigate from react-router-dom.

Update the form submission handler to call loginAPI with the email and password state.

On Success: Save the returned token to localStorage and use navigate('/dashboard') to redirect the user.

On Error: Catch the error and display the backend's error message (e.g., 'Invalid credentials') in a visually distinct Tailwind error alert box above the form.

3. Update src/pages/Register.jsx:

Import the registerAPI function and useNavigate.

Update the form submission handler to call registerAPI with the name, email, and password state.

On Success: Save the returned token to localStorage and navigate('/dashboard').

On Error: Catch and display the backend's error message (e.g., 'User already exists') cleanly on the UI.

-------------------------------------------------------------------------------------------------------

"I approve the implementation plan. Let's start with Phase 1: Core Architecture & Routing. I want to maintain strict TDD, so output the test files (Red Phase) before the implementation files (Green Phase).

1. The Tests (Red Phase):

Generate src/context/AuthContext.test.jsx to verify that the context correctly decodes a mock JWT and provides the user, role, and logout functions.

Generate src/components/ProtectedRoute.test.jsx to verify that unauthenticated users are redirected to /login, and non-admins are blocked from /admin/* routes.

2. The Implementation (Green Phase):

Create src/context/AuthContext.jsx. It should decode the JWT from localStorage on load to extract the role and id, and provide a logout() function that clears storage and redirects.

Create src/components/ProtectedRoute.jsx that accepts an allowedRoles prop.

Update src/App.jsx to wrap the app in the AuthProvider and set up the protected routing structure for /home, /purchase-history, and /admin/inventory

-------------------------------------------------------------------------------------------------------

Let's move to Phase 2: The Customer Dashboard and API integration. I have static HTML/JSX files inside src/reference/Normaluser/.

1. The Tests (Red Phase):

Update src/services/api.js to include getVehicles().

Create src/pages/Home.test.jsx. Mock the getVehicles API call to return a fake array of cars. Write a test asserting that the <CarCard/> components render correctly on the screen.

2. The Implementation (Green Phase):

Read the Normaluser reference files. Convert the layout into src/components/DashboardLayout.jsx (Sidebar and TopNav). Ensure standard users only see links for 'Home' and 'Purchase History'.

Extract the vehicle display into a reusable src/components/CarCard.jsx.

Build src/pages/Home.jsx. It must use useEffect to call getVehicles() on load, store the result in state, and map over the array to render the CarCards inside the layout.

Please output the updated api.js, the test files, and the React components.

-------------------------------------------------------------------------------------------------------

{/* <div className="absolute top-4 left-4 z-10">
          {isSoldOut ? (
            <span className="px-3 py-1 bg-on-surface-variant/20 text-on-surface-variant text-[10px] font-bold uppercase rounded-full border border-outline-variant">
              Sold Out
            </span>
          ) : (
            <span className="px-3 py-1 bg-primary-container/20 text-primary text-[10px] font-bold uppercase rounded-full border border-primary/30">
              New
            </span>
          )}
        </div> */}

i want to display only Sold Out 
[CarCard.jsx#L13-15](textBlock;file:///c%3A/01_Placement_Project/car-inventory-system/Frontend/src/components/CarCard.jsx#L13-15) make it little dark so it is readable

-------------------------------------------------------------------------------------------------------

redesign the layout of the car card
because CarCard image size depends on size of an image i want consistent car size can you implement it

-------------------------------------------------------------------------------------------------------


Implementing the Purchase flow and History Ledger.

1. The Tests (Red Phase):

Update src/services/api.js with purchaseVehicle(id) and getMyPurchases().

Create src/pages/PurchaseHistory.test.jsx. Mock getMyPurchases and verify the table renders the correct transaction dates and prices.

2. The Implementation (Green Phase):

Update CarCard.jsx and Home.jsx so that clicking 'Purchase' triggers purchaseVehicle(). On success, show a Tailwind success toast/alert, and decrement the quantity of that specific car in the local state so the UI updates instantly without refreshing. Disable the button if quantity === 0.

Build src/pages/PurchaseHistory.jsx using the table styling from my reference files. Fetch the data on load and map it into the table rows.

Please output the updated API service, the tests, and the modified/new components.

-------------------------------------------------------------------------------------------------------

I have reference files in src/reference/admin/.

1. The Tests (Red Phase):

Update src/services/api.js with uploadImage(file), createVehicle(data), and getAllPurchases().

Create src/pages/AdminInventory.test.jsx. Mock the API calls and verify that submitting the 'Add Vehicle' form correctly sequences the image upload followed by the vehicle creation.

2. The Implementation (Green Phase):

Build src/pages/AdminInventory.jsx using the admin reference files. It should display a data table of all vehicles.

Implement the VehicleForm.jsx modal.

Crucial Upload Logic: The form must contain a file input. When the admin clicks submit, the component must FIRST call uploadImage(file). It must wait for the Cloudinary URL to be returned, attach that URL to the form payload, and THEN call createVehicle(payload).

Build src/pages/AdminPurchases.jsx to display the master ledger of all platform transactions.

Please output the final API updates, tests, and Admin components.
-------------------------------------------------------------------------------------------------------
hove effect on setting support&ticket and on logout is not there and add cursor: clicking like on hovering the logout

-------------------------------------------------------------------------------------------------------

change currency to $ to INR(₹)

-------------------------------------------------------------------------------------------------------

generate the missing test case for the auth, ticket, vehicle or anyother module of the backend

-------------------------------------------------------------------------------------------------------

generate the sample 10 luxury car data

like this

 { make: 'Toyota', model: 'RAV4', category: 'SUV', price: 30000, quantity: 2 } into the json format

-------------------------------------------------------------------------------------------------------

help me to prepare README.md file.

-------------------------------------------------------------------------------------------------------
· Generate test report showing the results of your test suite means test coverage report.


















































