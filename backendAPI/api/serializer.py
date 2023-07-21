from django.contrib.auth.models import User
from .models import Profile, Game, Transaction
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import ModelSerializer
import datetime


def get_current_month():
    now = datetime.datetime.now()
    return datetime.date(now.year,now.month,1)

class LoginTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        currentGame = Game.objects.get(user=user,month=get_current_month())
        token = super().get_token(user)
        token['username'] = user.username
        if currentGame:
            currentGame.update_balance()
        return token
    
class SignupSerializer(ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True,validators = [validate_password]
    )
    email = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ('username','password','email')
    
    def create(self, signupInfo):
        user = User.objects.create_user(**signupInfo)

        profile = Profile.objects.create(
            user = user
        )
        profile.save()
        tokens = LoginTokenPairSerializer.get_token(user)
        data = {"refresh":str(tokens), "access":str(tokens.access_token)}
        return data
    
    def to_representation(self,instance):
        return instance
    
class GameSerializer(ModelSerializer):
    
    class Meta:
        model = Game
        fields = ('month', 'currentBalance', 'id','ended')

    def create(self,user):
        return Game.objects.create(**user)

class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transaction
        fields = ('game','quantity','unitprice','ticker','type','created')

class GameTransactionSerializer(ModelSerializer):
    transaction_set = TransactionSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()
    class Meta:
        model = Game
        fields = ('id','month','currentBalance','ended','transaction_set','user')

class TickerSearchSerializer(serializers.Serializer):
    exchange = serializers.CharField(required=False)
    shortname = serializers.CharField(required=False)
    longname = serializers.CharField()
    quoteType = serializers.CharField(required=False)
    symbol = serializers.CharField()
    index = serializers.CharField(required=False)
    typeDisp = serializers.CharField(required=False)
    exchDisp = serializers.CharField(required=False)
    sector = serializers.CharField(required=False)
    industry = serializers.CharField(required=False)
