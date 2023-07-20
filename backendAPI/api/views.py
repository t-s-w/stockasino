from django.shortcuts import render
from django.http import JsonResponse, Http404
from api.serializer import LoginTokenPairSerializer, SignupSerializer, GameSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import yfinance as yf 
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .models import Game, Transaction
import datetime


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
        newgame = Game.objects.create(user=request.user, month=get_current_month())
        firsttransaction = Transaction.objects.create(game=newgame,unitprice=1000000,quantity=1, type="NEW")
        serializer = GameSerializer(newgame)
        return Response(serializer.data)