from django.shortcuts import render
from django.http import JsonResponse, Http404
import yfinance as yf 
import json

# Create your views here.

def stockDetails(request, slug):
    ticker = yf.Ticker(slug)
    try:
        df = ticker.history(period='1w',interval='1m')
        return JsonResponse(json.loads(df.to_json()), safe=False)
    except:
        raise JsonResponse('Stock ticker provided does not exist',status=404)