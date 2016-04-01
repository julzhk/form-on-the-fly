"""formserver URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import include, url
from django.contrib import admin
from formapi.views import form_api, form_names_api, form_schema_all
from rest_framework_nested import routers

from authentication.views import AccountViewSet
from authentication.views import LoginView

from formapi.views import FormViewSet
from collect_data.views import post_data
from django.conf import settings
from django.conf.urls.static import static
from form_generator.views import form_generator
from django.shortcuts import HttpResponseRedirect

from content.views import home
router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'forms', FormViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/names', form_names_api),
    url(r'^formgen', form_generator),
    url(r'^api/post', post_data),
    url(r'^api/all', form_schema_all),
    url(r'^api/(?P<form_id>\d+)', form_api),

]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
