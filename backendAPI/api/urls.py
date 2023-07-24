from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    # path('test/', views.test, name='test')
    path('tickers/news/<slug:ticker>',views.stockNews),
    path('tickers/info/<slug:slug>', views.stockDetails),
    path('tickers/pricehistory/',views.stockPrices),
    path('auth/login',views.LoginTokenPairView.as_view()),
    path('auth/refresh',TokenRefreshView.as_view()),
    path('auth/signup',views.SignupView.as_view()),
    path('games/',views.GamesView.as_view()),
    path('transactions/',views.TransactionsView.as_view()),
    path('games/<int:gameId>/holdings', views.GameDetailView.as_view()),
    path('myholdings', views.HoldingsOfOneStockView.as_view()),
    path('games/update', views.UpdateGameView.as_view()),
    path('games/leaderboard',views.getLeaderboardView),
    path('search',views.searchView)
]