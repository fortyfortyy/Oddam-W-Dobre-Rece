# Generated by Django 3.2.8 on 2021-11-08 20:04

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('name', models.CharField(max_length=60, unique=True, verbose_name='Category')),
                ('created', models.DateField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Institution',
            fields=[
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Institution')),
                ('description', models.CharField(max_length=500, verbose_name='Description')),
                ('type', models.CharField(choices=[('FUNDACJA', 'Fundacja'), ('ORGANIZACJA POZARZĄDOWA', 'Organizacja Pozarządowa'), ('ZBIÓRKA LOKALNA', 'Zbiórka Lokalna')], default='FUNDACJA', max_length=23)),
                ('created', models.DateField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('categories', models.ManyToManyField(related_name='institution_categories', to='mainapp.Category')),
            ],
        ),
        migrations.CreateModel(
            name='Donation',
            fields=[
                ('quantity', models.SmallIntegerField(default=1, verbose_name='Quantity')),
                ('address', models.CharField(max_length=200, verbose_name='Address')),
                ('phone_number', models.CharField(max_length=12, verbose_name='Phone Number')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('post_code', models.CharField(max_length=6, verbose_name='Post Code')),
                ('pick_up_date', models.DateField(verbose_name='Pick Up Date')),
                ('pick_up_time', models.TimeField(verbose_name='Pick Up Time')),
                ('pick_up_comment', models.CharField(blank=True, max_length=500, verbose_name='Pick Up Comment')),
                ('is_taken', models.BooleanField(default=False)),
                ('created', models.DateField(auto_now=True)),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('categories', models.ManyToManyField(related_name='donation_categories', to='mainapp.Category')),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='mainapp.institution')),
                ('user', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('-pick_up_time',),
            },
        ),
    ]
