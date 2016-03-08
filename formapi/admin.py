from django.contrib import admin
from formapi.models import Form, InputElement, DropdownElement, CheckboxElement, RadioElement

class FormAdmin(admin.ModelAdmin):
    pass

admin.site.register(Form, FormAdmin)
admin.site.register(InputElement)
admin.site.register(DropdownElement)
admin.site.register(CheckboxElement)
admin.site.register(RadioElement)
