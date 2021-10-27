from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'is_staff', 'last_login')
    search_fields = ('first_name', 'last_name', 'email', 'is_staff')
    readonly_fields = ('id', 'date_joined', 'last_login')
