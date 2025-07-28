import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function WorkoutDetail() {
    const {id} = useParams();
    const [workout, setWorkout] = useState(null);
    const [exerciseLogs, setExerciseLogs] = useState([]);

    useEffect(() => {
        async function fetchWorkoutDetails() {
            let token = localStorage.getItem("access");
            const workoutDetails = await fetch(`http://localhost:8000/exercises/api/my-workouts/${id}/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => res.ok ? res.json() : null);
            const workoutLogs = await fetch(`http://localhost:8000/exercises/api/exercise-logs/by-workout/${id}/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then(res => res.ok ? res.json() : null);

            setWorkout(workoutDetails);
            setExerciseLogs(workoutLogs);

        }

            fetchWorkoutDetails();
    }, [id]);

    if (!workout) return <div className="workout-details">Loading...</div>

    return (
        <div className="workout-details-page">
            <h2>{workout && workout.name_of_day}</h2>
            <div className="workout-details">
                {workout && workout.exercises.map((ex) => {
                    const log = exerciseLogs.find(l => l.exercise_id === ex.id);
                    
                    if (!log) return null;

                    const type = ex.exercise_type;
                    
                    const showReps = ["WEIGHT_REPS", "BODYWEIGHT_REPS", "WEIGHTED_BODYWEIGHT", "ASSISTED_BODYWEIGHT"].includes(type);
                    const showWeight = ["WEIGHT", "WEIGHT_REPS", "WEIGHTED_BODYWEIGHT", "WEIGHT_DISTANCE"].includes(type);
                    const showDuration = ["DURATION", "DISTANCE_DURATION"].includes(type);
                    const showDistance = ["DISTANCE_DURATION", "WEIGHT_DISTANCE"].includes(type);

                    return (
                        <div key={ex.id} className="workout-details-exercise">
                            {ex.name}
                            <table className="sets-table">
                                <thead>
                                    <tr>
                                        <th>SET</th>
                                        {showWeight && <th>WEIGHT</th>}
                                        {showReps && <th>REPS</th>}
                                        {showDistance && <th>DISTANCE</th>}
                                        {showDuration && <th>DURATION</th>}
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {log.sets.map((l, i) => (
                                        <tr key={i}>
                                            <td className="set-number">{l.set_num}</td>
                                            {showWeight && <td className="weight">{l.weight}</td>}
                                            {showReps && <td className="num-reps">{l.num_reps}</td>}
                                            {showDistance && <td className="distance">{l.distance}</td>}
                                            {showDuration && <td className="duration">{l.duration}</td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                })}
            </div>
            <Link to='/profile' className="back-button">Back to Workouts</Link>
        </div>
    )
}