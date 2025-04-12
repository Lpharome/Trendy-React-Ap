import React, { createContext, useReducer, useEffect } from 'react';
import axios from '../services/api'; // Axios instance for backend

export const AppContext = createContext();

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null, // Load user from localStorage
    wishlist: [],
    cart: [],
    searchQuery: '',
    selectedCategory : null,
};

const appReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            localStorage.setItem('user', JSON.stringify(action.payload)); // Save user to localStorage
            return { ...state, user: action.payload };
            
        case 'SET_SELECTED_CATEGORY': // ✅ NEW: Updates category globally
            return { ...state, selectedCategory: action.payload };
            
        case 'UPDATE_PROFILE':
            const updatedUser = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Save updated user
            return { ...state, user: updatedUser };
            
        case 'LOGOUT':
            localStorage.removeItem('user'); // Remove from localStorage
            localStorage.removeItem('authToken'); // Remove auth token
            return { ...state, user: null };
            
        case 'SET_WISHLIST':
            return { ...state, wishlist: action.payload };
            
        case 'ADD_TO_WISHLIST':
            return { ...state, wishlist: [...state.wishlist, action.payload] };
            
        case 'REMOVE_FROM_WISHLIST':
            return {
                ...state,
                wishlist: state.wishlist.filter((item) => item.id !== action.payload),
            };
            
        case 'SET_CART':
            return { ...state, cart: action.payload };
            
        case 'ADD_TO_CART':
            return { ...state, cart: [...state.cart, action.payload] };
            
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter((item) => item.id !== action.payload),
            };
            
        case 'CLEAR_CART':
            return { ...state, cart: [] };
            
        case 'UPDATE_CART_ITEM_QUANTITY':
            return {
                ...state,
                cart: state.cart.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
            
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load user profile on app start
    useEffect(() => {
        if (state.user) {
            fetchUserProfile();
        }
    }, []);

    // Register user
    const registerUser = async (data) => {
        try {
            const response = await axios.post('/users/register', data);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
    
            // Fetch user profile immediately after signup
            fetchUserProfile();
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };
    
    // Login user
    const loginUser = async (data) => {
        try {
            const response = await axios.post('/users/login', data);
            const token = response.data.token;
            localStorage.setItem('authToken', token);
            fetchUserProfile();
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
            alert(`Login Error: ${error.response?.data?.message || "Server error"}`);
        }
    };
    
    // Logout user
    const logoutUser = () => {
        dispatch({ type: 'LOGOUT' });
    };

    // Fetch user profile
    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('/users/profile');
            console.log("Fetched User Data:", response.data); // Debugging
            dispatch({ type: 'SET_USER', payload: response.data });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    };
    

    // Update user profile (including avatar)
    const updateUserProfile = async (profileData) => {
        try {
            const response = await axios.put('/users/profile', profileData);
            dispatch({ type: 'UPDATE_PROFILE', payload: response.data });
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    // Add to wishlist
    const addToWishlist = async (item) => {
        try {
            const response = await axios.post('/users/wishlist', item);
            dispatch({ type: 'ADD_TO_WISHLIST', payload: response.data });
        } catch (error) {
            console.error('Failed to add to wishlist:', error);
        }
    };

    // Remove from wishlist
    const removeFromWishlist = async (id) => {
        try {
            await axios.delete(`/users/wishlist/${id}`);
            dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: id });
        } catch (error) {
            console.error('Failed to remove from wishlist:', error);
        }
    };

    // Fetch cart from backend
    const fetchCart = async () => {
        try {
            const response = await axios.get('/cart');
            dispatch({ type: 'SET_CART', payload: response.data });
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    // Add item to cart
    const addToCart = (product) => {
        dispatch({
            type: "ADD_TO_CART",
            payload: product,
        });
    };

    // Remove item from cart
    const removeFromCart = async (id) => {
        try {
            await axios.delete(`/cart/${id}`);
            dispatch({ type: 'REMOVE_FROM_CART', payload: id });
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    };

    // Update cart item quantity
    const updateCartItemQuantity = (id, quantity) => {
        dispatch({
            type: "UPDATE_CART_ITEM_QUANTITY",
            payload: { id, quantity },
        });
    };

    return (
        <AppContext.Provider
            value={{
                state,
                dispatch,
                registerUser,
                loginUser,
                logoutUser,
                fetchUserProfile,
                updateUserProfile,
                addToWishlist,
                removeFromWishlist,
                fetchCart,
                addToCart,
                removeFromCart,
                updateCartItemQuantity,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

