from django.contrib.auth.models import AbstractBaseUser
from django.db import models

from django.contrib.auth.models import BaseUserManager, PermissionsMixin


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')
        account = self.model(email=self.normalize_email(email))
        account.set_password(password)
        account.save()
        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)
        account.is_admin = True
        account.is_staff = True
        account.is_superuser = True
        account.save()
        return account

class Account(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    email = models.EmailField(unique=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name','last_name']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return u'%s %s ' % (self.first_name, self.last_name)

    def get_short_name(self):
        return self.first_name

    def save(self, *args, **kwargs):
        try:
            oldpw = Account.objects.get(id=self.id).password
        except Account.DoesNotExist:
            oldpw = '??????'
        if self.password != oldpw:
            self.set_password(self.password)
        return super(Account, self).save(*args, **kwargs)
