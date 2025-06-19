from django.contrib import admin
from .models import (
    Cost, Fishbuy, Earning, Investment, Staff, Staffs, LoanTransactions, Loandetails, LoanProvidersInfo, Costitems, Costpurpose,
    Users, Usersinfo, Dailyworks, Fishtype, Items, Land, Mousa, Salary, Sectors, Sources, Units
)

class CostAdmin(admin.ModelAdmin):
    list_display = (
        "date", "costcategory", "costitems", "buyamount", "unit", "cost", "status",
        "buyer", "buyvoucher", "comment", "logs", "costitems_id"
    )

class CostitemsAdmin(admin.ModelAdmin):
    list_display = ("costitems", "sector", "logs")

class CostpurposeAdmin(admin.ModelAdmin):
    list_display = ("costpurpose",)

class DailyworksAdmin(admin.ModelAdmin):
    list_display = ("date", "worktype", "item", "amount", "unit", "personel", "comment", "logs")

class FishbuyAdmin(admin.ModelAdmin):
    list_display = ("date", "fishname", "buyfrom", "buyamount", "fishquantity", "price", "status", "fishto", "vouchar", "comments", "logs")

class FishtypeAdmin(admin.ModelAdmin):
    list_display = ("fishname", "logs")

class InvestmentAdmin(admin.ModelAdmin):
    list_display = ("date", "name", "amount", "comments", "logs")

class StaffAdmin(admin.ModelAdmin):
    list_display = ("staffno", "name", "post", "salary", "address", "mobile", "reference", "log")

class StaffsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "designation", "address", "mobile")

class LoanProvidersInfoAdmin(admin.ModelAdmin):
    list_display = ("investerid", "name", "address", "mobile", "refference", "logs")

class LoanTransactionsAdmin(admin.ModelAdmin):
    list_display = ("loanid", "investerid", "date", "payment", "voucherno")

class LoandetailsAdmin(admin.ModelAdmin):
    list_display = ("loanid", "investerid", "amount", "interestpermonth", "conditions", "logs")

class LandAdmin(admin.ModelAdmin):
    list_display = ("gher", "mousa", "dag", "khotian", "amount", "plane_land", "par_cannel", "owners", "comment", "logs")

class MousaAdmin(admin.ModelAdmin):
    list_display = ("mousa", "dag", "owner", "date", "amount", "term", "vc_numnber", "status", "log")

class SalaryAdmin(admin.ModelAdmin):
    list_display = ("date", "purpose", "reason", "quantity", "rate", "total", "personel", "voucher", "status", "comment", "logs")

class SectorsAdmin(admin.ModelAdmin):
    list_display = ("sector", "logs")

class SourcesAdmin(admin.ModelAdmin):
    list_display = ("source", "logs")

class UnitsAdmin(admin.ModelAdmin):
    list_display = ("id", "unit", "logs")

class UsersAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "trn_date")

class UsersinfoAdmin(admin.ModelAdmin):
    list_display = ("name", "username", "role", "email", "mobile")

class EarningAdmin(admin.ModelAdmin):
    list_display = ("date", "sector", "item", "source", "quantity_per_unit", "quantity", "unit", "price", "status", "memo", "comment", "logs")

class ItemsAdmin(admin.ModelAdmin):
    list_display = ("sector", "item_name", "logs")

admin.site.register(Cost, CostAdmin)
admin.site.register(Costitems, CostitemsAdmin)
admin.site.register(Costpurpose, CostpurposeAdmin)
admin.site.register(Dailyworks, DailyworksAdmin)
admin.site.register(Fishbuy, FishbuyAdmin)
admin.site.register(Fishtype, FishtypeAdmin)
admin.site.register(Investment, InvestmentAdmin)
admin.site.register(Staff, StaffAdmin)
admin.site.register(Staffs, StaffsAdmin)
admin.site.register(LoanProvidersInfo, LoanProvidersInfoAdmin)
admin.site.register(LoanTransactions, LoanTransactionsAdmin)
admin.site.register(Loandetails, LoandetailsAdmin)
admin.site.register(Land, LandAdmin)
admin.site.register(Mousa, MousaAdmin)
admin.site.register(Salary, SalaryAdmin)
admin.site.register(Sectors, SectorsAdmin)
admin.site.register(Sources, SourcesAdmin)
admin.site.register(Units, UnitsAdmin)
admin.site.register(Users, UsersAdmin)
admin.site.register(Usersinfo, UsersinfoAdmin)
admin.site.register(Earning, EarningAdmin)
admin.site.register(Items, ItemsAdmin)