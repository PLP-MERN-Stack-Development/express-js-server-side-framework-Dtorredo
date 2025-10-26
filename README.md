# Express.js RESTful API Assignment

This assignment focuses on building a RESTful API using Express.js, implementing proper routing, middleware, and error handling.

## Assignment Overview

This project implements a complete RESTful API for managing products with the following features:

1. ✅ Express.js server setup
2. ✅ RESTful API routes for product resource
3. ✅ Custom middleware for logging, authentication, and validation
4. ✅ Comprehensive error handling with custom error classes
5. ✅ Advanced features like filtering, pagination, and search

## Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd express-js-server-side-framework-Dtorredo
   ```

2. Install dependencies:

   ```bash
   npm install express body-parser uuid
   ```

3. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

4. Run the server:
   ```bash
   node server.js
   ```

The server will start on `http://localhost:3000`

## Files Included

- `Week2-Assignment.md`: Detailed assignment instructions
- `server.js`: Complete Express.js server implementation
- `.env.example`: Example environment variables file
- `README.md`: This documentation file

## Requirements

- Node.js (v18 or higher)
- npm or yarn
- Postman, Insomnia, or curl for API testing

## API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

Some endpoints require authentication via API key header:

```
x-api-key: demo-api-key-123
```

### Product Schema

```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean"
}
```

## API Endpoints

### 1. Get All Products

**GET** `/api/products`

Returns all products with optional filtering and pagination.

**Query Parameters:**

- `category` (optional): Filter by category
- `inStock` (optional): Filter by stock status (true/false)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**

```bash
curl http://localhost:3000/api/products?category=electronics&page=1&limit=5
```

**Example Response:**

```json
{
  "products": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalProducts": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### 2. Get Product by ID

**GET** `/api/products/:id`

Returns a specific product by its ID.

**Example Request:**

```bash
curl http://localhost:3000/api/products/1
```

**Example Response:**

```json
{
  "id": "1",
  "name": "Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "price": 1200,
  "category": "electronics",
  "inStock": true
}
```

### 3. Create New Product

**POST** `/api/products`

Creates a new product. Requires authentication.

**Headers:**

```
Content-Type: application/json
x-api-key: demo-api-key-123
```

**Example Request:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-api-key-123" \
  -d '{
    "name": "Gaming Mouse",
    "description": "High-precision gaming mouse with RGB lighting",
    "price": 75,
    "category": "electronics",
    "inStock": true
  }'
```

**Example Response:**

```json
{
  "message": "Product created successfully",
  "product": {
    "id": "generated-uuid",
    "name": "Gaming Mouse",
    "description": "High-precision gaming mouse with RGB lighting",
    "price": 75,
    "category": "electronics",
    "inStock": true
  }
}
```

### 4. Update Product

**PUT** `/api/products/:id`

Updates an existing product. Requires authentication.

**Headers:**

```
Content-Type: application/json
x-api-key: demo-api-key-123
```

**Example Request:**

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-api-key-123" \
  -d '{
    "name": "Updated Laptop",
    "description": "Updated description",
    "price": 1300,
    "category": "electronics",
    "inStock": false
  }'
```

### 5. Delete Product

**DELETE** `/api/products/:id`

Deletes a product. Requires authentication.

**Headers:**

```
x-api-key: demo-api-key-123
```

**Example Request:**

```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "x-api-key: demo-api-key-123"
```

### 6. Search Products

**GET** `/api/products/search`

Search products by name or description.

**Query Parameters:**

- `q` (required): Search query

**Example Request:**

```bash
curl http://localhost:3000/api/products/search?q=laptop
```

**Example Response:**

```json
{
  "query": "laptop",
  "results": [
    {
      "id": "1",
      "name": "Laptop",
      "description": "High-performance laptop with 16GB RAM",
      "price": 1200,
      "category": "electronics",
      "inStock": true
    }
  ],
  "count": 1
}
```

### 7. Get Product Statistics

**GET** `/api/products/stats`

Returns statistics about all products.

**Example Request:**

```bash
curl http://localhost:3000/api/products/stats
```

**Example Response:**

```json
{
  "totalProducts": 5,
  "inStock": 4,
  "outOfStock": 1,
  "categories": {
    "electronics": 3,
    "kitchen": 1,
    "furniture": 1
  },
  "averagePrice": 510,
  "priceRange": {
    "min": 50,
    "max": 1200
  }
}
```

## Error Handling

The API returns structured error responses with appropriate HTTP status codes:

### Error Response Format

```json
{
  "error": "Error Type",
  "message": "Error description",
  "statusCode": 400
}
```

### Common Error Codes

- `400` - Bad Request (Validation Error)
- `401` - Unauthorized (Authentication Error)
- `404` - Not Found
- `500` - Internal Server Error

### Example Error Response

```json
{
  "error": "Validation Error",
  "message": "Name is required and must be a non-empty string",
  "statusCode": 400
}
```

## Middleware Implementation

### 1. Logger Middleware

Logs all requests with timestamp, method, and URL.

### 2. Authentication Middleware

Validates API key for protected routes (POST, PUT, DELETE).

### 3. Validation Middleware

Validates product data for creation and updates.

### 4. Error Handling Middleware

Global error handler with custom error classes.

## Advanced Features

1. **Filtering**: Filter products by category and stock status
2. **Pagination**: Paginate results with configurable page size
3. **Search**: Search products by name or description
4. **Statistics**: Get comprehensive product statistics
5. **Custom Error Classes**: Structured error handling
6. **Request Logging**: Comprehensive request logging

## Testing the API

You can test the API using:

1. **curl** (command line)
2. **Postman** (GUI tool)
3. **Insomnia** (GUI tool)

### Quick Test Commands

```bash
# Get all products
curl http://localhost:3000/api/products

# Get product by ID
curl http://localhost:3000/api/products/1

# Search products
curl http://localhost:3000/api/products/search?q=electronics

# Get statistics
curl http://localhost:3000/api/products/stats

# Create product (requires API key)
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-api-key-123" \
  -d '{"name":"Test Product","description":"Test Description","price":100,"category":"test","inStock":true}'
```

## Submission

This project has been completed with all required features:

1. ✅ Complete RESTful API endpoints
2. ✅ Custom middleware implementation
3. ✅ Comprehensive error handling
4. ✅ Advanced features (filtering, pagination, search, statistics)
5. ✅ Complete API documentation
6. ✅ Environment configuration

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [RESTful API Design Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
