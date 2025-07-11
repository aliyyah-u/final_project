# yourapp/resources.py

from import_export import resources
from .models import (
    Cost, Fishbuy, Earning, Investment, Staff, LoanTransactions, Loandetails, LoanProvidersInfo, Costitems, Costpurpose, Staffs,
    Users, Usersinfo, Dailyworks, Fishtype, Items, Land, Mousa, Salary, Sectors, Sources, Units
    )

class EarningResource(resources.ModelResource):
    class Meta:
        model = Earning
        
class LandResource(resources.ModelResource):
    class Meta:
        model = Land

class CostResource(resources.ModelResource):
    class Meta:
        model = Cost
        
class CostitemsResource(resources.ModelResource):
    class Meta:
        model = Costitems
        
class ItemsResource(resources.ModelResource):
    class Meta:
        model = Items
        
class CostpurposeResource(resources.ModelResource):
    class Meta:
        model = Costpurpose

class FishbuyResource(resources.ModelResource):
    class Meta:
        model = Fishbuy
        
class FishtypeResource(resources.ModelResource):
    class Meta:
        model = Fishtype

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
        
class LoanProvidersInfoResource(resources.ModelResource):
    class Meta:
        model = LoanProvidersInfo
        
class LoandetailsResource(resources.ModelResource):
    class Meta:
        model = Loandetails
        
class MousaResource(resources.ModelResource):
    class Meta:
        model = Mousa
        
class SectorsResource(resources.ModelResource):
    class Meta:
        model = Sectors
        
class SourcesResource(resources.ModelResource):
    class Meta:
        model = Sources
        
class StaffResource(resources.ModelResource):
    class Meta:
        model = Staff
        
class StaffsResource(resources.ModelResource):
    class Meta:
        model = Staffs

class UnitsResource(resources.ModelResource):
    class Meta:
        model = Units
        
class UsersResource(resources.ModelResource):
    class Meta:
        model = Users
        
class UsersinfoResource(resources.ModelResource):
    class Meta:
        model = Usersinfo