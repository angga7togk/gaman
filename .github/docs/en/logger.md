# Logger Documentation

The `Logger` utility in the MyD framework provides a simple and consistent way to log messages at various levels of severity. By leveraging `chalk`, it ensures that logs are color-coded for better readability.

---

## Overview

The `Logger` object includes several methods for logging different types of messages, such as informational logs, debugging messages, and errors. Each method prefixes the log with a tag indicating its level.

### Importing Logger

```ts
import { Logger } from "mydlib";
```

---

## Methods

### 1. `log(message: any)`

* **Alias for**: `Logger.info`
* **Purpose**: Logs a general informational message.
* **Example:**

  ```ts
  Logger.log("Application started successfully.");
  // Output: [INFO] Application started successfully.
  ```

### 2. `info(message: any)`

* **Description**: Logs an informational message with a blue `[INFO]` prefix.
* **Example:**

  ```ts
  Logger.info("Server is running on port 3000.");
  // Output: [INFO] Server is running on port 3000.
  ```

### 3. `debug(message: any)`

* **Description**: Logs a debugging message with a green `[DEBUG]` prefix.
* **Example:**

  ```ts
  Logger.debug("Database connection pool initialized.");
  // Output: [DEBUG] Database connection pool initialized.
  ```

### 4. `error(message: any)`

* **Description**: Logs an error message with a red `[ERROR]` prefix.
* **Example:**

  ```ts
  Logger.error("Failed to connect to the database.");
  // Output: [ERROR] Failed to connect to the database.
  ```

---

---

## Best Practices

1. **Use `info` for general information:**
   Use the `info` method for messages that indicate the normal flow of the application, such as startup messages or routine operations.

2. **Use `debug` for detailed logs:**
   Use `debug` for messages that help in diagnosing issues or understanding application behavior during development.

3. **Use `error` for critical issues:**
   Log errors with the `error` method to make them stand out in the console.

4. **Avoid overusing `debug` in production:**
   Excessive debug messages can clutter logs. Ensure debug logs are disabled or minimized in production environments.

---

By using the `Logger` utility, you can maintain consistent and readable logs across your application, making it easier to monitor and debug.
