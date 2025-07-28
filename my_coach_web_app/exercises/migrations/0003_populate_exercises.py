from django.db import migrations

exercises = [
        # --- CHEST ---
        {"name": "Barbell Bench Press", "exercise_type": "WEIGHT_REPS", "equipment": "BARBELL", "main_muscle_group": ("UPPER CHEST", "CHEST"), "primary_muscles": [("UPPER CHEST", "CHEST")], "secondary_muscles": [("LOWER CHEST", "CHEST"), ("TRICEPS", "ARMS")]},
        {"name": "Incline Dumbbell Press", "exercise_type": "WEIGHT_REPS", "equipment": "DUMBBELL", "main_muscle_group": ("UPPER CHEST", "CHEST"), "primary_muscles": [("UPPER CHEST", "CHEST")], "secondary_muscles": [("FRONT DELT", "SHOULDERS")]},
        {"name": "Chest Fly Machine", "exercise_type": "WEIGHT_REPS", "equipment": "MACHINE", "main_muscle_group": ("LOWER CHEST", "CHEST"), "primary_muscles": [("LOWER CHEST", "CHEST")], "secondary_muscles": [("FRONT DELT", "SHOULDERS")]},
        {"name": "Push Up", "exercise_type": "BODYWEIGHT_REPS", "equipment": "BODYWEIGHT", "main_muscle_group": ("LOWER CHEST", "CHEST"), "primary_muscles": [("LOWER CHEST", "CHEST")], "secondary_muscles": [("TRICEPS", "ARMS"), ("FRONT DELT", "SHOULDERS")]},
        
        # --- BACK ---
        {"name": "Pull Up", "exercise_type": "BODYWEIGHT_REPS", "equipment": "BODYWEIGHT", "main_muscle_group": ("LATS", "BACK"), "primary_muscles": [("LATS", "BACK")], "secondary_muscles": [("BICEPS", "ARMS"), ("UPPER BACK", "BACK")]},
        {"name": "Lat Pulldown", "exercise_type": "WEIGHT_REPS", "equipment": "MACHINE", "main_muscle_group": ("LATS", "BACK"), "primary_muscles": [("LATS", "BACK")], "secondary_muscles": [("TRAPS", "BACK")]},
        {"name": "Barbell Row", "exercise_type": "WEIGHT_REPS", "equipment": "BARBELL", "main_muscle_group": ("MIDDLE BACK", "BACK"), "primary_muscles": [("MIDDLE BACK", "BACK")], "secondary_muscles": [("LATS", "BACK"), ("REAR DELT", "SHOULDERS")]},
        {"name": "Seated Cable Row", "exercise_type": "WEIGHT_REPS", "equipment": "CABLE MACHINE", "main_muscle_group": ("MIDDLE BACK", "BACK"), "primary_muscles": [("MIDDLE BACK", "BACK")], "secondary_muscles": [("TRAPS", "BACK")]},

        # --- LEGS ---
        {"name": "Barbell Squat", "exercise_type": "WEIGHT_REPS", "equipment": "BARBELL", "main_muscle_group": ("QUADRICEPS", "LEGS"), "primary_muscles": [("QUADRICEPS", "LEGS")], "secondary_muscles": [("GLUTES", "LEGS"), ("HAMSTRINGS", "LEGS")]},
        {"name": "Leg Press", "exercise_type": "WEIGHT_REPS", "equipment": "MACHINE", "main_muscle_group": ("QUADRICEPS", "LEGS"), "primary_muscles": [("QUADRICEPS", "LEGS")], "secondary_muscles": [("CALVES", "LEGS")]},
        {"name": "Leg Curl", "exercise_type": "WEIGHT_REPS", "equipment": "MACHINE", "main_muscle_group": ("HAMSTRINGS", "LEGS"), "primary_muscles": [("HAMSTRINGS", "LEGS")], "secondary_muscles": [("GLUTES", "LEGS")]},
        {"name": "Leg Extension", "exercise_type": "WEIGHT_REPS", "equipment": "MACHINE", "main_muscle_group": ("QUADRICEPS", "LEGS"), "primary_muscles": [("QUADRICEPS", "LEGS")], "secondary_muscles": []},
        {"name": "Calf Raise", "exercise_type": "WEIGHT_REPS", "equipment": "MACHINE", "main_muscle_group": ("CALVES", "LEGS"), "primary_muscles": [("CALVES", "LEGS")], "secondary_muscles": []},

        # --- SHOULDERS ---
        {"name": "Overhead Press", "exercise_type": "WEIGHT_REPS", "equipment": "BARBELL", "main_muscle_group": ("FRONT DELT", "SHOULDERS"), "primary_muscles": [("FRONT DELT", "SHOULDERS")], "secondary_muscles": [("TRICEPS", "ARMS")]},
        {"name": "Lateral Raise", "exercise_type": "WEIGHT_REPS", "equipment": "DUMBBELL", "main_muscle_group": ("MIDDLE DELT", "SHOULDERS"), "primary_muscles": [("MIDDLE DELT", "SHOULDERS")], "secondary_muscles": []},
        {"name": "Rear Delt Fly", "exercise_type": "WEIGHT_REPS", "equipment": "DUMBBELL", "main_muscle_group": ("REAR DELT", "SHOULDERS"), "primary_muscles": [("REAR DELT", "SHOULDERS")], "secondary_muscles": []},

        # --- ARMS ---
        {"name": "Dumbbell Biceps Curl", "exercise_type": "WEIGHT_REPS", "equipment": "DUMBBELL", "main_muscle_group": ("BICEPS", "ARMS"), "primary_muscles": [("BICEPS", "ARMS")], "secondary_muscles": [("FOREARMS", "ARMS")]},
        {"name": "Triceps Pushdown", "exercise_type": "WEIGHT_REPS", "equipment": "CABLE MACHINE", "main_muscle_group": ("TRICEPS", "ARMS"), "primary_muscles": [("TRICEPS", "ARMS")], "secondary_muscles": []},
        {"name": "Preacher Curl", "exercise_type": "WEIGHT_REPS", "equipment": "BARBELL", "main_muscle_group": ("BICEPS", "ARMS"), "primary_muscles": [("BICEPS", "ARMS")], "secondary_muscles": []},
        {"name": "Skull Crushers", "exercise_type": "WEIGHT_REPS", "equipment": "BARBELL", "main_muscle_group": ("TRICEPS", "ARMS"), "primary_muscles": [("TRICEPS", "ARMS")], "secondary_muscles": []},

        # --- CORE ---
        {"name": "Plank", "exercise_type": "DURATION", "equipment": "NONE", "main_muscle_group": ("ABDOMINALS", "CORE"), "primary_muscles": [("ABDOMINALS", "CORE")], "secondary_muscles": [("OBLIQUES", "CORE"), ("LOWER BACK", "BACK")]},
        {"name": "Crunches", "exercise_type": "BODYWEIGHT_REPS", "equipment": "BODYWEIGHT", "main_muscle_group": ("ABDOMINALS", "CORE"), "primary_muscles": [("ABDOMINALS", "CORE")], "secondary_muscles": []},
        {"name": "Hanging Leg Raise", "exercise_type": "BODYWEIGHT_REPS", "equipment": "BODYWEIGHT", "main_muscle_group": ("ABDOMINALS", "CORE"), "primary_muscles": [("ABDOMINALS", "CORE")], "secondary_muscles": [("OBLIQUES", "CORE")]},

        # --- CARDIO ---
        {"name": "Treadmill Run", "exercise_type": "DISTANCE_DURATION", "equipment": "MACHINE", "main_muscle_group": ("CARDIO", "CARDIO"), "primary_muscles": [("CARDIO", "CARDIO")], "secondary_muscles": [("CALVES", "LEGS"), ("HAMSTRINGS", "LEGS")]},
        {"name": "Rowing Machine", "exercise_type": "DISTANCE_DURATION", "equipment": "MACHINE", "main_muscle_group": ("CARDIO", "CARDIO"), "primary_muscles": [("CARDIO", "CARDIO")], "secondary_muscles": [("UPPER BACK", "BACK")]},
        {"name": "Jump Rope", "exercise_type": "DURATION", "equipment": "NONE", "main_muscle_group": ("CARDIO", "CARDIO"), "primary_muscles": [("CARDIO", "CARDIO")], "secondary_muscles": [("CALVES", "LEGS")]},
        {"name": "Burpees", "exercise_type": "BODYWEIGHT_REPS", "equipment": "BODYWEIGHT", "main_muscle_group": ("CARDIO", "CARDIO"), "primary_muscles": [("CARDIO", "CARDIO")], "secondary_muscles": [("QUADRICEPS", "LEGS"), ("CHEST", "CHEST")]},

        # You can continue to add more to reach or exceed 50...
    ]

