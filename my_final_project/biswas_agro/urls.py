from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'), # Homepage
    path('finances/', views.finances, name='finances'), 
    path('inventory/', views.inventory, name='inventory'),
    path('staff/', views.staff, name='staff')

]