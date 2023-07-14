from django.db import models
from datetime import date
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    
