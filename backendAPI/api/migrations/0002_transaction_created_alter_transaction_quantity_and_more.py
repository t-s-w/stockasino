# Generated by Django 4.2.3 on 2023-07-21 01:46

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='created',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='quantity',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='ticker',
            field=models.CharField(blank=True, max_length=10),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='unitprice',
            field=models.DecimalField(decimal_places=2, max_digits=10),
        ),
    ]
