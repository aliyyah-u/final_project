from django.http import HttpResponse
from django.template import loader
from rest_framework import viewsets
from .serializers import (
    CostSerializer, FishbuySerializer, EarningSerializer, InvestmentSerializer, StaffSerializer, StaffsSerializer, LoanTransactionsSerializer,
    LoandetailsSerializer,
    LoanProvidersInfoSerializer, CostitemsSerializer, CostpurposeSerializer, UsersSerializer, UsersinfoSerializer, DailyworksSerializer,
    FishtypeSerializer, ItemsSerializer, LandSerializer, MousaSerializer, SalarySerializer, SectorsSerializer, SourcesSerializer, UnitsSerializer)
from .models import (
    Cost, Fishbuy, Earning, Investment, Staff, Staffs, LoanTransactions, Loandetails, LoanProvidersInfo, Costitems, Costpurpose,
    Users, Usersinfo, Dailyworks, Fishtype, Items, Land, Mousa, Salary, Sectors, Sources, Units
)
from django.utils.dateparse import parse_date

def home(request):
    template = loader.get_template('home.html')
    return HttpResponse(template.render())

def total_cost(request):
    template = loader.get_template('total_cost.html')
    return HttpResponse(template.render())
    
def my_yield(request):
    template = loader.get_template('yield.html')
    return HttpResponse(template.render())
    
def profit(request):
    template = loader.get_template('profit.html')
    return HttpResponse(template.render())

def investment(request):
    template = loader.get_template('investment.html')
    return HttpResponse(template.render())

def land(request):
    template = loader.get_template('land.html')
    return HttpResponse(template.render())

def loans(request):
    template = loader.get_template('loans.html')
    return HttpResponse(template.render())

def sources(request):
    template = loader.get_template('sources.html')
    return HttpResponse(template.render())

def sectors(request):
    template = loader.get_template('sectors.html')
    return HttpResponse(template.render())

def fishname(request):
    template = loader.get_template('fishname.html')
    return HttpResponse(template.render())

def logs(request):
    template = loader.get_template('logs.html')
    return HttpResponse(template.render())

def businessAnalysis(request):
    template = loader.get_template('businessAnalysis.html')
    return HttpResponse(template.render())

def prediction(request):
    template = loader.get_template('prediction.html')
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
    
class FishbuyViewSet(viewsets.ModelViewSet):
    queryset = Fishbuy.objects.all()
    serializer_class = FishbuySerializer

    def get_queryset(self):
        queryset = Fishbuy.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset
    
class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    
    def get_queryset(self):
        queryset = Salary.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset
    
class EarningViewSet(viewsets.ModelViewSet):
    queryset = Earning.objects.all()
    serializer_class = EarningSerializer

    def get_queryset(self):
        queryset = Earning.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset
    
class LoanTransactionsViewSet(viewsets.ModelViewSet):
    queryset = LoanTransactions.objects.all()
    serializer_class = LoanTransactionsSerializer
    
    def get_queryset(self):
        queryset = LoanTransactions.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset
    
class DailyworksViewSet(viewsets.ModelViewSet):
    queryset = Dailyworks.objects.all()
    serializer_class = DailyworksSerializer
    
    def get_queryset(self):
        queryset = Dailyworks.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset
    
class InvestmentViewSet(viewsets.ModelViewSet):
    queryset = Investment.objects.all()
    serializer_class = InvestmentSerializer
    
    def get_queryset(self):
        queryset = Investment.objects.all()
        start = self.request.query_params.get('start')
        end = self.request.query_params.get('end')

        if start:
            queryset = queryset.filter(date__gte=parse_date(start))
        if end:
            queryset = queryset.filter(date__lte=parse_date(end))
        return queryset

class SectorsViewSet(viewsets.ModelViewSet):
    queryset = Sectors.objects.all()
    serializer_class = SectorsSerializer
    
class SourcesViewSet(viewsets.ModelViewSet):
    queryset = Sources.objects.all()
    serializer_class = SourcesSerializer

class UnitsViewSet(viewsets.ModelViewSet):
    queryset = Units.objects.all()
    serializer_class = UnitsSerializer

class FishtypeViewSet(viewsets.ModelViewSet):
    queryset = Fishtype.objects.all()
    serializer_class = FishtypeSerializer
    
class ItemsViewSet(viewsets.ModelViewSet):
    queryset = Items.objects.all()
    serializer_class = ItemsSerializer
    
class LandViewSet(viewsets.ModelViewSet):
    queryset = Land.objects.all()
    serializer_class = LandSerializer
    
class MousaViewSet(viewsets.ModelViewSet):
    queryset = Mousa.objects.all()
    serializer_class = MousaSerializer
    
class LoandetailsViewSet(viewsets.ModelViewSet):
    queryset = Loandetails.objects.all()
    serializer_class = LoandetailsSerializer

class LoanProvidersInfoViewSet(viewsets.ModelViewSet):
    queryset = LoanProvidersInfo.objects.all()
    serializer_class = LoanProvidersInfoSerializer
    
class CostitemsViewSet(viewsets.ModelViewSet):
    queryset = Costitems.objects.all()
    serializer_class = CostitemsSerializer

class CostpurposeViewSet(viewsets.ModelViewSet):
    queryset = Costpurpose.objects.all()
    serializer_class = CostpurposeSerializer
    
class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    
class StaffsViewSet(viewsets.ModelViewSet):
    queryset = Staffs.objects.all()
    serializer_class = StaffsSerializer
    
class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    
class UsersinfoViewSet(viewsets.ModelViewSet):
    queryset = Usersinfo.objects.all()
    serializer_class = UsersinfoSerializer