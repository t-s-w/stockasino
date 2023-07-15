from django.urls import path, include
from . import views

urlpatterns = [
    # path('test/', views.test, name='test')
    path('stocks/<slug:slug>', views.stockDetails),
    path('auth/token',views.LoginTokenPairView.as_view())
]