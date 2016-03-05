from django.contrib import admin
from formapi.models import Form,FormElement

class FormAdmin(admin.ModelAdmin):
    pass

admin.site.register(Form, FormAdmin)
admin.site.register(FormElement)
