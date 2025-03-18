// Import necessary polyfills for Jest test environment
import { TextEncoder, TextDecoder } from "util";
import fetch, { Headers, Request, Response } from "node-fetch";
import "@testing-library/jest-dom"; // Provides extended matchers for Jest

// Ensure `TextEncoder` and `TextDecoder` are available in global scope
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

// Make `fetch` available globally in Jest tests
global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;

// Mock implementation of `BroadcastChannel` to prevent errors in Jest
global.BroadcastChannel = class {
  postMessage() {} // Mock method
  close() {} // Mock method
};
