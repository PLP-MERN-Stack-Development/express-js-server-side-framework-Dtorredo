// server.js - Complete Express server for Week 2 assignment

// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: "1",
    name: "Laptop",
    description: "High-performance laptop with 16GB RAM",
    price: 1200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "2",
    name: "Smartphone",
    description: "Latest model with 128GB storage",
    price: 800,
    category: "electronics",
    inStock: true,
  },
  {
    id: "3",
    name: "Coffee Maker",
    description: "Programmable coffee maker with timer",
    price: 50,
    category: "kitchen",
    inStock: false,
  },
  {
    id: "4",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones",
    price: 200,
    category: "electronics",
    inStock: true,
  },
  {
    id: "5",
    name: "Desk Chair",
    description: "Ergonomic office chair with lumbar support",
    price: 300,
    category: "furniture",
    inStock: true,
  },
];

// Custom Error Classes
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "AuthenticationError";
    this.statusCode = 401;
  }
}

// Custom Middleware

// 1. Logger Middleware
const loggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// 2. Authentication Middleware
const authMiddleware = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  // For demo purposes, accept 'demo-api-key-123' as valid
  if (!apiKey || apiKey !== "demo-api-key-123") {
    return next(
      new AuthenticationError(
        "Invalid or missing API key. Please provide a valid x-api-key header."
      )
    );
  }

  next();
};

// 3. Product Validation Middleware
const validateProduct = (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return next(
      new ValidationError("Name is required and must be a non-empty string")
    );
  }

  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length === 0
  ) {
    return next(
      new ValidationError(
        "Description is required and must be a non-empty string"
      )
    );
  }

  if (typeof price !== "number" || price < 0) {
    return next(
      new ValidationError("Price is required and must be a positive number")
    );
  }

  if (
    !category ||
    typeof category !== "string" ||
    category.trim().length === 0
  ) {
    return next(
      new ValidationError("Category is required and must be a non-empty string")
    );
  }

  if (typeof inStock !== "boolean") {
    return next(
      new ValidationError("inStock is required and must be a boolean")
    );
  }

  next();
};

// 4. Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: "Not Found",
      message: err.message,
      statusCode: 404,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: "Validation Error",
      message: err.message,
      statusCode: 400,
    });
  }

  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      error: "Authentication Error",
      message: err.message,
      statusCode: 401,
    });
  }

  // Default error
  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong!",
    statusCode: 500,
  });
};

// Apply middleware
app.use(loggerMiddleware);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Product API!",
    endpoints: {
      "GET /api/products": "Get all products",
      "GET /api/products/:id": "Get a specific product",
      "POST /api/products": "Create a new product",
      "PUT /api/products/:id": "Update a product",
      "DELETE /api/products/:id": "Delete a product",
      "GET /api/products/search?q=query": "Search products by name",
      "GET /api/products/stats": "Get product statistics",
    },
  });
});

// RESTful API Routes

// GET /api/products - Get all products with filtering and pagination
app.get("/api/products", (req, res, next) => {
  try {
    let filteredProducts = [...products];

    // Filter by category
    if (req.query.category) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === req.query.category.toLowerCase()
      );
    }

    // Filter by inStock
    if (req.query.inStock !== undefined) {
      const inStock = req.query.inStock === "true";
      filteredProducts = filteredProducts.filter(
        (product) => product.inStock === inStock
      );
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredProducts.length / limit),
        totalProducts: filteredProducts.length,
        hasNextPage: endIndex < filteredProducts.length,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Advanced Features (must come before /:id route)

// GET /api/products/search?q=query - Search products by name
app.get("/api/products/search", (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      throw new ValidationError('Search query parameter "q" is required');
    }

    const searchResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    res.json({
      query,
      results: searchResults,
      count: searchResults.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/stats - Get product statistics
app.get("/api/products/stats", (req, res, next) => {
  try {
    const stats = {
      totalProducts: products.length,
      inStock: products.filter((p) => p.inStock).length,
      outOfStock: products.filter((p) => !p.inStock).length,
      categories: {},
      averagePrice: 0,
      priceRange: {
        min: 0,
        max: 0,
      },
    };

    // Calculate category counts
    products.forEach((product) => {
      stats.categories[product.category] =
        (stats.categories[product.category] || 0) + 1;
    });

    // Calculate average price and price range
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      stats.averagePrice =
        prices.reduce((sum, price) => sum + price, 0) / prices.length;
      stats.priceRange.min = Math.min(...prices);
      stats.priceRange.max = Math.max(...prices);
    }

    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Get a specific product
app.get("/api/products/:id", (req, res, next) => {
  try {
    const product = products.find((p) => p.id === req.params.id);

    if (!product) {
      throw new NotFoundError(`Product with ID ${req.params.id} not found`);
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product
app.post("/api/products", authMiddleware, validateProduct, (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    const newProduct = {
      id: uuidv4(),
      name: name.trim(),
      description: description.trim(),
      price,
      category: category.trim(),
      inStock,
    };

    products.push(newProduct);

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Update a product
app.put(
  "/api/products/:id",
  authMiddleware,
  validateProduct,
  (req, res, next) => {
    try {
      const productIndex = products.findIndex((p) => p.id === req.params.id);

      if (productIndex === -1) {
        throw new NotFoundError(`Product with ID ${req.params.id} not found`);
      }

      const { name, description, price, category, inStock } = req.body;

      products[productIndex] = {
        ...products[productIndex],
        name: name.trim(),
        description: description.trim(),
        price,
        category: category.trim(),
        inStock,
      };

      res.json({
        message: "Product updated successfully",
        product: products[productIndex],
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/products/:id - Delete a product
app.delete("/api/products/:id", authMiddleware, (req, res, next) => {
  try {
    const productIndex = products.findIndex((p) => p.id === req.params.id);

    if (productIndex === -1) {
      throw new NotFoundError(`Product with ID ${req.params.id} not found`);
    }

    const deletedProduct = products.splice(productIndex, 1)[0];

    res.json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
    statusCode: 404,
  });
});

// Apply error handling middleware (must be last)
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("- GET /api/products (with filtering and pagination)");
  console.log("- GET /api/products/:id");
  console.log("- POST /api/products (requires x-api-key header)");
  console.log("- PUT /api/products/:id (requires x-api-key header)");
  console.log("- DELETE /api/products/:id (requires x-api-key header)");
  console.log("- GET /api/products/search?q=query");
  console.log("- GET /api/products/stats");
});

// Export the app for testing purposes
module.exports = app;
