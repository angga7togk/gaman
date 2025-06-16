# `onListen(app, error)` Function Documentation

The `onListen(app, error)` function is a lifecycle hook in the Gamman framework that is executed after the server begins listening for incoming requests. It provides a mechanism to handle post-listening events, such as logging, error handling, or additional setup tasks.

---

## Purpose

The `onListen(app, error)` function is intended for tasks that need to occur after the server starts listening, such as:

* Logging server startup information.
* Handling errors that occurred during the listening process.
* Running health checks or warm-up routines.
* Announcing server readiness.

---

## Parameters

* **`app`**: The application instance, giving access to the initialized server.
* **`error`**: An error object, if an error occurred during server startup. This will be `undefined` if no errors occurred.

---

## How to Use `onListen`

You can define the `onListen` function in the `App` configuration object in your `main.ts` file.

### Example:

```ts
import mainBlock from "main.block";
import myd from "mydlib";

myd.serve({
  blocks: [mainBlock],
  onListen: (app, error) => {
    if (error) {
      console.error("Failed to start the server:", error);
      process.exit(1); // Exit the process with an error code
    }

    const address = app.server?.address();
    if (address) {
      console.log(`Server is running at http://${address.address}:${address.port}`);
    }

    console.log("Server is ready to handle requests.");
  },
});
```

In this example:

* If an error occurs, it is logged, and the process exits.
* If the server starts successfully, its address and port are logged.
* A readiness message is printed to the console.

---

