from rest_framework import serializers
from .models import (
    Cost, Fishbuy, Earning, Investment, Staff, LoanTransactions, Loandetails, LoanProvidersInfo, Costitems, Costpurpose, Staffs,
    Users, Usersinfo, Dailyworks, Fishtype, Items, Land, Mousa, Salary, Sectors, Sources, Units
    )

class CostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cost
        fields = '__all__'
        
class FishbuySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fishbuy
        fields = '__all__'
        
class EarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Earning
        fields = '__all__'
        
class InvestmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Investment
        fields = '__all__'
        
class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'
        
class StaffsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staffs
        fields = '__all__'
        
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = '__all__'
        
class UsersinfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usersinfo
        fields = '__all__'

class LoanTransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanTransactions
        fields = '__all__'

class LoandetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loandetails
        fields = '__all__'

class LoanProvidersInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanProvidersInfo
        fields = '__all__'
        
class CostitemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Costitems
        fields = '__all__'
        
class CostpurposeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Costpurpose
        fields = '__all__'
        
class DailyworksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dailyworks
        fields = '__all__'
        
class FishtypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fishtype
        fields = '__all__'
        
class ItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Items
        fields = '__all__'
        
class LandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Land
        fields = '__all__'
        
class MousaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mousa
        fields = '__all__'
        
class SalarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Salary
        fields = '__all__'
        
class SectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sectors
        fields = '__all__'
        
class SourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sources
        fields = '__all__'
        
class UnitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Units
        fields = '__all__'