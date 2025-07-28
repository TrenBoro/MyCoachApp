from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth.models import User

from .serializers import *
from .models import WorkoutDay, Exercise, ExerciseLog, SetLog, ExerciseType, Muscle, Equipment

class ExerciseViewSet(viewsets.ModelViewSet):
    '''
    API for displaying all Exercise objects 
    '''
    queryset = Exercise.objects.all().order_by('primary_muscles')
    serializer_class = SerializeExercise
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['exercise_type', 'equipment']
    search_fields = ['name']
    ordering_fields = ['name', 'id']

class WorkoutDayViewSet(viewsets.ModelViewSet):
    queryset = WorkoutDay.objects.all()
    serializer_class = SerializeWorkoutDay

class MyWorkoutsViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = SerializeWorkoutDay

    def get_queryset(self):
        return WorkoutDay.objects.filter(created_by=self.request.user.id)

class ExerciseTypeViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = SerializeExerciseType
    queryset = ExerciseType.objects.all()

class EquipmentViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = SerializeEquipment
    queryset = Equipment.objects.all()

class MuscleViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    serializer_class = SerializeMuscleName
    queryset = Muscle.objects.all()

class ExerciseLogViewSet(viewsets.ModelViewSet):
    queryset = ExerciseLog.objects.all()
    serializer_class = SerializeExerciseLog

class SetLogViewSet(viewsets.ModelViewSet):
    queryset = SetLog.objects.all()
    serializer_class = SerializeSetLog


class ExerciseLogsByWorkoutDayApiView(APIView):
    '''
    [
        {
            "id": 15,
            "date": "2025-07-08",
            "user": 1,
            "exercise": "Chest Fly Machine",
            "sets": [
                {
                    "set_num": 1,
                    "num_reps": 3000,
                    "weight": 3000.0,
                    "duration": null,
                    "distance": null
                },
                {
                    "set_num": 2,
                    "num_reps": 300,
                    "weight": 300.0,
                    "duration": null,
                    "distance": null
                }
            ]
        },
    ...
    ]
    '''
    # permission_classes = [IsAuthenticated]

    def get(self, request, workout_day_id):
        logs = ExerciseLog.objects.filter(workout_day=workout_day_id).prefetch_related('sets', 'exercise')
        serializer = SerializeExerciseLog(logs, many=True)
        return Response(serializer.data)


class RegisterAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password)
        return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
    
class CurrentUserApiView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username
        })

class CreateWorkoutApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        exercises = request.data.get("exercises", [])
        title = request.data.get("title", "")

        if not exercises:
            return Response({"error": "No exercises provided"}, status=status.HTTP_400_BAD_REQUEST)
        if not title:
            return Response({"error": "Please provide a title"}, status=status.HTTP_400_BAD_REQUEST)
        
        workout_day = WorkoutDay.objects.create(name_of_day=title, created_by=request.user)
        exercise_ids = [ex['id'] for ex in exercises if 'id' in ex]
        workout_day.exercises.set(Exercise.objects.filter(id__in=exercise_ids))

        for ex in exercises:
            ex_id = ex.get('id')
            sets = ex.get('sets', [])
            if not ex_id:
                continue
            
            try:
                exercise_instance = Exercise.objects.get(id=ex_id)
            except Exercise.DoesNotExist:
                continue

            exercise_log = ExerciseLog.objects.create(workout_day=workout_day, exercise=exercise_instance, user=request.user)

            for i, s in enumerate(sets):
                SetLog.objects.create(
                    exercise_log=exercise_log,
                    set_num = i+1,
                    num_reps = s.get('num_reps') if s.get('num_reps') is not None else 0,
                    weight = s.get('weight') if s.get('weight') is not None else 0,
                    duration = timedelta(seconds=s['duration'])if s.get('duration') is not None else None,
                    distance = s.get('distance') if s.get('distance') is not None else 0
                )
        workout_day.save()

        return Response(SerializeWorkoutDay(workout_day).data, status=status.HTTP_201_CREATED)