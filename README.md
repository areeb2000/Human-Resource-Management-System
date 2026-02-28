# HRMS Lite

🔥 **Live Frontend (Vercel):** [https://frontend-lxbj9ehh7-md-areeb-inams-projects.vercel.app](https://frontend-lxbj9ehh7-md-areeb-inams-projects.vercel.app)
⚙️ **Live Backend API (Render):** [https://hrms-lite-backend-2c49.onrender.com/api/](https://hrms-lite-backend-2c49.onrender.com/api/) *(Note: replace with exact Render URL if different)*

HRMS Lite is a modern, responsive web application designed for HR administrators and managers to efficiently track employee records and daily attendance. It features a sleek glassmorphic UI, real-time dashboard statistics, and a robust REST API backend.

---

## 🚀 Project Overview

The primary goal of this system is to simplify the management of company employees. Features include:
- **Dashboard:** High-level daily summary of total employees, present, absent, and not marked, including a visual attendance rate pie/bar chart and recent activity feed.
- **Employees Management:** Add, view, and delete employee records. Ensure unique identifiers and email addresses limit duplicate entries.
- **Attendance Tracking:** Mark daily attendance (Present/Absent).
- **Attendance Editing:** Built-in capability to fix/edit existing attendance records dynamically without strict recreation.
- **Statistics & Filtering:** Filter attendance history by date ranges or individual employees. View calculated total, present, and absent days alongside an individual attendance rate percentage.

---

## 💻 Tech Stack Used

### Frontend
- **React 18** (via Vite)
- **Tailwind CSS** (for styling, implementing a premium dark mode, glassmorphic UI)
- **React Router DOM** (for client-side routing)
- **Axios** (for API communication)
- **Lucide React** (for consistent SVG icons)

### Backend
- **Python 3 / Django 5**
- **Django REST Framework (DRF)** (for building the API endpoints)
- **Database:**
  - **SQLite** (default for local development)
  - **PostgreSQL** (configured for production deployment on Render/Railway via `dj-database-url`)
- **django-cors-headers** (for cross-origin resource sharing between React and Django)
- **Gunicorn & WhiteNoise** (for production server and static file serving)

---

## 🛠️ Steps to Run the Project Locally

To run this project on your local machine, you will need to start both the Python backend server and the Node frontend server.

### Prerequisites
- Python 3.10+ installed
- Node.js (v18+) and npm installed

### 1. Backend Setup (Django)

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended):
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the database migrations to set up the SQLite database:
   ```bash
   python manage.py migrate
   ```
5. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   *The backend API will now be running at `http://localhost:8000/`*

### 2. Frontend Setup (React/Vite)

1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The React frontend will now be accessible at `http://localhost:5173/`*

Open `http://localhost:5173/` in your browser to interact with the application.

---

## ⚠️ Assumptions & Limitations

1. **Authentication:** Currently, there is no User/Admin login authentication (JWT/Session). The application assumes the user accessing it is an authorized Manager/Admin. The "Admin / Super Admin" profile at the bottom of the sidebar is currently a static UI element.
2. **Database & Deployment:** The project uses **SQLite** locally for ease of setup. However, it is fully production-ready for platforms like **Render**, **Railway**, or Heroku. 
   - A `render.yaml` blueprint is included in the `backend/` directory.
   - When deployed, `settings.py` automatically detects the `DATABASE_URL` environment variable and switches the database engine from SQLite to **PostgreSQL**.
3. **Pagination:** List views (Employees, Attendance records) currently load all records at once. If the employee base grows into the thousands, API pagination will need to be implemented on both the DRF and React side for performance.
4. **Attendance Logic:** Employees can only have **one** attendance record per day (enforced at the database level).
