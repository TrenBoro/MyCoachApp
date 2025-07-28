import useAuth from "../../context/AuthContext"
import { Link } from "react-router-dom";

export default function ProfileHeader() {
    const {user} = useAuth();

    if (!user) return null;

    return (
        <div className="profile-header">
            <Link to="/profile">
                <div>{user.username}</div>
            </Link>
        </div>
    );
}