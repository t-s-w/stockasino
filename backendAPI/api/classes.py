from collections import deque
import yfinance as yf
from decimal import Decimal
import json
from django.forms.models import model_to_dict

class StockHoldings:
    def __init__(self,ticker):
        self.ticker = ticker
        self.holdings = deque([])
        
        self.qtyOwned = 0
        self.totalCost = 0
        self.currentPrice = 0
        self.transactionHistory = []

    def addTransaction(self,transaction):
        if transaction.ticker != self.ticker: 
            return
        if transaction.type == "SELL":
            toSell = transaction.quantity
            if toSell > self.qtyOwned:
                raise "Insufficient holdings to sell"
            while toSell > 0:
                if len(self.holdings) == 0:
                    raise "Insufficient holdings to sell"
                firstIn = self.holdings.popleft()
                if firstIn:
                    if firstIn['quantity'] < toSell:
                        self.qtyOwned -= firstIn['quantity']
                        self.totalCost -= firstIn['quantity'] * firstIn['unitprice']
                        toSell -= firstIn['quantity']
                    else: 
                        self.qtyOwned -= toSell
                        self.totalCost -= toSell * firstIn['unitprice']
                        firstIn['quantity'] -= toSell
                        toSell = 0
                        if firstIn['quantity'] > 0:
                            self.holdings.appendleft(firstIn)
        elif transaction.type == "BUY":
            self.holdings.append({"unitprice": transaction.unitprice, "quantity": transaction.quantity})
            self.qtyOwned += transaction.quantity
            self.totalCost += transaction.quantity * transaction.unitprice
        txnData = transaction.__dict__
        del txnData['_state']
        self.transactionHistory.append(txnData)

    def avgCost(self):
        return self.totalCost / self.qtyOwned
    
    def to_dict(self):
        return {
            "ticker": self.ticker,
            "holdings": list(self.holdings),
            "qtyOwned": self.qtyOwned,
            "totalCost": self.totalCost,
            "currentPrice": self.currentPrice,
            "transactionHistory": self.transactionHistory
        }
    
class GameSummary:
    def __init__(self, game, transactions):
        self.id = game.id
        self.user = str(game.user)
        self.month = str(game.month)
        self.ended = game.ended
        self.currentBalance = 0
        self.portfolio = {}
        self.starting = 0
        for transaction in transactions:
            if transaction.type == "NEW":
                self.currentBalance += (transaction.unitprice)
                self.starting = transaction.unitprice
            else:
                if transaction.ticker not in self.portfolio:
                    self.portfolio[transaction.ticker] = StockHoldings(transaction.ticker)
                self.portfolio[transaction.ticker].addTransaction(transaction)
                self.currentBalance += (-1 if transaction.type == 'BUY' else 1) * transaction.quantity * (transaction.unitprice)
        tickerlist = [ticker for ticker in self.portfolio]
        tickers = yf.Tickers(tickerlist)
        for ticker, holdings in self.portfolio.items():
            holdings.currentPrice = tickers.tickers[ticker.upper()].info['currentPrice']
        value = self.currentBalance
        for ticker, holdings in self.portfolio.items():
            value += Decimal(holdings.currentPrice * holdings.qtyOwned)
        self.value = value

    def to_dict(self):
        return {
            "id": self.id,
            "user": self.user,
            "starting": self.starting,
            "month": self.month,
            "ended": self.ended,
            "currentBalance": self.currentBalance,
            "portfolio": {ticker: holdings.to_dict() for ticker,holdings in self.portfolio.items()},
            "value": self.value
        }