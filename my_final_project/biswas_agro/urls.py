from django.urls import include, path
from . import views
from rest_framework import routers
from .views import *

# router setup
router = routers.DefaultRouter()
router.register(r'cost', CostViewSet)
router.register(r'fishbuy', FishbuyViewSet) 
router.register(r'earning', EarningViewSet) 

urlpatterns = [
    path('', views.home, name='home'),
    path('expenses/', views.expenses, name='expenses'),
    path('my_yield/', views.my_yield, name='my_yield'),
    path('profit/', views.profit, name='profit'),
    path('api/', include(router.urls)), # /api/cost/ & /api/fishbuy/ & /api/earning
    path('api-auth/', include('rest_framework.urls')),
]