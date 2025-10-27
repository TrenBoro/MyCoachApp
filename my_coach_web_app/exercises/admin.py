from django.contrib import admin
from .models import *
# Register your models here.
admin.site.register(Muscle)
admin.site.register(Equipment)
admin.site.register(ExerciseType)
admin.site.register(Exercise)
admin.site.register(WorkoutDay)
admin.site.register(ExerciseLog)
admin.site.register(SetLog)