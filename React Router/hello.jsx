import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

// A simple component to render
const HelloWorldComponent = () => {
  return <h1>Hello World!</h1>;
};

// Define the routes
const router = createBrowserRouter([
  {
    path: "/", // The root URL path
    element: <HelloWorldComponent />, // The component to render for this path
  },
]);

// Render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
