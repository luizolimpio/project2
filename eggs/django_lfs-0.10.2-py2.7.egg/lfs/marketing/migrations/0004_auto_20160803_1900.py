# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('marketing', '0003_auto_20160803_1724'),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='ativo',
            field=models.BooleanField(default=True, verbose_name='Ativo'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='imagem',
            field=models.CharField(help_text='The name of the product.', max_length=255, verbose_name='Imagem'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='link',
            field=models.CharField(help_text='The name of the product.', max_length=255, verbose_name='link'),
        ),
    ]
