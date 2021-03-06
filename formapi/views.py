from django.shortcuts import render, HttpResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django import forms
from django.forms import ModelForm
import json
from django.shortcuts import render
from django.http import JsonResponse
from formapi.models import Form

from rest_framework import permissions, viewsets
from formapi.serializers import FormSerializer
from django.http import HttpResponse
from rest_framework import status, views
import json
from django.contrib.auth import authenticate, login
from rest_framework import status, views
from rest_framework.response import Response
from formapi.models import (InputElement, CheckboxElement,
                            TextElement,RadioElement,DropdownElement,
                            RangeElement
                            )
def get_num(x):
    return int(''.join(ele for ele in x if ele.isdigit()))

def form_api(request,form_id):
    data = []
    if request.method == 'GET':
        myform = Form.objects.get(id=int(form_id))
        data = myform.to_json()
    response = JsonResponse(data, safe=False)
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Origin'] = '*'
    return response



def form_names_api(request):
    # form_id
    forms = Form.objects.all()
    data = [{'name':myform.name,'_id':myform.id} for myform in forms]
    response = JsonResponse(data, safe=False)
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Origin'] = '*'
    return response

def form_schema_all(request):
    # forms schema
    forms = Form.objects.all()
    data = [myform.to_json() for myform in forms]
    response = JsonResponse(data, safe=False)
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Origin'] = '*'
    return response


class IsAccountOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, account):
        if request.user:
            return account == request.user
        return False

class FormViewSet(viewsets.ModelViewSet):
    lookup_field = 'id'
    queryset = Form.objects.all()
    serializer_class = FormSerializer

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)

        if self.request.method == 'POST':
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsAccountOwner(),)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            Form.objects.create(**serializer.validated_data)
            return HttpResponse(serializer.validated_data,
                                status=status.HTTP_201_CREATED)
        return HttpResponse({
            'status': 'Bad request',
            'message': 'Form could not be created with received data.'
        }, status=status.HTTP_400_BAD_REQUEST)
