import { AuthContext } from '../context/Auth';
import { useContext } from 'react';

export const useAuth = () => {
    const user = useContext(AuthContext);

    return user;
};
