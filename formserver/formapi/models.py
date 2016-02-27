import os
from django.db import models

class Form(models.Model):
    name = models.CharField(max_length=255)
    def __unicode__(self):
        return 'form: %s' % (self.name)


class FormElement(models.Model):
    form = models.ForeignKey(Form)
    order= models.IntegerField(auto_created=True)
    key = models.CharField(max_length=255, unique=True,default='', help_text='add a hidden field with '
                                                                        'key=user_email to auto-capture contributor '
                                                                        'email address')
    type = models.CharField(max_length=32, default='input',
                                            choices=[('input', 'input'),
                                                    ('checkbox', 'checkbox'),
                                                    ('password', 'password')
                                                    ])
    label= models.CharField(max_length=255,default='label')
    placeholder= models.CharField(max_length=255,default='placeholder',blank=True)
    hidden= models.BooleanField(default=False)

    def to_json(self):
        return {
            "key": self.key,
            "type": self.type,
            "hide": self.hidden,
            "templateOptions": {
                "label": self.label,
                "placeholder": self.placeholder,
            }
        }

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return '%s %s %s' % (self.form, self.type, self.label)
