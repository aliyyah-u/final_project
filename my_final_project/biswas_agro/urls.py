from django.urls import include, path
from . import views
from rest_framework import routers
from .views import *

# router setup
router = routers.DefaultRouter()
router.register(r'cost', CostViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('expenses/', views.expenses, name='expenses'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]