def add_initial_exercises(apps, schema_editor):
    Exercise = apps.get_model('exercises', 'Exercise')
    Muscle = apps.get_model('exercises', 'Muscle')
    Equipment = apps.get_model('exercises', 'Equipment')
    ExerciseType = apps.get_model('exercises', 'ExerciseType')
    User = apps.get_model('auth', 'User')

    user = User.objects.first()

    def get_muscle(name, parent):
        try:
            return Muscle.objects.get(name=name, parent=parent)
        except:
            print(f"Missing Muscle: {name}, {parent}")
    def get_equipment(name):
        return Equipment.objects.get(name=name)
    def get_ex_type(name):
        return ExerciseType.objects.get(name=name)

    for ex in exercises:
        exercise_type = get_ex_type(ex["exercise_type"])
        equipment = get_equipment(ex["equipment"])
        main_muscle = get_muscle(*ex["main_muscle_group"])
        obj, _ = Exercise.objects.get_or_create(
            name=ex["name"],
            defaults={
                "exercise_type": exercise_type,
                "equipment": equipment,
                "main_muscle_group": main_muscle,
                "created_by": user,
            }
        )
        obj.primary_muscles.set([get_muscle(*m) for m in ex["primary_muscles"]])
        obj.secondary_muscles.set([get_muscle(*m) for m in ex["secondary_muscles"]])
        obj.save()

def remove_exercises(apps, schema_editor):
    Exercise = apps.get_model('exercises', 'Exercise')
    for exercise in exercises:
        Exercise.objects.filter(name=exercise["name"]).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('exercises', '0002_auto_20250625_1727'),
    ]

    operations = [
        migrations.RunPython(add_initial_exercises, reverse_code=remove_exercises),
    ]
