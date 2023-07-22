from django.db import models
import datetime
from django.contrib.auth.models import User
from .classes import GameSummary, StockHoldings

def get_current_month():
    now = datetime.datetime.now()
    return datetime.date(now.year,now.month,1)

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username

class Game(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, editable = False)
    month = models.DateField("Round of", blank=True)
    currentBalance = models.DecimalField("Balance", default = 1000000, blank=True, decimal_places=2, max_digits=15)
    ended = models.BooleanField("Ended", default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user','month'],name="unique_game_per_user_per_month")
        ]

    def update_balance(self):
        transactions = Transaction.objects.filter(game=self)
        value = 0
        for transaction in transactions:
            value += (-1 if transaction.type == "BUY" else 1) * transaction.quantity * transaction.unitprice
        self.currentBalance = value
        self.save()   

    def summarize_holdings(self):
        transactions = Transaction.objects.filter(game=self)
        gameSummary = GameSummary(self,transactions)
        return gameSummary
    
    def get_holdings_of_one_stock(self,ticker):
        transactions = Transaction.objects.filter(game=self, ticker=ticker.upper()).order_by("id")
        holdings = StockHoldings(ticker.upper())
        for txn in transactions:
            holdings.addTransaction(txn)
        return holdings




    
class Transaction(models.Model):
    transaction_types=[
        ("NEW", "Start a new game"),
        ("BUY", "Buy"),
        ("SELL", "Sell")
    ]
    game = models.ForeignKey(Game, on_delete=models.CASCADE, editable=False)
    ticker = models.CharField(max_length=10, blank=True)
    unitprice = models.DecimalField(max_digits=10,decimal_places=2)
    quantity = models.IntegerField()
    type = models.CharField(max_length=4,choices = transaction_types)
    created = models.DateTimeField(auto_now_add=True)

    def save(self, force_insert=False, force_update=False):
        self.ticker = self.ticker and self.ticker.upper()
        self.ticker.replace('_','.')
        super(Transaction, self).save(force_insert, force_update)