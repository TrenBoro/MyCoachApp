import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExercises } from "../../context/ExerciseContext";

export default function CreateWorkout() {
    const { exercises, setExercises } = useExercises();
    const [title, setTitle] = useState("");
    const newNavigate = useNavigate();
    
    function updateSet(exerciseIndex, setIndex, field, value) {
        setExercises(prev => {
            const updated = [...prev];
            if (!updated[exerciseIndex].sets)
                updated[exerciseIndex].sets = [];

            if (!updated[exerciseIndex].sets[setIndex])
                updated[exerciseIndex].sets = {num_reps: "", weight: "", distance: "", duration: {h: "", m: "", s: ""}};

            updated[exerciseIndex].sets[setIndex][field] = value;
            return updated;
        })
    }

    function addSet(exerciseIndex) {
        setExercises(prev => {
            const updated = [...prev];
            if (!updated[exerciseIndex].sets)
                updated[exerciseIndex].sets = [];

            updated[exerciseIndex].sets.push({num_reps: "", weight: "", distance: "", duration: {h: "", m: "", s: ""}});
            return updated;
        })
    }

    function removeSet(exerciseIndex, setIndex) {
        setExercises(prev => {
            const updated = [...prev];
            if (!updated[exerciseIndex].sets) return updated;

            updated[exerciseIndex].sets.splice(setIndex, 1);
            return updated;
        })
    }

    function addExercise() {
        setExercises(prev => [...prev, {id:null, name:"", sets:[]}]);
        newNavigate(`/pick-exercise?slot=${exercises.length}`);
    }

    function durationToSeconds(duration){
        const h = parseInt(duration?.h) || 0;
        const m = parseInt(duration?.m) || 0;
        const s = parseInt(duration?.s) || 0;
        return h * 3600 + m * 60 + s;
    }

    async function finishWorkout() {
        const include_reps = ["WEIGHT_REPS", "BODYWEIGHT_REPS", "WEIGHTED_BODYWEIGHT", "ASSISTED_BODYWEIGHT"]
        const include_weigth = ["WEIGHT", "WEIGHT_REPS", "WEIGHTED_BODYWEIGHT", "WEIGHT_DISTANCE"]
        const include_duration = ["DURATION", "DISTANCE_DURATION"]
        const include_distance = ["DISTANCE_DURATION", "WEIGHT_DISTANCE"]

        if (exercises.length === 0){
            alert("Please select at least one exercise!");
            return;
        }
        if (!title) {
            alert("Please add a title");
            return;
        }
        if (exercises.some(ex => !ex)){
            alert("Please add an exercise for every slot!");
            return;
        }
        for (const ex of exercises) {
            if (!ex.sets || ex.sets.length === 0) {
                alert(`Please add at least one set for ${ex.name}`);
                return;
            }
            for (const set of ex.sets){
                if (include_weigth.includes(ex.exercise_type) && !set.weight) {
                    alert(`Please fill out weight for ${ex.name}`);
                    return;
                }
                if (include_reps.includes(ex.exercise_type) && !set.num_reps) {
                    alert(`Please fill out reps for ${ex.name}`);
                    return;
                }
                if (include_distance.includes(ex.exercise_type) && !set.distance) {
                    alert(`Please fill out distance for ${ex.name}`);
                    return;
                }
                if (include_duration.includes(ex.exercise_type)){
                    const duration = set.duration || {};
                    const total_time = durationToSeconds(duration);
                    if (total_time === 0){
                        alert(`Please enter a valid duration (hh:mm:ss) for ${ex.name}`)
                    }
                }
            }

        }

        const token = localStorage.getItem("access");
        const response = await fetch("http://localhost:8000/exercises/api/create-workout/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                exercises: exercises.map(ex => ({
                    id: ex.id,
                    sets: ex.sets.map(set => {
                        const duration = set.duration
                            ? durationToSeconds(set.duration)
                            : null;
                        
                        return {
                            ...set,
                            weight: set.weight === "" ? null : Number(set.weight),
                            num_reps: set.num_reps === "" ? null : Number(set.num_reps),
                            distance: set.distance === "" ? null : Number(set.distance),
                            duration
                        };
                    })
                })),
            }),
        });
        const data = await response.json();

        if(response.ok){
            alert("Workout Saved");
            setExercises([]);
            setTimeout(newNavigate("/profile"), 500)
        } else {
            alert("Workout NOT Saved");
        }
    }
    return (
        <div className="create-workout-page">
            <h2 className="create-workout-h2">Enter a Workout</h2>
            <input 
                className="create-workout-title" 
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter Workout Name"
                required
            />
            <div className="create-workout-section">
                <div className="create-workout-list">
                    {exercises.map((exercise, index) => {
                        const type = exercise.exercise_type;

                        const showReps = ["WEIGHT_REPS", "BODYWEIGHT_REPS", "WEIGHTED_BODYWEIGHT", "ASSISTED_BODYWEIGHT"].includes(type);
                        const showWeight = ["WEIGHT", "WEIGHT_REPS", "WEIGHTED_BODYWEIGHT", "WEIGHT_DISTANCE"].includes(type);
                        const showDuration = ["DURATION", "DISTANCE_DURATION"].includes(type);
                        const showDistance = ["DISTANCE_DURATION", "WEIGHT_DISTANCE"].includes(type);

                        return (
                            <div key={index} className="create-workout-panels">
                                {exercise ? (
                                    <div>
                                        <div className="exercise-name">{exercise.name}</div>
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
                                                {exercise.sets && exercise.sets.length > 0 ? (
                                                    exercise.sets.map((set, setIndex) => (
                                                        <tr key={setIndex}>
                                                            <td className="set-number">{setIndex + 1}</td>
                                                            {showWeight && <td className="input-weight">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={set.weight}
                                                                    onChange={e =>
                                                                        updateSet(index, setIndex, "weight", e.target.value)
                                                                    }
                                                                    placeholder="kg"
                                                                    required
                                                                />
                                                            </td>}
                                                            {showReps && <td className="input-reps">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={set.num_reps}
                                                                    onChange={e =>
                                                                        updateSet(index, setIndex, "num_reps", e.target.value)
                                                                    }
                                                                    placeholder="reps"
                                                                    required
                                                                />
                                                            </td>}
                                                            {showDistance && <td className="input-distance">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    value={set.distance}
                                                                    onChange={e =>
                                                                        updateSet(index, setIndex, "distance", e.target.value)
                                                                    }
                                                                    placeholder="meters"
                                                                    required
                                                                />
                                                            </td>}
                                                            {showDuration && (
                                                                <td className="input-duration duration-fields">
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={set.duration?.h || ""}
                                                                        onChange={e =>
                                                                            updateSet(index, setIndex, "duration", {
                                                                                ...set.duration,
                                                                                h: parseInt(e.target.value) || 0
                                                                            })
                                                                        }
                                                                        placeholder="hh"

                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={set.duration?.m || ""}
                                                                        onChange={e =>
                                                                            updateSet(index, setIndex, "duration", {
                                                                                ...set.duration,
                                                                                m: parseInt(e.target.value) || 0
                                                                            })
                                                                        }
                                                                        placeholder="mm"
                                                                    />
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        value={set.duration?.s || ""}
                                                                        onChange={e =>
                                                                            updateSet(index, setIndex, "duration", {
                                                                                ...set.duration,
                                                                                s: parseInt(e.target.value) || 0
                                                                            })
                                                                        }
                                                                        placeholder="ss"
                                                                    />
                                                                </td>
                                                            )}

                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeSet(index, setIndex)}
                                                                    className="delete-set-button"
                                                                >
                                                                    ❌
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4">No sets added yet</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        <button
                                            type="button"
                                            onClick={() => addSet(index)}
                                            className="add-set-button"
                                        >
                                            ➕ Add Set
                                        </button>
                                    </div>
                                ) : (
                                    <div className="exercise-name placeholder">No exercise selected</div>
                                )}
                                <button
                                    className="delete-panel-button"
                                    type="button"
                                    onClick={() => {
                                        setExercises(prev => prev.filter((_, idx) => idx !== index));
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        )})}
                    <button 
                        type="button" 
                        className="add-exercise-button" 
                        onClick={addExercise}
                        disabled={exercises.length > 0 && !exercises[exercises.length - 1]}
                    >
                        ➕ Add Exercise
                    </button>
                </div>
                <button 
                    type="button" 
                    className="finish-workout-button" 
                    onClick={finishWorkout}
                >
                    Finish Workout
                </button>
            </div>
        </div>
    );
}