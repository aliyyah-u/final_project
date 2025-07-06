# yourapp/resources.py

from import_export import resources
from .models import Earning, Cost, Fishbuy, Investment, Salary, Dailyworks, LoanTransactions

class EarningResource(resources.ModelResource):
    class Meta:
        model = Earning

class CostResource(resources.ModelResource):
    class Meta:
        model = Cost

class FishbuyResource(resources.ModelResource):
    class Meta:
        model = Fishbuy

class InvestmentResource(resources.ModelResource):
    class Meta:
        model = Investment

class SalaryResource(resources.ModelResource):
    class Meta:
        model = Salary

class DailyworksResource(resources.ModelResource):
    class Meta:
        model = Dailyworks

class LoanTransactionsResource(resources.ModelResource):
    class Meta:
        model = LoanTransactions