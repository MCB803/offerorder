# Offer Order Route Search System

## Features
### Backend (Spring Boot)
- Flight route calculations with caching support
- **Concurrent processing for route search**
- Location and transportation management (Admin only)
- Authentication and authorization for admins and agencies
- Database support for **PostgreSQL, MySQL, MSSQL, and H2**
- RESTful API with **Swagger** documentation
- **Liquibase** for database migrations
- Dockerized deployment
- Backend validations enforced

### Frontend (React SPA)
- Responsive single-page application (SPA)
- Sidebar and header for easy navigation
- Flight route search with dropdowns for origin, destination, and trip date
- Route details displayed in a side panel
- Admin-only sections for location and transportation management

## Tech Stack
### Backend:
- **Java 21** (Spring Boot framework)
- **Hibernate ORM**
- **PostgreSQL / MySQL / MSSQL / H2** (database support)
- **Swagger** (API documentation)
- **Spring Security** (authentication & authorization)
- **Liquibase** (database migrations)
- **Docker** (containerization)

### Frontend:
- **React** (SPA architecture)
- **React Router** (navigation)
- **Axios** (API requests)
- **Tailwind CSS** (styling)

## Installation & Setup
## Docker Setup
1. Just run:
   ```bash
   docker-compose up --build
   ```

##If you want to set it up locally
### Backend:
1. Clone the offerorder repository:
   ```bash
   git clone https://github.com/MCB803/offerorder.git
   cd backend
   ```
2. Configure the database settings in `application.properties`.
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend:
1. Switch to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation
- The backend provides a **Swagger UI** at:
  ```
  http://localhost:8080/swagger-ui.html
  ```
- Detailed API documentation is available under `/api-docs`.

## Deployment
- The backend and frontend can be deployed as separate containers using Docker.
- Environment variables should be configured for production.


**Author:** Mert C Balci 
**GitHub:** [MCB803](https://github.com/MCB803)

