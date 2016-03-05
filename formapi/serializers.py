from django.contrib.auth import update_session_auth_hash
from rest_framework import serializers
from formapi.models import Form, FormElement


class FormSerializer(serializers.ModelSerializer):

    class Meta:
        model = Form
        # read_only_fields = ('id', 'email' 'first_name', 'last_name' )

        def create(self, validated_data):
            return Form.objects.create(**validated_data)

        def update(self, instance, validated_data):
            # instance.username = validated_data.get('username', instance.username)
            # instance.tagline = validated_data.get('tagline', instance.tagline)
            instance.save()
            # password = validated_data.get('password', None)
            # confirm_password = validated_data.get('confirm_password', None)
            # if password and confirm_password and password == confirm_password:
            #     instance.set_password(password)
            #     instance.save()
            # update_session_auth_hash(self.context.get('request'), instance)
            return instance
