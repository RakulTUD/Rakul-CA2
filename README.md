# Recipe Management Application

This is a full-stack application for managing recipes, built with Spring Boot (backend) and Node.js (frontend).

## Prerequisites

- Docker and Docker Compose
- Java 17 or higher
- Node.js 18 or higher

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Set up environment variables:
   - Copy `.env.template` to `.env`:
   ```bash
   cp .env.template .env
   ```
   - Edit `.env` and fill in your MongoDB credentials:
   ```
   MONGO_INITDB_ROOT_USERNAME=your_mongo_username
   MONGO_INITDB_ROOT_PASSWORD=your_mongo_password
   MONGO_DATABASE=your_database_name
   MONGO_COLLECTION=your_collection_name
   ME_CONFIG_MONGODB_ADMINUSERNAME=your_mongo_express_username
   ME_CONFIG_MONGODB_ADMINPASSWORD=your_mongo_express_password
   ME_CONFIG_BASICAUTH_USERNAME=your_mongo_express_basic_auth_username
   ME_CONFIG_BASICAUTH_PASSWORD=your_mongo_express_basic_auth_password
   ```

3. Start the application:
```bash
docker-compose up --build -d
```

4. Access the services:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8081
   - Mongo Express: http://localhost:8082

## Security Notes

- Never commit the `.env` file to version control
- Use strong, unique passwords for all credentials
- Change default credentials before deploying to production
- Consider using a secrets management service in production

## Development

- Backend: Spring Boot application in `backend-ca2/`
- Frontend: Node.js application in `frontend-ca2/`

## Testing

To run tests, ensure you have the test properties configured in `src/test/resources/test.properties`.

## License

[Your License Here] 