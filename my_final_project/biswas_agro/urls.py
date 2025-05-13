from django.urls import include, path
from . import views
from rest_framework import routers
from .views import *

# router setup
router = routers.DefaultRouter()
router.register(r'cost', CostViewSet)

urlpatterns = [
    path('', views.home, name='home'), # Homepage
    path('finances/', views.finances, name='finances'), 
    path('inventory/', views.inventory, name='inventory'),
    path('staff/', views.staff, name='staff'),
    path('template/', views.template, name='template'),
    # REST API paths
    path('api/', include(router.urls)),  # This gives /api/cost/
    path('api-auth/', include('rest_framework.urls')),   
]