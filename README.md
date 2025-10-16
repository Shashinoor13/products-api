# Heubert Product Management

This project is a full-stack application for managing products. It features a React-based frontend and a NestJS-based backend. The entire application is containerized using Docker for easy setup and deployment.

## Technology Stack

*   **Frontend:** React, Vite, TypeScript
*   **Backend:** NestJS, TypeScript, PostgreSQL
*   **Containerization:** Docker, Docker Compose

## Getting Started

To run this project locally, you will need to have Docker and Docker Compose installed on your machine.

1.  **Clone the repository** (if you haven't already).

2.  **Run the application:**
    From the root directory of the project, run the following command:
    ```bash
    docker-compose up --build
    ```
    This command will build the Docker images for the frontend, backend, and database services and start the containers.

## Accessing the Application

Once the containers are up and running, you can access the different parts of the application:

*   **Frontend Application:** [http://localhost:4173](http://localhost:4173)
*   **Backend API:** [http://localhost:3000](http://localhost:3000)


## Testing the backend**
To test the cache implementation, There are 16 test cases exploring Basic Operations,Evictions,Configuration and Some Edge Cases

```bash
cd product_backend
npm install
npm run test
```