from rest_framework import serializers
from .models import Cost

class CostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cost
        fields = (
            'date', 'costcategory', 'costitems', 'buyamount',
            'unit', 'cost', 'status', 'buyer', 'buyvoucher',
            'comment', 'logs', 'costitems_id'
        )