import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddExercise() {
    const [name, setName] = useState("");

    const [exerciseType, setExerciseType] = useState("");
    const [exerciseTypes, setExerciseTypes] = useState([]);

    const [equipment, setEquipment] = useState("");
    const [equipments, setEquipments] = useState([]);

    const [muscles, setMuscles] = useState([]);
    const [mainMuscleGroup, setMainMuscleGroup] = useState("");
    const [primaryMuscles, setPrimaryMuscles] = useState([]);
    const [secondaryMuscles, setSecondaryMuscles] = useState([]);

    const newNavigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8000/exercises/api/exercise-type/")
            .then(res => res.json())
            .then(data => setExerciseTypes(data.results || data));
        fetch("http://localhost:8000/exercises/api/equipment/")
            .then(res => res.json())
            .then(data => setEquipments(data.results || data));
        fetch("http://localhost:8000/exercises/api/muscles/")
            .then(res => res.json())
            .then(data => setMuscles(data.results || data));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access");
        const payload = {
            name,
            exercise_type: Number(exerciseType),
            equipment: Number(equipment),
            main_muscle_group: Number(mainMuscleGroup),
            primary_muscles: primaryMuscles.map(Number),
            secondary_muscles: secondaryMuscles.map(Number)
        }
        const res = await fetch("http://localhost:8000/exercises/api/exercises/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        })
        
        if (res.ok) {
            const newExercise = await res.json();
            newNavigate("/pick-exercise");
        } else {
            const error = await res.json();
            console.error(error);
            alert("Failed to add exercise");
            return;
        }
    }

    return (
        <form onSubmit={handleSubmit} className="add-exercise-form">
            <h3>Add New Exercise</h3>
            <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Exercise Name"
                required
            />
            <select value={exerciseType} onChange={e => setExerciseType(e.target.value)} required>
                <option value="">Select Exercise Type</option>
                {exerciseTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                ))}
            </select>
            <select value={equipment} onChange={e => setEquipment(e.target.value)} required>
                <option value="">Select Equipment</option>
                {equipments.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.name}</option>
                ))}
            </select>
            <select value={mainMuscleGroup} onChange={e => setMainMuscleGroup(e.target.value)} required>
                <option value="">Select Main Muscle Group</option>
                {muscles.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
            <label>Primary Muscles</label>
            <select multiple value={primaryMuscles} onChange={e => setPrimaryMuscles(Array.from(e.target.selectedOptions, o => o.value))} required>
                {muscles.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
            <label>Secondary Muscles</label>
            <select multiple value={secondaryMuscles} onChange={e => setSecondaryMuscles(Array.from(e.target.selectedOptions, o => o.value))} required>
                {muscles.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                ))}
            </select>
            <button type="submit">Save Exercise</button>
        </form>
    );
}