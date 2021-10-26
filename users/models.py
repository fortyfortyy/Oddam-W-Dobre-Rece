from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.sites.models import Site
from django.core.validators import validate_email
from django.db import models
from django.utils.translation import gettext_lazy as _

import uuid


class MyAccountManager(BaseUserManager):
    """
    Custom user model manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    def create_user(self, email, first_name, last_name, site=None, password=None):
        """
        Create and save a User with the given email and password and username.
        """
        if not email:
            raise ValueError("User must have an email address.")
        if not first_name:
            raise ValueError("User must have a first name.")
        if not last_name:
            raise ValueError("User must have a last name.")
        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            site=Site.objects.get_current(),
        )
        user.is_admin = False
        user.is_superuser = False
        user.is_staff = False
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password):

        if password is None:
            raise TypeError('Superusers must have a password.')
        user = self.create_user(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            password=password,
        )
        user.is_admin = True
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class Profile(AbstractUser):
    email = models.EmailField(
        _('email address'),
        max_length=255,
        unique=True,
        validators=[validate_email],
    )
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    objects = MyAccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        ordering = ['-date_joined']

    def __str__(self):
        return self.get_full_name()
