import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MyWorkouts() {
    const [workouts, setWorkouts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("access");
        fetch('http://localhost:8000/exercises/api/my-workouts/', {
            headers: {
                "Authorization":`Bearer ${token}`
            }
        })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
            if(data){
                setWorkouts(data);
            } else {
                setWorkouts([]);
            }
        })
    }, [])

    return(
        <div className="my-workouts">
            {workouts.map(workout => {
                const num_exercises = workout.exercises.length
                const exercises_left = num_exercises - 3
                return (
                    <Link to={`/my-workouts/${workout.id}`} key={workout.id} className="workout-card">
                        {workout.name_of_day}
                        <ul className="workout-card-exercises">
                            {workout.exercises.slice(0, 3).map((ex, i) => (
                                <li className="workout-card-item" key={i}>{ex.name}</li>
                            ))}
                        </ul>
                        {num_exercises > 3 && <span>And {exercises_left} more exercises</span>}
                    </Link>
                )
            })}
            
        </div>
    )
}