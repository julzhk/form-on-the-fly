import os
from django.db import models
class Form(models.Model):
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return 'form: %s' % (self.name)

class InputElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    placeholder = models.CharField(max_length=255,default='placeholder',blank=True)
    hidden = models.BooleanField(default=False)
    show_on_listview = models.BooleanField(default=True)
    form = models.ForeignKey(Form,default=Form.objects.first())

    def to_json(self):
            return {
                "key": self.label,
                "type": 'input',
                "hide": self.hidden,
                "templateOptions": {
                    "icon": "ion-person",
                     "iconPlaceholder": True,
                    "label": self.label,
                    "placeholder": self.placeholder,
                },
                "extras":{"show_on_listview":self.show_on_listview}
            }


class CheckboxElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form, default=Form.objects.first())
    show_on_listview = models.BooleanField(default=True)

    def to_json(self):
        return {
              'key': self.label,
              'type': 'checkbox',
              'templateOptions': {
                'label': self.label,
              },
            "extras":{"show_on_listview":self.show_on_listview}
            }


class TextElement(models.Model):
    order = models.IntegerField(default=0)
    placeholder = models.TextField()
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form,default=Form.objects.first())
    show_on_listview = models.BooleanField(default=True)

    def to_json(self):
        return { "type": "textarea",
                 "key": self.placeholder,
                 "templateOptions": {
                     "type": "text",
                     "label":self.label,
                     "placeholder": self.placeholder,
                     "rows":6
                 },
                 "extras":{"show_on_listview":self.show_on_listview}
                }


class RadioElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form,default=Form.objects.first())
    show_on_listview = models.BooleanField(default=True)

    def to_json(self):
        options = RadioItem.objects.filter(radioelement=self)
        option_data = [opt.to_json() for opt in options]
        return { "key": "triedEmber",
                 "type": "radio",
                 "templateOptions": {
                     "label": "Have you tried EmberJs yet?",
                     "options": option_data
                    },
                 "extras":{"show_on_listview":self.show_on_listview}
                 }


class RadioItem(models.Model):
    order = models.IntegerField(default=0)
    text = models.CharField(max_length=255,default='label')
    radioelement = models.ForeignKey(RadioElement)

    def to_json(self):
        return { "value": self.text,
                 "text": self.text,
                 "icon": "ion-home"
                 }


class DropdownElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form,default=Form.objects.first())
    show_on_listview = models.BooleanField(default=True)
    def to_json(self):
        options = DropdownItem.objects.filter(dropdown=self)
        option_data = [opt.to_json() for opt in options]

        return { "key": self.label,
                 "type": "select",
                 "templateOptions": {
                     "label": self.label,
                     "options": option_data,
                     "groupProp": "category",
                     "valueProp": "id",
                     "labelProp": "label"
                 },
                 "extras":{"show_on_listview":self.show_on_listview}
                 }

class DropdownItemCategory(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')

    def to_json(self):
        return u"%s" % self.label


class DropdownItem(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    value = models.CharField(max_length=255,default='label')
    category = models.ForeignKey(DropdownItemCategory)
    dropdown = models.ForeignKey(DropdownElement)
    selected = models.BooleanField(default=False)

    def to_json(self):
        return { "label": self.label,
                 "id": self.id,
                 "category": self.category.to_json()
                 }


class RangeElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    min = models.IntegerField(default=0)
    max = models.IntegerField(default=100)
    step = models.IntegerField(default=1)
    initial_value = models.IntegerField(default=50)
    form = models.ForeignKey(Form)
    show_on_listview = models.BooleanField(default=True)

    def to_json(self):
        return { "key": self.label,
                   "type": "range",
                   "templateOptions": {
                       "label": self.label,
                       "rangeClass": "calm",
                       "min": self.min,
                       "max": self.max,
                       "step": self.step,
                       "value": self.initial_value,
                       "minIcon": "ion-volume-low",
                       "maxIcon": "ion-volume-high"
                    },
                 "extras":{"show_on_listview":self.show_on_listview}
               }
