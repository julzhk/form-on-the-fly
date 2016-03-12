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
                }
            }


class CheckboxElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form, default=Form.objects.first())

    def to_json(self):
        return {
              'key': self.label,
              'type': 'checkbox',
              'templateOptions': {
                'label': self.label,
              }
            }


class TextElement(models.Model):
    order = models.IntegerField(default=0)
    placeholder = models.TextField()
    form = models.ForeignKey(Form,default=Form.objects.first())

    def to_json(self):
        return { "type": "textarea",
                 "key": self.placeholder,
                 "templateOptions": {
                     "type": "text",
                     "placeholder": self.placeholder,
                     "rows":6
                 } }


class RadioElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form,default=Form.objects.first())


    def to_json(self):
        options = RadioItem.objects.filter(radioelement=self)
        option_data = [opt.to_json() for opt in options]
        return { "key": "triedEmber",
                 "type": "radio",
                 "templateOptions": {
                     "label": "Have you tried EmberJs yet?",
                     "options": option_data
                    }
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
    def to_json(self):
        return { "key": "marvel3",
                 "type": "select",
                 "templateOptions": {
                     "label": "Select with custom name/value/group",
                     "options": [
                         { "label": "Iron Man", "id": "iron_man", "gender": "Male" },
                         { "label": "Captain America", "id": "captain_america", "gender": "Male" },
                         { "label": "Black Widow", "id": "black_widow", "gender": "Female" },
                         { "label": "Hulk", "id": "hulk", "gender": "Male" },
                         { "label": "Captain Marvel", "id": "captain_marvel", "gender": "Female" }
                        ],
                     "groupProp": "gender",
                     "valueProp": "id",
                     "labelProp": "label"
                 }
                 }

class DropdownItem(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    value = models.CharField(max_length=255,default='label')
    dropdown = models.ForeignKey(DropdownElement)
    selected = models.BooleanField(default=False)


class RangeElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    min = models.IntegerField(default=0)
    max = models.IntegerField(default=100)
    step = models.IntegerField(default=1)
    initial_value = models.IntegerField(default=50)
    form = models.ForeignKey(Form)

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
                   }
                   }
