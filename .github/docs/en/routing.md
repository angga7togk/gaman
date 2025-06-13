# Tree Route Documentation

The `Tree Route` concept provides a structured and intuitive way to define routes in your backend application. This documentation explains the key features and usage of the `Tree Route` system in your framework.

---

## Overview

In the `Tree Route` system, routes are defined in a hierarchical structure under the `routes:` section. Each route can include methods (e.g., `GET`, `POST`, `DELETE`), subroutes, and even middleware specific to a single method or route. This allows for highly modular and maintainable route definitions.

## Base Path

The `path:` field specifies the base path for the routes defined in the `routes:` section. It acts as the root for all nested routes.

### Example:

```ts
import { defineBlock } from "mydlib";
import express from "express";

export default defineBlock({
  path: "/", // base path,
  routes: {}
});
```

In this example, the base path is `/`, so all routes will be accessible relative to the root path.

---

## Defining Routes

Routes are defined under the `routes:` key as a JavaScript object. The structure allows you to specify HTTP methods, middleware, and nested routes.

### Basic Structure:

```ts
routes: {
  "<route>": {
    "<HTTP_METHOD>": <handler>,
    "<subroute>": { ... },
  },
}
```

---

## Examples

### Simple Routes

```ts
routes: {
  "/": async (req, res) => {
    res.json({ message: "❤️ Welcome to MyD.JS" });
  },
}
```

This defines a simple route that responds to all requests to `/` with a JSON message.

### Parameterized Routes

```ts
routes: {
  "/user/:id": {
    GET: async (req, res) => {
      res.json({ message: "User ID" });
    },
  },
}
```

In this example, `/user/:id` defines a route with a parameter `:id`. The `GET` method responds with a message.

### Middleware for Specific Methods

Middleware can be added to specific methods in a route. Middleware is executed in order.

```ts
routes: {
  "/user/:id": {
    POST: [
      express.json(), // Middleware for parsing JSON
      (req, res) => {
        res.json(req.body); // Return the parsed JSON body
      },
    ],
  },
}
```

### Nested Routes

Routes can be nested for better organization and clarity.

```ts
routes: {
  "/user/:id": {
    "/detail": {
      POST: (req, res) => {
        res.json({ message: req.params.id }); // Access the `id` parameter from parent route
      },
    },
  },
}
```

### Route with Multiple Middlewares

You can define multiple middleware functions for a single route and method.

```ts
routes: {
  "/user/delete": {
    DELETE: [
      (req, res, next) => {
        console.log("middleware ...");
        next(); // Proceed to the next middleware or handler
      },
      (req, res) => {
        res.json({ message: "Deleted!" });
      },
    ],
  },
}
```

---

## Key Features

* **Modularity:** Define routes and middleware in a hierarchical, modular format.
* **Middleware Support:** Apply middleware to specific methods or entire routes.
* **Nested Routes:** Organize routes in a tree-like structure for clarity.
* **Parameterized Routes:** Use dynamic segments in route paths for flexible endpoints.

---

## Best Practices

* **Use Middleware Wisely:** Apply middleware only to the routes or methods that need it.
* **Organize Nested Routes:** Use nesting to group related routes and maintain a clean structure.
* **Leverage Dynamic Parameters:** Utilize parameterized routes for endpoints with variable data.
* **Keep Handlers Simple:** Write concise and focused request handlers for better readability and maintainability.

---

## Conclusion

The `Tree Route` concept simplifies route management by combining flexibility, modularity, and clarity. By using this structure, you can create scalable and maintainable APIs effortlessly.
