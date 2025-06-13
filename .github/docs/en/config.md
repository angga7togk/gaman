# Configuration Documentation

The `config` property in the MyD framework allows you to customize server settings and other application configurations. This simple structure helps you define essential server parameters, such as the host and port, in a clear and straightforward way.

---

## Overview

The `config` object is used to define settings for your application. It is included in the `App` configuration when initializing the application.

### Example:

```ts
myd.serve({
  config: {
    server: {
      host: "0.0.0.0",
      port: 3431,
    },
  },
});

```

---

## `config.server` Properties

### 1. `host`

* **Type:** `string`
* **Description:** Specifies the host address on which the server will run.
* **Default Value:** `'127.0.0.1'`
* **Example:** `'0.0.0.0'` (binds to all available network interfaces)

### 2. `port`

* **Type:** `number`
* **Description:** Specifies the port on which the server will listen for incoming requests.
* **Default Value:** `3431`
* **Example:** `3331`

---

## Customization Example

### Default Configuration

If no `config` object is provided, the server will use the default settings:

```ts
config: {
  server: {
    host: '127.0.0.1',
    port: 3000
  }
}
```

### Custom Configuration

You can override the defaults with your own values:

```ts
config: {
  server: {
    host: '0.0.0.0',
    port: 8080
  }
}
```

---

## Best Practices

* **Set `host` to `0.0.0.0`** if you want your application to be accessible from other devices in the network.
* **Use environment variables** for dynamic configuration in different environments (e.g., development, staging, production).
* **Choose non-conflicting ports** to avoid issues with other running applications.

---

By leveraging the `config` property, you can easily tailor the server behavior to meet your application's needs.
