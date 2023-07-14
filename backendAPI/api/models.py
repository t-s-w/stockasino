from django.db import models
import datetime
from django.contrib.auth.models import User

def get_current_month():
    now = datetime.datetime.now()
    return datetime.date(now.year,now.month,1)

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable = False, unique_for_date="month")
    month = models.DateField("Round of", default = get_current_month, editable=False, blank=True)
    

    
class Transaction(models.Model):
    transaction_types=[
        ("NEW", "Start a new game"),
        ("BUY", "Buy"),
        ("SELL", "Sell")
    ]
    game = models.ForeignKey(Game, on_delete=models.CASCADE, editable=False)
    ticker = models.CharField(max_length=10, blank=True, editable=False)
    unitprice = models.DecimalField(max_digits=10,decimal_places=2, editable=False)
    quantity = models.IntegerField(editable=False)
    type = models.CharField(max_length=4,choices = transaction_types)