# import serializer from rest_framework
from rest_framework import serializers
 
# import model from models.py
from .models import Cost
 
# Create a model serializer
class CostSerializer(serializers.HyperlinkedModelSerializer):
    # specify model and fields
    class Meta:
        model = Cost
        fields = ('date', 'costcategory', 'costitems', 'buyamount' ,'unit' , 'cost' ,
    'status' ,
    'buyer' ,
    'buyvoucher' ,
    'comment' ,
    'logs' , 'costitems_id')