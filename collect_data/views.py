from django.shortcuts import render, HttpResponse
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def post_data(request):
    data = json.loads(request.body)
    print data
    return HttpResponse('ok')