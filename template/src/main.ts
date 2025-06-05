import App from "myd/app";
import express from "express";

const app = App({
  middlewares: [express.json(), express.urlencoded()], // similar to express.use()
  pre(app){
    // Enter the code before the server is running.
    console.log("process app before listen.")
  },
  onListen(app, error) {
    // Enter the code before the server is running
    console.log("listen...")
  },
});
