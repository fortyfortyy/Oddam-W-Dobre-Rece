from django.contrib import admin
from mainapp.models import Donation, Category, Institution

# Register your models here.
admin.site.register(Donation)
admin.site.register(Category)
admin.site.register(Institution)
