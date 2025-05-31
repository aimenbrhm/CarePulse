CarePulse – Project Access & Usage Guide


⚡ You can simply access these two links (the ones in Live Demo) to see the live demo of the app in action but u need to read Note 1 and Note 2 before ⚡

🌐 Live Demo 
Patient Side:
https://carepulsepatient.netlify.app

Admin & Doctor Side:
https://carepulseadmin-doc.netlify.app

👤 Test Accounts

Patient Login
Email: aimen@gmail.com
Password: 12345678

Alternate Patient:

Email: oussamabrhm@gmail.com
Password: 12345678

Or: Create a new account for a better experience.

⚡ Note 1: Please fill out your medical record and profile information before making appointments.

Doctor Login
Use an existing doctor (entered by admin):

Email: emily@gmail.com
Password: 12345678


Admin Login :

Email: admin@gmail.com
Password: qwerty123
(Make sure you are on the admin login page.)

⚡ Note 2 : Login may take a little time because the databases are hosted online (Render in Frankfurt and MongoDB in Belgium).

Backend API (for verification):
https://carepulse-2-06qh.onrender.com

🖥️ Running the Project Locally
1. Clone the Repository : 
git clone https://github.com/aimenbrhm/CarePulse.git

cd versionfinale
3. Install Dependencies
For each of the following, run:
npm install
in these directories:
/backend
/frontend
/admin
4. Start the Backend
cd backend
npm run server
5. Start the Frontend (Patient Side)
cd frontend
npm run dev
6. Start the Admin/Doctor Panels
cd admin
npm run dev
📦 Required Packages
All dependencies are listed in each folder’s package.json. The main ones include:

Backend: express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken, multer, etc.
Frontend/Admin: react, react-dom, react-router-dom, axios, framer-motion, react-toastify, etc.
⚡ Note : Just run npm install in each directory to get everything you need.
