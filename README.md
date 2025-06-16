# GamanJS Framework Documentation

GamanJS is a minimalist JavaScript/TypeScript framework designed for modular and structured backend development. Inspired by the Japanese term "gamaninasai" (meaning "be patient"), GamanJS emphasizes clarity, modularity, and simplicity.

---

## Getting Started

### Installation

To install GamanJS, use your preferred package manager:

```bash
npm install gaman
```

### Main Entry Point (`main.ts`)

Below is an example of how to set up the main entry point for a GamanJS application:

```typescript
import app from "gaman";
import mainBlock from "./main.block";

app.serv({
  blocks: [mainBlock],
  server: {
    host: "0.0.0.0", // Optional
    port: 3431       // Optional
  }
});
```

### Explanation

* **`blocks`**: Defines the modular units of your application, enabling a structured and organized approach.
* **`server`**: Allows configuration of the server's host and port.

---

## Modular Blocks (`main.block.ts`)

Blocks are the primary way to define routes and middleware in GamanJS. Below is an example block:

```typescript
import apiTree from "./tree/api.tree";
import { Logger, defineBlock, Response } from "gaman";

export default defineBlock({
  path: "/", // Base path
  all: async (ctx, next) => {
    Logger.log("anu1");
    return next();
  },
  routes: {
    "*": {
      GET: async (ctx, next) => {
        Logger.log("anu2");
        return next();
      },
    },
    "/1": {
      POST: (ctx) => {
        new Response("Hahah", { status: 200 }).send();
      },
      "/2": {
        GET: (ctx) => {
          return Response.json({ no: 2 });
        },
        "/3": {
          GET: (ctx) => {
            return Response.json({ no: 3 });
          },
        },
      },
    },
    "/about/*": {
      POST: (ctx, next) => {
        Logger.log("about post middleware");
        next();
      },
    },
    "/about": (ctx, next) => {
      Logger.log("haha");
      next();
    },
    "/jir/about": {
      GET: () => {
        return Response.text("Berhasil si");
      },
    },
    "/api": apiTree,
  },
});
```

### Explanation

* **`path`**: The base path for all routes defined in the block.
* **`all`**: A global middleware that runs for all routes within this block.
* **`routes`**: Defines the routes and their corresponding HTTP methods (e.g., `GET`, `POST`).
* **Nested Routes**: Supports nested paths for deeper route structures.

---

## Tree Routing (`tree/api.tree.ts`)

GamanJS uses a "Tree Routing" concept for route organization. Here's an example:

```typescript
import { Response, defineTree } from "gaman";

export default defineTree({
  "/tes": {
    GET: () => Response.json({ Aduhai: "sda" }, {
      status: 200
    }),
  },
});
```

### Explanation

* **Tree Structure**: Routes are defined in a nested tree-like structure for simplicity and clarity.
* **Response**: Use built-in response utilities like `Response.json`, `Response.text`, or `Response` for flexible responses.

---

## Utilities

### Logger

The `Logger` utility is used for logging events, errors, and debugging information.

```typescript
Logger.log("This is a log message");
Logger.info("This is an info message");
Logger.debug("This is a debug message");
Logger.error("This is an error message");
```

### Response

The `Response` class provides utilities for sending HTTP responses.

#### Examples:

* **Send Plain Text:**

  ```typescript
  Response.text("Hello World").send();
  ```

* **Send JSON:**

  ```typescript
  Response.json({ success: true }, { status: 200 }).send();
  ```

* **Send Custom Response:**

  ```typescript
  new Response("Custom Message", { status: 201 }).send();
  ```

---

## Running the Application

To start your GamanJS application, use the following command:

```bash
buat cli sendiri blom gw buatin bisa bun main.ts atau tsx main.ts :V
```

Ensure you have built your project using a bundler like `esbuild` or `tsc` before running.

---

## Philosophy

GamanJS aims to provide a lightweight, modular, and intuitive framework for building Node.js backend applications. Its "Tree Routing" concept allows developers to structure their routes in a nested and readable manner, making the codebase maintainable and scalable.
