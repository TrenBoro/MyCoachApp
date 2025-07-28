import useAuth from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';

export default function Logout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <a href='#' onClick={e => {e.preventDefault; handleLogout();}} className="logout-link">Logout</a>
    )
}