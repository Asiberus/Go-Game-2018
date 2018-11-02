from django.db import models

# Create your models here.
class User(models.Model):
    name = models.CharField(max_length=100)
    channel_id = models.CharField(max_length=100, default=0)
    isInGame = models.BooleanField(default=False)

    def __str__(self):
        return self.name
