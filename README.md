# Project Management System with AI Assistant

This is a full-stack project management application that allows users to create projects, manage tasks using a Kanban board, and interact with a Gemini-powered AI assistant to gain insights and generate tasks.

<a href="https://res.cloudinary.com/dekfegqot/image/upload/v1760685967/portfolio-images/snapshot_2025-10-17-12-53-16-618_t4fzj2.jpg" target="_blank">
  <img src="https://res.cloudinary.com/dekfegqot/image/upload/w_150/v1760685967/portfolio-images/snapshot_2025-10-17-12-53-16-618_t4fzj2.jpg" alt="Screenshot of the application--portrait" />
</a>
<a href="https://res.cloudinary.com/dekfegqot/image/upload/v1760685966/portfolio-images/snapshot_2025-10-17_071746_awaufq.png" target="_blank">
  <img src="https://res.cloudinary.com/dekfegqot/image/upload/w_300/v1760685966/portfolio-images/snapshot_2025-10-17_071746_awaufq.png" alt="Screenshot of the application--landscape" />
</a>

## Live Site

<a href="https://proj-mgmt.servehttp.com" target="_blank">Project & Task Management System</a>

## Setup Instructions

### Development Environment

1.  Run the following command in the root directory to install all necessary packages for both the server and the client:
    ```bash
    npm run setup-dev
    ```
2.  Once the installation is complete, run the following command to start the app:
    ```bash
    npm run dev
    ```
3.  App should be live at localhost on port 5173
    ```bash
    http://localhost:5173
    ```

### Production Environment

For hosting services like Vercel, Render, etc., use the following commands:

*   **Build Command:** `npm run setup-prod`
*   **Start Command:** `node server.js`

### Note:
If you are deploying to a cloud instance like AWS EC2/GCP VMs/Droplets etc, you can simply run the build command followed by the start command at project root.

## Environment Variables

Create a `.env` file in the root of the project directory. If you are using a hosting service like Vercel or Render, you can add these environment variables in their respective settings.

-   `NODE_ENV`: Current setup environment (e.g., `development`, `production`)
-   `PORT`: The port on which the server will run (e.g., `3000`).
-   `MONGO_URI`: The connection string for your MongoDB database.
-   `GEMINI_API_KEY`: Your API key for the Gemini API.
-   `GEMINI_MODEL`: The Gemini model you want to use. Here are a few options:
    *   `gemini-2.5-pro`: The most powerful and all-around model for detailed and thoughtful responses.
    *   `gemini-2.5-flash`: A balanced model for speed and accuracy.
    *   `gemini-2.5-flash-lite`: The fastest model, ideal for quick responses where high accuracy is not critical.