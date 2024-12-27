<p align="center">
  <a href="" rel="noopener">
    <img width="200px" height="200px" src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo">
  </a>
</p>

<h3 align="center">Movie Lobby API</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center">
  A RESTful API for managing a movie catalog with caching capabilities.
</p>

## 📝 Table of Contents

- [About the Project](#about)
- [Getting Started](#getting-started)
- [Running Tests](#tests)
- [API Endpoints](#endpoints)
- [Technologies Used](#technologies)
- [Authors](#authors)
- [License](#license)

## 🧐 About the Project <a name="about"></a>

Movie Lobby is a RESTful API built with AdonisJS to manage a movie catalog. It features CRUD operations, search functionality with caching, and administrative routes protected by authentication.

**Key Features**:
- Full CRUD for movies
- Integrated caching for searches
- Admin-protected routes
- MongoDB integration
- Unit and functional tests

## 🏁 Getting Started <a name="getting-started"></a>

This guide will help you set up the project locally for development and testing.

### Prerequisites

- [Node.js (version 14 or higher)](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- npm or yarn

### Environment Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/movie-lobby.git
   cd movie-lobby
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file** in the project's root directory with the following variables:

   ```env
   PORT=3333
   HOST=0.0.0.0
   NODE_ENV=development
   APP_KEY=your-secret-key
   DRIVE_DISK=local
   MONGODB_URL=mongodb://localhost:27017
   MONGODB_DATABASE=movie-lobby
   MONGODB_CONNECTION=mongodb
   ADMIN_KEY=your-admin-key
   ```

### Running the Application

- **Development mode** (hot reload):

  ```bash
  npm run dev
  # or
  yarn dev
  ```

- **Production build**:

  ```bash
  npm run build
  npm start
  # or
  yarn build
  yarn start
  ```

## 🔧 Running Tests <a name="tests"></a>

This project includes unit and functional tests.

### Prerequisites before running tests

1. **Ensure MongoDB is running**
   ```bash
   # Start MongoDB container if not already running
   docker run -d -p 27017:27017 --name mongodb mongo:6.0
   
   # Verify MongoDB container is running
   docker ps
   ```

2. **Start the application in development mode**
   ```bash
   # This step is necessary to initialize the cache
   npm run dev
   # or
   yarn dev
   ```

3. **Wait a few seconds for the application to fully initialize**

### Running the tests

- **Run all tests**:
  ```bash
  npm test
  # or
  yarn test
  ```

- **Run specific tests**:
  ```bash
  # Unit tests
  npm run test:unit

  # Functional tests
  npm run test:functional
  ```

> **Note**: The tests rely on both a running MongoDB instance and initialized cache. Make sure to complete the prerequisites before running the tests to avoid false negatives, especially in cache-related tests.

## 📡 API Endpoints <a name="endpoints"></a>

| Method | Endpoint                | Description                                | Authentication |
|--------|-------------------------|--------------------------------------------|----------------|
| GET    | `/movies`              | List all movies                            | No             |
| GET    | `/movies/search?q=...` | Search for movies based on a query string  | No             |
| POST   | `/movies`              | Create a new movie                         | Yes            |
| PUT    | `/movies/:id`          | Update an existing movie                   | Yes            |
| DELETE | `/movies/:id`          | Remove a movie                             | Yes            |

### Authentication

Protected routes require the `admin-key` header with the value set in the `ADMIN_KEY` environment variable.

**Example**:

```bash
curl -X POST \
  -H "admin-key: your-admin-key" \
  -H "Content-Type: application/json" \
  -d '{"title":"Movie Title","genre":"Action","rating":8.5,"streamingLink":"https://example.com"}' \
  http://localhost:3333/movies
```

## ⛏️ Technologies Used <a name="technologies"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [AdonisJS](https://adonisjs.com/) - Server Framework
- [Node.js](https://nodejs.org/) - Runtime Environment
- [TypeScript](https://www.typescriptlang.org/) - Programming Language

## ✍️ Authors <a name="authors"></a>

- [@tukpedro](https://github.com/tukpedro) - Initial Author

## 📝 License <a name="license"></a>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

