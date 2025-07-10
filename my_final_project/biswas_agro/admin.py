from django.contrib import admin
from import_export.admin import ExportMixin
from .models import (
    Cost, Fishbuy, Earning, Investment, Staff, Staffs, LoanTransactions, Loandetails, LoanProvidersInfo, Costitems, Costpurpose,
    Users, Usersinfo, Dailyworks, Fishtype, Items, Land, Mousa, Salary, Sectors, Sources, Units
)
from .resource import (
    EarningResource, CostResource, FishbuyResource, InvestmentResource,
    SalaryResource, DailyworksResource, LoanTransactionsResource
)

class CostAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = CostResource
    list_display = (
        "id", "date", "costcategory", "costitems", "buyamount", "unit", "cost", "status",
        "buyer", "buyvoucher", "comment", "logs", "costitems_id"
    )

class CostitemsAdmin(admin.ModelAdmin):
    list_display = ("id", "sector", "costitems", "logs")

class CostpurposeAdmin(admin.ModelAdmin):
    list_display = ("id", "costpurpose",)

class DailyworksAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = DailyworksResource
    list_display = ("id", "date", "worktype", "item", "amount", "unit", "personel", "comment", "logs")

class FishbuyAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = FishbuyResource
    list_display = (
        "id", "date", "fishname", "buyfrom", "buyamount", "fishquantity", "price", "status", "fishto",
        "vouchar", "comments", "logs"
    )

class FishtypeAdmin(admin.ModelAdmin):
    list_display = ("id", "fishname", "logs")

class InvestmentAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = InvestmentResource
    list_display = ("id", "date", "name", "amount", "comments", "logs")

class StaffAdmin(admin.ModelAdmin):
    list_display = ("staffno", "name", "post", "salary", "address", "mobile", "reference", "log")

class StaffsAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "designation", "address", "mobile")

class LoanProvidersInfoAdmin(admin.ModelAdmin):
    list_display = ("investerid", "name", "address", "mobile", "refference", "logs")

class LoanTransactionsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = LoanTransactionsResource
    list_display = ("loanid", "investerid", "date", "payment", "voucherno")

class LoandetailsAdmin(admin.ModelAdmin):
    list_display = ("loanid", "investerid", "amount", "interestpermonth", "conditions", "logs")

class LandAdmin(admin.ModelAdmin):
    list_display = ("id", "gher", "mousa", "dag", "khotian", "amount", "plane_land", "par_cannel", "owners", "comment", "logs")

class MousaAdmin(admin.ModelAdmin):
    list_display = ("id", "mousa", "dag", "owner", "date", "amount", "term", "vc_numnber", "status", "log")

class SalaryAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = SalaryResource
    list_display = (
        "id", "date", "purpose", "reason", "quantity", "rate", "total", "personel", 
        "voucher", "status", "comment", "logs"
    )

class SectorsAdmin(admin.ModelAdmin):
    list_display = ("id", "sector", "logs")

class SourcesAdmin(admin.ModelAdmin):
    list_display = ("source", "logs")

class UnitsAdmin(admin.ModelAdmin):
    list_display = ("id", "unit", "logs")

class UsersAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "password", "trn_date")

class UsersinfoAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "username", "password", "role", "email", "mobile")

class EarningAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = EarningResource
    list_display = (
        "id", "date", "sector", "item", "source", "quantity_per_unit", "quantity", "unit", "price",
        "status", "memo", "comment", "logs"
    )

class ItemsAdmin(admin.ModelAdmin):
    list_display = ("id", "sector", "item_name", "logs")

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