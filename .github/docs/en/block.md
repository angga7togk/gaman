# MydBlock Documentation

MydBlock is similar to a module, but with a unique identity to set it apart from other implementations. This documentation explains how to create and register a block in your MyD application.

---

## 1. Create the Block

To define a new block, create a file (e.g., `user.block.ts`) and use the `defineBlock` function to specify its configuration.

### Example:

```ts
import { defineBlock } from "myd";

export default defineBlock({
  path: '/user' // base path
});
```

In this example, a block is created with the base path `/user`. This path acts as the root for all routes and functionalities defined within the block.

---

## 2. Register the Block

After defining a block, it needs to be registered in the main application file (e.g., `main.ts`) within the `App` function.

### Example:

```ts
import mainBlock from "main.block";
import App from "myd";

const app = App({
  blocks: [mainBlock], // register your block here
});

export default app;
```

Here, the `mainBlock` is imported and registered in the `blocks` array. This makes the block available as part of the application.

---

## Key Concepts

### What is a Block?

A block is a modular component of your application, encapsulating specific functionality or routes. Blocks allow for better organization and scalability by breaking down your application into manageable parts.

### Why Use Blocks?

* **Modularity:** Each block operates independently, making it easier to develop and maintain.
* **Reusability:** Blocks can be reused across different applications or projects.
* **Organization:** Blocks help structure the application logically, especially in large projects.

---

## Best Practices

* **Use Descriptive Names:** Name your blocks according to their functionality (e.g., `user.block.ts` for user-related functionality).
* **Keep Blocks Focused:** Each block should handle a specific aspect of the application.
* **Document Your Blocks:** Include comments and documentation within your block files for clarity and ease of use.

---

By following these guidelines, you can efficiently create and manage blocks in your MyD application, ensuring a clean and scalable architecture.
