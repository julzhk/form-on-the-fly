from django.contrib import admin
from formapi.models import (Form, InputElement, DropdownElement, CheckboxElement,
                            RadioElement, TextElement,RadioItem,RangeElement,
                            DropdownItemCategory,DropdownItem)

class FormAdmin(admin.ModelAdmin):
    pass

admin.site.register(Form, FormAdmin)
admin.site.register(InputElement)
admin.site.register(DropdownItemCategory)
admin.site.register(DropdownElement)
admin.site.register(DropdownItem)
admin.site.register(CheckboxElement)
admin.site.register(RadioElement)
admin.site.register(RadioItem)
admin.site.register(TextElement)
admin.site.register(RangeElement)
