import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-page">
            <div className="welcome-container">
                <h1>My Coach</h1>
                <div className="description">
                    Your personal gym companion! Log your workouts, track your progress, and unlock powerful statistics. 
                    Discover your strengths, spot your weaknesses, and let data guide your fitness journey.
                </div>
                <div className="todo-note">
                    <strong>Coming soon:</strong> 
                    Advanced analytics, AI-powered insights, and more!
                </div>
            </div>
            <div className="home-links">
                <Link to="/create-workout">Create Workout</Link>
                <Link to="/profile">Go to profile</Link>
            </div>
        </div>
        
    );
}