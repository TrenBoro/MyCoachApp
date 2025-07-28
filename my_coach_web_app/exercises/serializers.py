from rest_framework import serializers
from datetime import timedelta
from .models import Exercise, WorkoutDay, ExerciseType, Equipment, Muscle, ExerciseLog, SetLog
from django.contrib.auth.models import User

class SerializeUser(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class SerializeExerciseType(serializers.ModelSerializer):
    class Meta:
        model = ExerciseType
        fields = ['id', 'name']

class SerializeEquipment(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name']

class SerializeMuscle(serializers.ModelSerializer):
    class Meta:
        model = Muscle
        fields = '__all__'

class SerializeMuscleName(serializers.ModelSerializer):
    class Meta:
        model = Muscle
        fields = ['id', 'name']

class SerializeMainMuscleGroup(serializers.ModelSerializer):
    class Meta:
        model = Muscle
        fields = ['id', 'name']

class SerializeExercise(serializers.ModelSerializer):
    exercise_type = serializers.CharField(source='exercise_type.name')
    equipment_detail = SerializeEquipment(source='equipment', read_only=True)
    primary_muscles_detail = SerializeMuscleName(source='primary_muscles', many=True, read_only=True)
    secondary_muscles_detail = SerializeMuscleName(source='secondary_muscles', many=True, read_only=True)
    main_muscle_group_detail = SerializeMainMuscleGroup(source='main_muscle_group', read_only=True)

    class Meta:
        model = Exercise
        fields = [
            'id', 'name', 'exercise_type', 'equipment', 'main_muscle_group',
            'primary_muscles', 'secondary_muscles',
            'exercise_type', 'equipment_detail',
            'main_muscle_group_detail', 'primary_muscles_detail', 'secondary_muscles_detail'
        ]

class SerializeWorkoutDay(serializers.ModelSerializer):
    class Meta:
        model = WorkoutDay
        fields = '__all__'
    
    exercises = SerializeExercise(many=True)
    created_by = SerializeUser()

class SerializeSetLog(serializers.ModelSerializer):
    class Meta:
        model = SetLog
        fields = ['set_num', 'num_reps', 'weight', 'duration', 'distance']
    
    def to_internal_value(self, data):
        data = super().to_internal_value(data)

        duration = self.internal_data.get('duration')
        if duration:
            try: 
                duration = int(duration)
                data['duration'] = timedelta(seconds=duration)
            except:
                raise serializers.ValidationError("Duration must be an integer represented in seconds.")
        return data
    
    def to_representation(self, instance):
        rep = super().to_representation(instance)

        if instance.duration:
            try:
                print("rep: ", rep)
                rep['duration'] = int(instance.duration.total_seconds())
            except Exception as e:
                print("Exception: ", e)
        return rep

class SerializeExerciseLog(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLog
        fields = ['id', 'date', 'user', 'exercise', 'exercise_id', 'sets']
    
    exercise = serializers.CharField(source='exercise.name')
    exercise_id = serializers.PrimaryKeyRelatedField(source='exercise.id', read_only=True)
    sets = SerializeSetLog(many=True)