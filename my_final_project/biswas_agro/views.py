from django.http import HttpResponse
from django.template import loader
from rest_framework import viewsets
from .serializers import CostSerializer
from .models import Cost
from django.utils.dateparse import parse_date

def home(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())

def expenses(request):
    template = loader.get_template('expenses.html')
    return HttpResponse(template.render())

class CostViewSet(viewsets.ModelViewSet):
    queryset = Cost.objects.all()
    serializer_class = CostSerializer

    def get_queryset(self):
        queryset = Cost.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset