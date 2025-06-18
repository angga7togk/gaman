import { GamanRequest } from "./request";

  export class RequestError extends Error {
  
    constructor(message: string, public request: GamanRequest, options?: ErrorOptions){
      super(message, options)
    }
  }