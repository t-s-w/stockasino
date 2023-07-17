from django.contrib.auth.models import User
from .models import Profile
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import ModelSerializer

class LoginTokenPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
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
