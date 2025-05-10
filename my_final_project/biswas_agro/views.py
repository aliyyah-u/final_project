from django.http import HttpResponse
from django.template import loader

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