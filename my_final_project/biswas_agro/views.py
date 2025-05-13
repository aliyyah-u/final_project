from django.http import HttpResponse
from django.template import loader
from rest_framework import viewsets
from .serializers import CostSerializer
from .models import Cost

class CostViewSet(viewsets.ModelViewSet):
    queryset = Cost.objects.all()
    serializer_class = CostSerializer

def home(request):
  template = loader.get_template('home.html')
  return HttpResponse(template.render())

def expenses(request):
  template = loader.get_template('expenses.html')
  return HttpResponse(template.render())