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
from formapi.models import Form, FormElement

def form_api(request):

    myform = Form.objects.first()
    elements = FormElement.objects.filter(form=myform)

    data = [ele.to_json() for ele in elements]
    response = JsonResponse(data, safe=False)
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Origin'] = '*'

    return response
