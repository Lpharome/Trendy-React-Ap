import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import AdminRoutes from './routes/AdminRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header/Header';
import ErrorBoundary from './routes/ErrorBoundary';

const App = () => {
    return (
        <Router>  {/* Router should wrap everything */}
            <AuthProvider> {/* Move AuthProvider inside Router */}
                <Header adminProfile />
                <ProductProvider>
                    <ErrorBoundary>
                        <NotificationProvider>
                            <ToastContainer />
                            <AdminRoutes />
                        </NotificationProvider>
                    </ErrorBoundary>
                </ProductProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
