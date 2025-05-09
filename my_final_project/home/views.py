from django.http import HttpResponse
from django.template import loader

def home(request):
  template = loader.get_template('myfirst.html')
  return HttpResponse(template.render())

# from django.http import HttpResponse
# from django.template import loader
# from .models import Home

# def home(request):
#   mytables = Home.objects.all().values()
#   template = loader.get_template('all_tables.html')
#   context = {
#     'mytables': mytables,
#   }
#   return HttpResponse(template.render(context, request))
  
# def details(request, id):
#   mytable = Home.objects.get(id=id)
#   template = loader.get_template('details.html')
#   context = {
#     'mytable': mymember,
#   }
#   return HttpResponse(template.render(context, request))
  
def main(request):
  template = loader.get_template('main.html')
  return HttpResponse(template.render())
    