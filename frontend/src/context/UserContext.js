import { createContext, useContext, useState } from 'react';

// Create context
const UserContext = createContext();

// Create custom hook
export const useUser = () => useContext(UserContext);

// Provide context to your app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        setUser(userData); // This will set the user data in context
        localStorage.setItem('token', userData.token); // Save token in localStorage
    };
    
    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

