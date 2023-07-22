from django.shortcuts import render
from django.db.utils import IntegrityError
from django.http import JsonResponse, Http404
from api.serializer import LoginTokenPairSerializer, SignupSerializer, GameSerializer, TransactionSerializer, TickerSearchSerializer, GameTransactionSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import yfinance as yf 
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .models import Game, Transaction
import datetime
from requests.exceptions import HTTPError
import requests


def get_current_month():
    now = datetime.datetime.now()
    return datetime.date(now.year,now.month,1) 

# Create your views here.

def stockDetails(request, slug):
    slug = slug.replace("_",".")
    ticker = yf.Ticker(slug)
    try:
        df = ticker.history(period='1w',interval='1m')
        return JsonResponse(ticker.info, safe=False)
    except:
        return JsonResponse({"message": 'Stock ticker provided does not exist'}, status=status.HTTP_404_NOT_FOUND   )
    
class LoginTokenPairView(TokenObtainPairView):
    serializer_class = LoginTokenPairSerializer

@permission_classes([AllowAny])
class SignupView(generics.CreateAPIView):
    serializer_class = SignupSerializer

# Example of function view
# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def test(request):
#     if request.method == "GET":
#         return Response("ok")

@permission_classes([IsAuthenticated])
class GamesView(APIView):
    def get(self, request, format=None):
        games = Game.objects.filter(user=request.user)
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)
    
    def post(self,request, format=None):
        try:
            newgame = Game.objects.create(user=request.user, month=get_current_month())
        except IntegrityError:
            return Response({"detail":"Game exists for this month and user!"},status=status.HTTP_400_BAD_REQUEST)
        else:
            firsttransaction = Transaction.objects.create(game=newgame,unitprice=1000000,quantity=1, type="NEW")
            serializer = GameSerializer(newgame)
            return Response(serializer.data)
        
@permission_classes([IsAuthenticated])
class UpdateGameView(APIView):
    def get(self, request, format=None):
        game = Game.objects.get(user=request.user,month=get_current_month())
        if not game or game.ended:
            return Response({"detail":"No active game found for the current user!"},status=status.HTTP_404_NOT_FOUND)
        game.update_balance()
        return Response(GameSerializer(game).data)
        
@permission_classes([IsAuthenticated])
class TransactionsView(APIView):
    def post(self,request,format=None):
        game = Game.objects.get(user=request.user,month=get_current_month())
        if not request.user or not game or game.ended:
            return Response({"detail":"No active game found for the current user!"},status=status.HTTP_401_UNAUTHORIZED)
        try:
            ticker = yf.Ticker(request.data['ticker'])
            tickerinfo = ticker.info
            price = tickerinfo['currentPrice']
        except HTTPError:
            return Response({"detail": "Error fetching ticker info"},status=status.HTTP_404_NOT_FOUND)
        else:
            game.update_balance()
            if request.data['type'] == "BUY" and price * request.data['quantity'] > game.currentBalance:
                return Response({"detail":"Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)
            transaction = Transaction.objects.create(game=game, unitprice=price, ticker=request.data['ticker'], quantity=request.data['quantity'],type=request.data['type'])
            serializer = TransactionSerializer(transaction)
            game.update_balance()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

class GameDetailView(APIView):
    def get(self, request, gameId,format=None):
        try:
            game = Game.objects.get(id=gameId)
            print(game.summarize_holdings())
            return Response(game.summarize_holdings().to_dict())
        except:
            return Response({"detail":"Failed to fetch game"},status=status.HTTP_400_BAD_REQUEST)

@permission_classes([IsAuthenticated])
class HoldingsOfOneStockView(APIView):
    def get(self, request):
        if not request.query_params["ticker"]:
            return Response({"detail":"No ticker supplied"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            game = Game.objects.get(user=request.user,month=get_current_month())
            if not request.user or not game or game.ended:
                return Response({"detail":"No active game found for the current user!"},status=status.HTTP_401_UNAUTHORIZED)
        except:
            return Response ({"detail": "Failed to fetch game"},status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(game.get_holdings_of_one_stock(request.query_params["ticker"]).to_dict())

@api_view(["GET"])
def searchView(request):
    query = request.query_params["q"]
    headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
}
    url = 'https://query2.finance.yahoo.com/v1/finance/search?q={}'.format(query)
    r = requests.get(url,headers=headers) 
    searchResults = r.json()
    data = [x for x in searchResults['quotes'] if x['quoteType'] == 'EQUITY']
    output = TickerSearchSerializer(data,many=True)
    return Response(output.data)