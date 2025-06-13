# Middleware Documentation

Middleware in MyD is a powerful feature that allows you to process requests and responses at various stages of the application's lifecycle. This documentation covers how to define and use middleware within the MyD framework.

---

## 1. What is Middleware?

Middleware functions are executed sequentially during the request-response cycle. They can:

* Modify the `req` and `res` objects.
* End the request-response cycle.
* Call the `next()` function to pass control to the next middleware or handler.

Middleware can be applied globally, per block, or per route and method.

---

## 2. Using Middleware in Blocks

You can define middleware at the block level using the `middlewares:` key. Middleware defined here applies to all routes within the block.

### Example:

```ts
import { defineBlock } from "mydlib";
import express from "express";

export default defineBlock({
  path: "/", // base path
  middlewares: [
    express.urlencoded(), // Parses URL-encoded bodies
    (req, res, next) => {
      console.log("Middleware for all routes in the block");
      next(); // Pass control to the next middleware or route handler
    },
  ],
});
```

Here, `express.urlencoded()` and a custom middleware function are applied to all routes within the block.

---

## 3. Using Middleware for Specific Routes or Methods

Middleware can also be applied to individual routes or HTTP methods. This provides fine-grained control over when middleware is executed.

### Example:

```ts
routes: {
  "/user": {
    GET: [
      (req, res, next) => {
        console.log("Middleware for GET /user");
        next();
      },
      (req, res) => {
        res.json({ message: "User fetched successfully!" });
      },
    ],
    POST: [
      express.json(), // Parses JSON bodies
      (req, res) => {
        res.json(req.body);
      },
    ],
  },
}
```

In this example:

* A custom middleware logs requests to `GET /user`.
* The `POST /user` route uses `express.json()` middleware to parse JSON bodies.

---

## 4. Types of Middleware

### Built-in Middleware

You can use middleware provided by Express or other libraries, such as:

* `express.json()` - Parses incoming requests with JSON payloads.
* `express.urlencoded()` - Parses URL-encoded bodies.

### Custom Middleware

You can define your own middleware functions to handle specific tasks.

#### Example:

```ts
(req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
}
```

This middleware checks for an `Authorization` header and denies access if it's missing.

---

## 5. Best Practices

* **Keep Middleware Simple:** Write middleware functions that focus on a single responsibility.
* **Order Matters:** Middleware is executed in the order it is defined. Ensure middleware that modifies the request or response comes before handlers that rely on those modifications.
* **Use Libraries:** Leverage existing middleware libraries whenever possible to save time and reduce complexity.
* **Handle Errors Gracefully:** Use error-handling middleware to catch and process errors.

---

By understanding and applying middleware effectively, you can create a robust and modular application architecture using MyD.
