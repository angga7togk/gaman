# MyD.JS

**MyD.JS** is a backend project template built on **Express** and written in **TypeScript**, designed for simplicity and ease of use. This template provides a clean structure, useful decorators, and TypeScript support to help you quickly build scalable APIs.

## Features

- **Express Framework**: Lightweight and flexible Node.js framework for building APIs.
- **TypeScript Support**: Benefit from static typing and modern JavaScript features.
- **Decorators**: Simplify route definitions with intuitive decorators like , `@Get`, `@Post`, `@Delete`, etc.
- **Path Aliases**: Easily manage imports with custom aliases configured in `tsconfig.json`.
- **Clean Structure**: Organized folder structure for controllers, middlewares, and utilities.

## Installation

Clone the repository and install dependencies:

```bash
$ npx create-mydjs
```

## Usage

Start the development server:

```bash
npm run dev
```

## Add a Controller

1. Create a new controller file in the `src/controllers` directory, e.g., `user.controller.ts`.

```ts
import { MydRoute, Get, Post, MydController } from "myd/router";
import { Request, Response } from "express";

export class UserController extends MydController {
  constructor() {
    super("/user"); // Base Path
  }

  @Get("/") // path: `/user`
  getAllUsers(req: Request, res: Response) {
    res.send("Get all users");
  }

  @Post("/create") // path: `/user/create`
  createUser(req: Request, res: Response) {
    res.send("User created");
  }
}
```

2. Register the controller in `src/controllers.ts`;
```ts
import { UserController } from "./user.controller";

export default [UserController];
```

## Configuration
You can customize the project configuration using `myd.config.ts`:
```ts
// @ts-check
import { defineConfig } from "myd/config";

export default defineConfig({
  server: {
    port: 3431, // opsional
    host: "0.0.0.0", // opsional
  },
});
```

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve MyD.JS.

