from django.contrib import admin
from import_export.admin import ExportMixin
from .models import (
    Cost, Fishbuy, Earning, Investment, Staff, Staffs, LoanTransactions, Loandetails, LoanProvidersInfo, Costitems, Costpurpose,
    Users, Usersinfo, Dailyworks, Fishtype, Items, Land, Mousa, Salary, Sectors, Sources, Units
)
from .resource import (
    EarningResource, CostResource, FishbuyResource, InvestmentResource,
    SalaryResource, DailyworksResource, LoanTransactionsResource, CostitemsResource, CostpurposeResource, FishtypeResource, StaffResource,
    StaffsResource, LoanProvidersInfoResource, LoandetailsResource, LandResource, SectorsResource, SourcesResource, UnitsResource, UsersResource,
    UsersinfoResource, ItemsResource
)
from django.utils.timezone import now

class CostAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = CostResource
    list_display = (
        "id", "date", "costcategory", "costitems", "buyamount", "unit", "cost", "status",
        "buyer", "buyvoucher", "comment", "logs", "costitems_id"
    )
    
    def save_model(self, request, obj, form, change):
        # Only set logs if it's empty (i.e. the first creation)
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class CostitemsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = CostitemsResource
    list_display = ("id", "sector", "costitems", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class CostpurposeAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = CostpurposeResource
    list_display = ("id", "costpurpose",)

class DailyworksAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = DailyworksResource
    list_display = ("id", "date", "worktype", "item", "amount", "unit", "personel", "comment", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class FishbuyAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = FishbuyResource
    list_display = (
        "id", "date", "fishname", "buyfrom", "buyamount", "fishquantity", "price", "status", "fishto",
        "vouchar", "comments", "logs"
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class FishtypeAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = FishtypeResource
    list_display = ("id", "fishname", "logs")

    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class InvestmentAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = InvestmentResource
    list_display = ("id", "date", "name", "amount", "comments", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class StaffAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = StaffResource
    list_display = ("staffno", "name", "post", "salary", "address", "mobile", "reference", "log")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class StaffsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = StaffsResource
    list_display = ("id", "name", "designation", "address", "mobile")

class LoanProvidersInfoAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = LoanProvidersInfoResource
    list_display = ("investerid", "name", "address", "mobile", "refference", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class LoanTransactionsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = LoanTransactionsResource
    list_display = ("loanid", "investerid", "date", "payment", "voucherno")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class LoandetailsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = LoandetailsResource
    list_display = ("loanid", "investerid", "amount", "interestpermonth", "conditions", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class LandAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = LandResource
    list_display = ("id", "gher", "mousa", "dag", "khotian", "amount", "plane_land", "par_cannel", "owners", "comment", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class MousaAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = Mousa 
    list_display = ("id", "mousa", "dag", "owner", "date", "amount", "term", "vc_numnber", "status", "log")
    
    def save_model(self, request, obj, form, change):
        if not obj.log:
            obj.log = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class SalaryAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = SalaryResource
    list_display = (
        "id", "date", "purpose", "reason", "quantity", "rate", "total", "personel", 
        "voucher", "status", "comment", "logs"
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class SectorsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = SectorsResource
    list_display = ("id", "sector", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class SourcesAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = SourcesResource
    list_display = ("source", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class UnitsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = UnitsResource
    list_display = ("id", "unit", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class UsersAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = UsersResource
    list_display = ("id", "username", "email", "password", "trn_date")

class UsersinfoAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = UsersinfoResource
    list_display = ("id", "name", "username", "password", "role", "email", "mobile")

class EarningAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = EarningResource
    list_display = (
        "id", "date", "sector", "item", "source", "quantity_per_unit", "quantity", "unit", "price",
        "status", "memo", "comment", "logs"
    )
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

class ItemsAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = ItemsResource
    list_display = ("id", "sector", "item_name", "logs")
    
    def save_model(self, request, obj, form, change):
        if not obj.logs:
            obj.logs = f"{request.user.username} {now().strftime('%Y-%m-%d %H:%M:%S')}"
        super().save_model(request, obj, form, change)

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