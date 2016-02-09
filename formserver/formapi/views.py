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


def form_api(request):
    data = [
    {"key": "email",
    "type": "input",
    "templateOptions": {
      "label": "Email address",
      "placeholder": "Enter email"
      }
    },
    {
    "key": "password",
    "type": "input",
    "templateOptions": {
    "type": "password",
    "label": "Password",
    "placeholder": "Password"
    }
    },
    {
    "key": "checked",
    "type": "checkbox",
    "templateOptions": {
      "label": "Check me out"
      }
    },
        {
    "key": "checked2",
    "type": "checkbox",
    "templateOptions": {
      "label": "Check me out too"
      }
    },
         {
    "key": "checked3",
    "type": "checkbox",
    "templateOptions": {
      "label": "Check me out three"
      }
    },
    ]
    response = JsonResponse(data, safe=False)
    response['Access-Control-Allow-Headers'] = 'Content-Type'
    response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    response['Access-Control-Allow-Origin'] = '*'

    return response
