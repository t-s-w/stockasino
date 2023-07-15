from django.shortcuts import render
from django.http import JsonResponse, Http404
from api.serializer import LoginTokenPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
import yfinance as yf 
import json

# Create your views here.

def stockDetails(request, slug):
    ticker = yf.Ticker(slug)
    try:
        df = ticker.history(period='1w',interval='1m')
        return JsonResponse(ticker.info, safe=False)
    except:
        return JsonResponse({"message": 'Stock ticker provided does not exist'}, status=404)
    
class LoginTokenPairView(TokenObtainPairView):
    serializer_class = LoginTokenPairSerializer