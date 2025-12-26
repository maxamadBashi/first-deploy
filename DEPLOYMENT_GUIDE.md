# Deployment Guide: Full-Stack Login System

This guide explains how to deploy your React (Vite) frontend and Node.js (Express) backend.

## 1. Backend Deployment (Render)

1.  **Push to GitHub:** Create a GitHub repository and push your `backend` folder code.
2.  **Create Render Web Service:** 
    - Log in to [Render](https://render.com/).
    - Click **New +** and select **Web Service**.
    - Connect your GitHub repository.
    - Set **Root Directory** to `backend`.
    - **Build Command:** `npm install`
    - **Start Command:** `node server.js`
3.  **Environment Variables:** 
    - In Render, go to the **Environment** tab.
    - Add `MONGO_URI`, `JWT_SECRET`, and `PORT` (usually 10000 or Render defaults).
4.  **Copy URL:** Once deployed, copy the service URL (e.g., `https://my-api.onrender.com`).

## 2. Frontend Deployment (Netlify)

1.  **Push to GitHub:** Create another GitHub repository (or use the same one if monorepo) and push your `frontend` code.
2.  **Create Netlify Site:**
    - Log in to [Netlify](https://www.netlify.com/).
    - Click **Add new site** > **Import an existing project**.
    - Connect GitHub and select your repository.
    - Set **Base directory** to `frontend`.
    - **Build command:** `npm run build`
    - **Publish directory:** `dist`
3.  **Environment Variables:**
    - Go to **Site settings** > **Environment variables**.
    - Add `VITE_API_URL` and set its value to your Render URL + `/api` (e.g., `https://my-api.onrender.com/api`).
4.  **Deploy:** Click **Deploy site**.

## 3. Connecting Frontend to Backend

- After both deployments, ensure `VITE_API_URL` in Netlify matches the live Render URL.
- If you see CORS errors:
    - Ensure `app.use(cors())` is present in `server.js`.
    - You can restrict it for better security: `app.use(cors({ origin: 'https://your-netlify-url.netlify.app' }))`.

## 4. Common Errors

- **CORS Error:** Frontend cannot talk to backend. Check CORS settings in `server.js`.
- **401 Unauthorized:** Token is missing or expired. Interceptor should handle this.
- **500 Internal Server Error:** Check Render logs for database connection issues or missing env vars.
- **404 Not Found:** Ensure the `VITE_API_URL` ends with `/api` and the routes match.
