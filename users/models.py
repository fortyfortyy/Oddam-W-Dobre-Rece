from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.sites.models import Site
from django.core.validators import validate_email
from django.db import models
from django.utils.translation import gettext_lazy as _

import uuid


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

    def __str__(self):
        return self.get_full_name()
