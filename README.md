# cohort-10-mern-20388-sajidullah
Cohort 10 — MERN (NodeJS+ReactJS) Notes Application for Sajidullah Khan.

## Getting Started

### Backend Setup Instructions

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```

4. Ensure MongoDB is running at the configured URI (default: `mongodb://localhost:27017`):
   ```bash
   # Start your local MongoDB service or container
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Health Check:
   Verify server status by opening `http://localhost:5000/api/health`.
