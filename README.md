# MyD.JS

Myd.JS is a lightweight, modular backend framework built on top of Express.js, designed to simplify development with Javascript. It introduces a Tree Routing concept for better route management and a highly modular structure.

---

## Features

- **Express-Based:** Leverages the robustness and simplicity of Express.js.
- **Modular Design:** Organize your backend into blocks for better maintainability.
- **Tree Routing:** Define routes hierarchically for clarity and ease.
- **Simple CLI Tool:** Start your project with a single command: `npx create-mydjs`.

---

## Current Language Support

| Language       | Status   |
| -------------- | -------- |
| **TypeScript** | ✅ Ready |
| **JavaScript** | ✅ Ready |

---

## Getting Started

### Installation

```bash
npx create-mydjs
```

This command will generate a new MyD.JS project with all the necessary setup.

### Documentation

Refer to the following documentation for detailed guides: [Documentations](https://github.com/7TogkID/mydjs/wiki)

### Highlight: `main.ts`

```ts
import mainBlock from "main.block";
import myd from "mydlib";

myd.serve({
  blocks: [mainBlock],
  config: {
    server: {
      host: "0.0.0.0",
      port: 3431,
    },
  },
});
```

### Highlight: `main.block.ts`

```ts
import { defineBlock } from "mydlib";
import express from "express";

export default defineBlock({
  path: "/", // base path
  middlewares: [express.urlencoded()], // similar to express.use()
  routes: {
    "/": async (req, res) => {
      res.json({ message: "❤️ Welcome to MyD.JS" });
    },

    "/article/:id": {
      GET: (req, res) => {
        res.json({ message: "Article ID" });
      },
      POST: [
        express.json(), // middleware for one route and one method

        (req, res) => {
          res.json(req.body /**return JSON */);
        },
      ],
      "/detail": {
        GET: (req, res) => {
          res.json({ message: req.params.id /** $ID from "/user/:id" */ });
        },
      },
    },
  },
});
```

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the framework.

---

## License

This project is licensed under the MIT License.
