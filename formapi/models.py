import os
from django.db import models

from django.db import models
# from django.contrib.contenttypes.fields import GenericForeignKey
# from django.contrib.contenttypes.models import ContentType

from django.utils.deconstruct import deconstructible


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

class CheckboxElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form, default=Form.objects.first())

class CheckboxItem(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    choiceelement = models.ForeignKey(CheckboxElement)

class TextItem(models.Model):
    order = models.IntegerField(default=0)
    text = models.TextField()
    form = models.ForeignKey(Form,default=Form.objects.first())

class RadioElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form,default=Form.objects.first())

class RadioItem(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    selected = models.BooleanField(default=False)
    radioelement = models.ForeignKey(RadioElement)

class DropdownElement(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    form = models.ForeignKey(Form,default=Form.objects.first())

class DropdownItem(models.Model):
    order = models.IntegerField(default=0)
    label = models.CharField(max_length=255,default='label')
    value = models.CharField(max_length=255,default='label')
    dropdown = models.ForeignKey(DropdownElement)
    selected = models.BooleanField(default=False)


