from rest_framework import serializers
from .models import Cost, Fishbuy

class CostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cost
        fields = (
            'date', 'costcategory', 'costitems', 'buyamount',
            'unit', 'cost', 'status', 'buyer', 'buyvoucher',
            'comment', 'logs', 'costitems_id'
        )
        
class FishbuySerializer(serializers.ModelSerializer):
    class Meta:
        model = Fishbuy
        fields = (
            'id','date', 'fishname', 'buyfrom', 'buyamount',
            'fishquantity', 'price', 'status', 'fishto', 'vouchar',
            'comments', 'logs'
        )