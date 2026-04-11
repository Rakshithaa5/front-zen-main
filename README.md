# Welcome to your Lovable project

TODO: Document your project here

## Docker

Build and run the app with Docker Compose:

```bash
docker compose up --build
```

Frontend: http://localhost:8080

Backend: http://localhost:5000

The backend expects its environment variables in `backend/.env`, including `JWT_SECRET`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

## Docker Hub

Docker Hub will not show a repository until you push the first image.

If you want to publish the images for the account shown in your screenshot (`rakshithaa5`), use a repository name of your choice and push with these commands:

```bash
docker login

docker build -t rakshithaa5/front-zen-frontend:latest .
docker build -t rakshithaa5/front-zen-backend:latest ./backend

docker push rakshithaa5/front-zen-frontend:latest
docker push rakshithaa5/front-zen-backend:latest
```

If you prefer versioned tags, replace `latest` with something like `v1.0.0`.

After the push, open Docker Hub and refresh the Repositories page. You should see the new repo and its tag list there.
