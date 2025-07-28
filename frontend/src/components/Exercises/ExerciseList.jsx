import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useExercises } from "../../context/ExerciseContext";

export default function ExerciseList() {
    const {exercises, setExercises} = useExercises();
    const [allExercises, setAllExercises] = useState([]);
    const [filter, setFilter] = useState("");
    
    const newNavigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const slot = parseInt(params.get('slot'), 10);

    const handlePick = (ex) => {
        setExercises(prev => {
            const updated = [...prev];
            updated[slot] = {...ex, sets:[]};
            return updated;
        })
        newNavigate("/create-workout");
    }

    useEffect(() => {
        fetch("http://localhost:8000/exercises/api/exercises/")
        .then(res => res.ok ? res.json() : null)
        .then(data => setAllExercises(data.results || data));
    }, [])

    const filterExercise = allExercises.filter(ex => 
        ex.name.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="exercises-list-page">
            <input
                type="text"
                placeholder="Search Exercises..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="filter-exercise"
            />
            <div className="exercise-list-picker">
                <div
                    className="exercise-list-ex add-new"
                    onClick={() => newNavigate("/add-exercise")}
                    style={{ color: "#ffd700", fontWeight: "bold", cursor: "pointer", marginTop: "1rem" }}
                >
                    ➕ Add New Exercise
                </div>
                {filterExercise.map(ex => (
                    <div
                        className="exercise-list-ex"
                        key={ex.id}
                        onClick={() => handlePick(ex)}
                    >
                        {ex.name}
                    </div>
                ))}
            </div>
        </div>
    )
}