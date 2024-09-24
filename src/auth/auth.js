import React, {useContext} from "react";

export const AuthContext = React.createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    return {
        ...context,
        isAdmin: context?.user.email === 'admin@admin.com'
    };
}
