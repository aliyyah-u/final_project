# from django.http import HttpResponse
# from django.template import loader
# from django.shortcuts import render

# # def home(request):
# #   return render(request, 'biswas_agro/home.html')

# # def finances(request):
# #   return render(request, 'biswas_agro/finances.html')

# # def biswas_agro(request):
# #   template = loader.get_template('myfirst.html')
# #   return HttpResponse(template.render())

#   # return HttpResponse("Hello world!")

# # from django.http import HttpResponse
# # from django.template import loader
# # from .models import Home

# # def home(request):
# #   mytables = Home.objects.all().values()
# #   template = loader.get_template('all_tables.html')
# #   context = {
# #     'mytables': mytables,
# #   }
# #   return HttpResponse(template.render(context, request))
  
# # def details(request, id):
# #   mytable = Home.objects.get(id=id)
# #   template = loader.get_template('details.html')
# #   context = {
# #     'mytable': mymember,
# #   }
# #   return HttpResponse(template.render(context, request))
  
# def main(request):
#   template = loader.get_template('main.html')
#   return HttpResponse(template.render())

# def finances(request):
#   template = loader.get_template('finances.html')
#   return HttpResponse(template.render())
    
# # def finances(request):
# #   return render(request, 'home/finances.html')


from django.shortcuts import render

def home(request):
    return render(request, 'home.html')

def finances(request):
    return render(request, 'finances.html')

def inventory(request):
  return render(request, 'inventory.html')

def staff(request):
  return render(request, 'staff.html')