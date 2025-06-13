# `pre(app)` Function Documentation

The `pre(app)` function is a lifecycle hook in the MyD framework, designed to execute custom logic before the server starts listening for incoming requests. This hook allows you to configure the application, set up middleware, initialize resources, or perform any other pre-listening tasks.

---

## Purpose

The `pre(app)` function provides a centralized place to:

* Register global middleware.
* Set up database connections.
* Configure application-level settings.
* Perform logging or debugging tasks.
* Initialize third-party services or integrations.

By executing this logic before the server starts, you ensure the application is fully prepared to handle incoming requests.

---

## How to Use `pre(app)`

You can define the `pre(app)` function in the `App` configuration object in your `main.ts` file.

### Example:

```ts
import mainBlock from "main.block";
import express from "express";
import myd from "mydlib";

myd.serve({
  blocks: [mainBlock],
  pre: (app) => {
    // Example: Register a global middleware
    app.use(express.json());

    // Example: Log a message during initialization
    console.log("Pre-listening setup complete.");

    // Example: Simulate resource initialization
    initializeDatabaseConnection();
  },
});

function initializeDatabaseConnection() {
  console.log("Database connected!");
}
```

In this example:

* `express.json()` is registered as a global middleware.
* A message is logged to indicate that the pre-listening setup is complete.
* A database connection is simulated with the `initializeDatabaseConnection` function.

---

## When `pre(app)` Runs

The `pre(app)` function is executed immediately after the application instance is created but before the server starts listening for incoming requests. This ensures all configurations and initializations are complete prior to handling traffic.

---
