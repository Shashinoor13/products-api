# Product Backend

This document provides an overview of the NestJS backend service for the Heubert Product Management application.

## Code Structure

The backend follows a modular, domain-driven structure, separating concerns into distinct layers.

```
src/
├── main.ts
├── app.module.ts
│
├── infrastructure/
│   ├── cache/
│   ├── config/
│   └── middleware/
│
└── modules/
    └── products/
        ├── controllers/
        ├── dtos/
        ├── entities/
        ├── repositories/
        └── use-cases/
```

### Key Directories

-   **`src/main.ts`**: The entry point of the application. It initializes the NestJS app, sets up global middleware (like CORS), configures Swagger, and starts the HTTP server.
-   **`src/infrastructure`**: This directory contains modules and providers that are not specific to any single business domain. It handles database connections (`pg.config.ts`), caching (`cache/`), and other shared functionalities like logging (`middleware/`).
-   **`src/modules`**: This is the core of the application, where each business domain gets its own module.
-   **`src/modules/products`**: A self-contained module for all product-related functionality.
    -   **`controllers`**: Defines the API endpoints (e.g., `GET /products`, `POST /products`). Controllers are responsible for handling incoming HTTP requests and returning responses. They delegate the actual work to Use Cases.
    -   **`use-cases`**: Each file represents a single, specific business action (e.g., `CreateProductUseCase`, `GetAllProductsUseCase`). This layer orchestrates the logic, calling repositories and other services to fulfill the request.
    -   **`repositories`**: The data access layer. The `ProductRepository` is responsible for all communication with the database for the `Product` entity. It uses TypeORM for database operations and also integrates with the LRU cache to reduce database load.
    -   **`entities`**: TypeORM entity definitions that map to database tables.
    -   **`dtos`**: Data Transfer Objects define the shape of data coming into or going out of the application. They are used for request body validation and for defining clear response structures.

## Request Processing Flow

A typical request, such as fetching a list of products (`GET /products?page=1&limit=10`), flows through the application as follows:

1.  **Entry**: The request hits the NestJS server.
2.  **Middleware**: The `LoggerMiddleware` (configured in `app.module.ts`) intercepts the request and logs its details (method, URL, IP address).
3.  **Routing**: NestJS routes the request to the `getAllProducts` method in `ProductsController` based on the `@Get()` decorator.
4.  **Controller (`ProductsController`)**:
    -   The controller method receives the request.
    -   The `PaginationQueryDto` validates and transforms the `page` and `limit` query parameters.
    -   It calls the `execute()` method on the injected `GetAllProductsUseCase`, passing the pagination details.
5.  **Use Case (`GetAllProductsUseCase`)**:
    -   The use case contains the high-level logic. It calls the `findAll` method on the `ProductRepository`.
    -   Once it receives the data and total count from the repository, it wraps them in a `PaginationResponseDto` and returns it.
6.  **Repository (`ProductRepository`)**:
    -   The `findAll` method first generates a unique cache key for the specific query (e.g., `products:all:page=1:limit=10`).
    -   **Cache Hit**: It checks the `LRUCache` for this key. If the data exists, it is returned immediately, and the database is not queried.
    -   **Cache Miss**: If the data is not in the cache, it uses TypeORM to query the PostgreSQL database for the requested page of products.
    -   The result from the database is then stored in the cache using the generated key for subsequent requests.
    -   The data is returned to the use case.
7.  **Response**: The DTO returned from the use case is serialized into a JSON response and sent back to the client. The `LoggerMiddleware` logs the final status code and response time.

This layered architecture ensures that business logic is decoupled from the web framework and data access, making the application easier to maintain, test, and scale.
