import os
from django.db import models

class Form(models.Model):
    name = models.CharField(max_length=255)
    def __unicode__(self):
        return 'form: %s' % (self.name)


class FormElement(models.Model):
    form = models.ForeignKey(Form)
    order= models.IntegerField(auto_created=True)
    key = models.CharField(max_length=255, unique=True,default='')
    type = models.CharField(max_length=32, default='input',
                                            choices=[('input', 'input'),
                                                    ('checkbox', 'checkbox'),
                                                    ('password', 'password')
                                                    ])
    label= models.CharField(max_length=255,default='label')
    placeholder= models.CharField(max_length=255,default='placeholder')

    class Meta:
        ordering = ['order']

    def __unicode__(self):
        return '%s %s %s' % (self.form, self.type, self.label)
