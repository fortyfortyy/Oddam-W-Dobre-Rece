from django.db import models
from django.utils.translation import gettext_lazy as _

import uuid
from users.models import Profile


class Category(models.Model):
    name = models.CharField(_('Category'), max_length=60, unique=True)
    created = models.DateField(auto_now=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    def __str__(self):
        return self.name


class Institution(models.Model):
    TYPE_CHOICES = (
        ("FUNDACJA", "Fundacja"),
        ("ORGANIZACJA POZARZĄDOWA", "Organizacja Pozarządowa"),
        ("ZBIÓRKA LOKALNA", "Zbiórka Lokalna"),
    )
    name = models.CharField(_('Institution'), max_length=100, unique=True)
    description = models.CharField(_('Description'), max_length=500)
    type = models.CharField(max_length=23, choices=TYPE_CHOICES, default="FUNDACJA")
    categories = models.ManyToManyField(Category, related_name='institution_categories')
    created = models.DateField(auto_now=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    def __str__(self):
        return self.name


class Donation(models.Model):
    quantity = models.SmallIntegerField(_('Quantity'), default=1)
    address = models.CharField(_('Address'), max_length=200)
    phone_number = models.CharField(_('Phone Number'), max_length=12)
    city = models.CharField(_('City'), max_length=100)
    post_code = models.CharField(_('Post Code'), max_length=6)
    pick_up_date = models.DateField(_('Pick Up Date'), auto_now=False)
    pick_up_time = models.TimeField(_('Pick Up Time'), auto_now=False)
    pick_up_comment = models.CharField(_('Pick Up Comment'), max_length=500, blank=True)

    user = models.ForeignKey(Profile, on_delete=models.CASCADE, default=None)
    categories = models.ManyToManyField(Category, related_name='donation_categories')
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    is_taken = models.BooleanField(default=False)
    created = models.DateField(auto_now=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True,
                          primary_key=True, editable=False)

    class Meta:
        ordering = ('is_taken', '-pick_up_time', '-created')

