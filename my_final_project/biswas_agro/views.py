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

def finances(request):
  template = loader.get_template('finances.html')
  return HttpResponse(template.render())

def inventory(request):
  template = loader.get_template('inventory.html')
  return HttpResponse(template.render())

def staff(request):
  template = loader.get_template('staff.html')
  return HttpResponse(template.render())

def template(request):
  template = loader.get_template('template.html')
  return HttpResponse(template.render())