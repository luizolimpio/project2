# django imports
from django.db import models
from django.utils.translation import ugettext_lazy as _, ugettext

# lfs imports
from lfs.catalog.models import Product
from lfs.order.models import Order
from django.shortcuts import resolve_url



class Topseller(models.Model):
    """Selected products are in any case among topsellers.
    """
    product = models.ForeignKey(Product, verbose_name=_(u"Product"))
    position = models.PositiveSmallIntegerField(_(u"Position"), default=1)

    class Meta:
        ordering = ["position"]

    def __unicode__(self):
        return u"%s (%s)" % (self.product.name, self.position)


class ProductSales(models.Model):
    """Stores totals sales per product.
    """
    product = models.ForeignKey(Product, verbose_name=_(u"Product"))
    sales = models.IntegerField(_(u"sales"), default=0)


class FeaturedProduct(models.Model):
    """Featured products are manually selected by the shop owner
    """
    product = models.ForeignKey(Product, verbose_name=_(u"Product"))
    position = models.PositiveSmallIntegerField(_(u"Position"), default=1)
    active = models.BooleanField(_(u"Active"), default=True)

    class Meta:
        ordering = ["position"]

    def __unicode__(self):
        return u"%s (%s)" % (self.product.name, self.position)

class Banner(models.Model):
    """Banner
    """
    imagem = models.CharField(_(u"Imagem"), max_length=255, blank=False)
    link  = models.CharField(_(u"link"), max_length=255, blank=False)
    ativo = models.BooleanField(_(u"Ativo"), default=True)


    def url_update(self):
        url = resolve_url("lfs_banner_view_update",self.pk)
        return url

    def url_delete(self):
        url = resolve_url("lfs_banner_view_delete", self.pk)
        return url

    def __str__(self):
        return self.imagem

class Replacebusca(models.Model):
    """Replacebusca
    """
    termo = models.CharField(_(u"Termo"), max_length=255, blank=True,unique=True)
    novotermo  = models.CharField(_(u"Novo termo"), max_length=255, blank=True)

    def url_update(self):
        url = resolve_url("lfs_replacebusca_view_update",self.pk)
        return url

    def url_delete(self):
        url = resolve_url("lfs_replacebusca_view_delete", self.pk)
        return url

    def __str__(self):
        return self.termo


class OrderRatingMail(models.Model):
    """Saves whether and when a rating mail has been send for an order.
    """
    order = models.ForeignKey(Order, verbose_name=_(u"Order"))
    send_date = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return u"%s (%s)" % (self.order.id, self.send_date.strftime(ugettext('DATE_FORMAT')))
