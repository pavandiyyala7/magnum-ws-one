# Generated by Django 5.0.7 on 2024-12-19 05:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0009_alter_autoshift_lunch_duration_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='autoshift',
            name='shift_id',
            field=models.CharField(default=None, max_length=10),
            preserve_default=False,
        ),
    ]
