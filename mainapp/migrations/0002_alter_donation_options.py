# Generated by Django 3.2.8 on 2021-11-18 12:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('mainapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='donation',
            options={'ordering': ('is_taken', '-pick_up_time', '-created')},
        ),
    ]