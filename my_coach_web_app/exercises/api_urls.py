from rest_framework.routers import DefaultRouter
from .api_views import *
from django.urls import path

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'workout-days', WorkoutDayViewSet, basename='workoutday')
router.register(r'my-workouts', MyWorkoutsViewSet, basename='my-workouts')
router.register(r'exercise-logs', ExerciseLogViewSet, basename='exercise-logs')
router.register(r'set-logs', SetLogViewSet, basename='set-logs')
router.register(r'muscles', MuscleViewSet, basename='muscles')
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'exercise-type', ExerciseTypeViewSet, basename='exercise-type')


urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('me/', CurrentUserApiView.as_view(), name='current-user'),
    path('create-workout/', CreateWorkoutApiView.as_view(), name='create-workout'),
    path('exercise-logs/by-workout/<int:workout_day_id>/', ExerciseLogsByWorkoutDayApiView.as_view(), name='exercise-log-by-workout'),
]

urlpatterns += router.urls