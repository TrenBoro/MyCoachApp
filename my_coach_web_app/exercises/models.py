from datetime import timedelta

from django.db import models
from django.contrib.auth.models import User

class Muscle(models.Model):
    MAIN_CHOICES = [
        ('CORE', 'Core'),
        ('ARMS', 'Arms'),
        ('BACK', 'Back'),
        ('CHEST', 'Chest'),
        ('LEGS', 'Legs'),
        ('SHOULDERS', 'Shoulders'),
        ('NECK', 'Neck'),
        ('CARDIO', 'Cardio'),
        ('OTHER', 'Other')
    ]
    INDIVIDUAL_CHOICES = [
        ('UPPER CHEST', 'Upper Chest'),
        ('LOWER CHEST', 'Lower Chest'),
        ('FRONT DELT', 'Front Delt'),
        ('MIDDLE DELT', 'Middle Delt'),
        ('REAR DELT', 'Rear Delt'),
        ('BICEPS', 'Biceps'),
        ('TRICEPS', 'Triceps'),
        ('FOREARMS', 'Forearms'),
        ('UPPER BACK', 'Upper Back'),
        ('LOWER BACK', 'Lower Back'),
        ('MIDDLE BACK', 'Middle Back'),
        ('LATS', 'Lats'),
        ('TRAPS', 'Traps'),
        ('ABDOMINALS', 'Abdominals'),
        ('OBLIQUES', 'Obliques'),
        ('QUADRICEPS', 'Quadriceps'),
        ('HAMSTRINGS', 'Hamstrings'),
        ('GLUTES', 'Glutes'),
        ('CALVES', 'Calves'),
        ('ABDUCTORS', 'Abductors'),
        ('ADDUCTORS', 'Adductors'),
        ('CARDIO', 'Cardio'),
        ('OTHER', 'Other'),
    ]
    name = models.CharField(max_length=50, choices=INDIVIDUAL_CHOICES)
    parent = models.CharField(max_length=50, choices=MAIN_CHOICES)
    
    def __str__(self):
        return f"{self.parent} - {self.name}"

class Equipment(models.Model):
    CHOICES = [
        ('NONE', 'None'),
        ('DUMBBELL', 'Dumbbell'),
        ('BARBELL', 'Barbell'),
        ('MACHINE', 'Machine'),
        ('BODYWEIGHT', 'Bodyweight'),
        ('CABLE MACHINE', 'Cable Machine'),
        ('PLATE', 'Plate'),
        ('MEDICINE BALL', 'Medicine Ball'),
        ('OTHER', 'other'),
    ]
    name = models.CharField(max_length=50, choices=CHOICES, unique=True)

    def __str__(self):
        return self.name

class ExerciseType(models.Model):
    CHOICES = [
        ('WEIGHT', 'Weight'),
        ('WEIGHT_REPS', 'Weight and Reps'),
        ('BODYWEIGHT_REPS', 'Bodyweight Reps'),
        ('WEIGHTED_BODYWEIGHT', 'Weighted Bodyweight'),
        ('ASSISTED_BODYWEIGHT', 'Assisted Bodyweight'),
        ('DURATION', 'Duration'),
        ('DISTANCE_DURATION', 'Distance and Duration'),
        ('WEIGHT_DISTANCE', 'Weight and Distance'),
    ]
    name = models.CharField(max_length=50, choices=CHOICES, unique=True)

    def __str__(self):
        return self.name

class Exercise(models.Model):
    name = models.CharField(max_length=50, blank=False, null=False, unique=True)
    exercise_type = models.ForeignKey(ExerciseType, on_delete=models.CASCADE, related_name="type_exercise", blank=False, null=False)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='equipment_exercises', blank=False, null=False)
    main_muscle_group = models.ForeignKey(Muscle, on_delete=models.CASCADE, related_name='main_exercises', blank=False, null=False)
    primary_muscles = models.ManyToManyField(Muscle, related_name='primary_exercises', blank=False)
    secondary_muscles = models.ManyToManyField(Muscle, related_name='secondary_exercises', blank=False)
    muscle_image = models.ImageField(upload_to='muscle_images/', blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='custom_exercises')

    def __str__(self):
        return self.name

class WorkoutDay(models.Model):
    name_of_day = models.CharField(max_length=50, null=False, blank=False)
    exercises = models.ManyToManyField(Exercise, related_name='workout_days')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="workout_days")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering =['-created_at']

    def __str__(self):
        return self.name_of_day

class ExerciseLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="exercise_logs")
    workout_day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE, related_name="exercise_logs", null=False, blank=False)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name="logs")
    notes = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user.username}: DAY: {self.workout_day.name_of_day} EXERCISE: {self.exercise.name} - {self.date}"

class SetLog(models.Model):
    exercise_log = models.ForeignKey(ExerciseLog, on_delete=models.CASCADE, related_name='sets')
    set_num = models.PositiveIntegerField(blank=False, null=False)
    num_reps = models.PositiveIntegerField(default=0, blank=True)
    weight = models.FloatField(default=0, blank=True)
    duration = models.DurationField(blank=True, default=timedelta(seconds=0))
    distance = models.FloatField(default=0, blank=True)

    class Meta:
        ordering = ['exercise_log', 'set_num']
    
    def __str__(self):
        return f"LOG: {self.exercise_log} : {self.set_num} x {self.num_reps} - {self.weight} - {self.duration} - {self.distance}"