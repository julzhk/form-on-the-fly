from django.shortcuts import render

# Create your views here.

def form_generator(request):
    return render(request=request,template_name='form_generator.html')