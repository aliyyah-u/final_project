from django.urls import include, path
from . import views
from rest_framework import routers
from .views import *

# router setup
router = routers.DefaultRouter()
router.register(r'cost', CostViewSet)
router.register(r'fishbuy', FishbuyViewSet) 
router.register(r'earning', EarningViewSet) 
router.register(r'investment', InvestmentViewSet)
router.register(r'staff', StaffViewSet)
router.register(r'staffs', StaffsViewSet)
router.register(r'users', UsersViewSet)
router.register(r'usersinfo', UsersinfoViewSet)
router.register(r'loantransactions', LoanTransactionsViewSet)
router.register(r'loandetails', LoandetailsViewSet)
router.register(r'loanproviders', LoanProvidersInfoViewSet)
router.register(r'costitems', CostitemsViewSet)
router.register(r'costpurpose', CostpurposeViewSet)
router.register(r'dailyworks', DailyworksViewSet)
router.register(r'fishtype', FishtypeViewSet)
router.register(r'items', ItemsViewSet)
router.register(r'land', LandViewSet)
router.register(r'mousa', MousaViewSet)
router.register(r'salary', SalaryViewSet)
router.register(r'sectors', SectorsViewSet)
router.register(r'sources', SourcesViewSet)
router.register(r'units', UnitsViewSet)

urlpatterns = [
    path('', views.home, name='home'),
    path('totalCost/', views.totalCost, name='totalCost'),
    path('fishYield/', views.fishYield, name='fishYield'),
    path('profit/', views.profit, name='profit'),
    path('loans/', views.loans, name='loans'),
    path('investment/', views.investment, name='investment'),
    path('land/', views.land, name='land'),
    path('fishCost/', views.fishCost, name='fishCost'),
    path('logs/', views.logs, name='logs'),
    path('profitAnalysis/', views.profitAnalysis, name='profitAnalysis'),
    path('prediction/', views.prediction, name='prediction'),
    path('api/', include(router.urls)), # /api/cost/ & /api/fishbuy/ & /api/earning etc.
    path('api-auth/', include('rest_framework.urls'))
]