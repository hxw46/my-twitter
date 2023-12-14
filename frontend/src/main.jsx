import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Pages
import FeedPage from './pages/FeedPage';
import UserProfilePage from './pages/UserProfilePage';
import LoginPage from './pages/LoginPage';
import CreateUserPage from './pages/CreateUserPage';

// Router configuration
const routes = [
  { path: '/profile/:userId', element: <UserProfilePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <CreateUserPage /> },
  { path: '/', element: <FeedPage /> },
];

const router = createBrowserRouter(routes);

// App component
const App = () => (
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// Rendering the app
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
