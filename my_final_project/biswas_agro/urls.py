from django.urls import path
from . import views

# urlpatterns = [
#     path('', views.main, name='main'),
#     path('biswas_agro/', views.biswas_agro, name='biswas_agro'),
# ]


urlpatterns = [
    path('', views.home, name='home'),          # Homepage
    path('finances/', views.finances, name='finances'),  # Finance page
]