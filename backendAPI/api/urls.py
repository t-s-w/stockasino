from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    # path('test/', views.test, name='test')
    path('stocks/<slug:slug>', views.stockDetails),
    path('auth/login',views.LoginTokenPairView.as_view()),
    path('auth/refresh',TokenRefreshView.as_view()),
    path('auth/signup',views.SignupView.as_view()),
    path('test',views.test)
]