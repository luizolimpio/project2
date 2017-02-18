# python imports
import json
import locale
import sys
import traceback
import os

# django imports
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core.mail import EmailMessage
from django.http import HttpResponse, HttpResponseServerError
from django.shortcuts import render_to_response
from django.template import loader
from django.template import RequestContext
from django.db.models import Q
# lfs imports
from django.views.generic import TemplateView
from lfs.caching.utils import lfs_get_object_or_404
from lfs.core.models import Shop
from lfs.catalog.models import Category
from lfs.core.utils import LazyEncoder
from lfs.core.utils import set_category_levels
from lfs.marketing.models import FeaturedProduct
from lfs.marketing.models import Banner

# Load logger
import logging

from lfs.catalog.models import Product

logger = logging.getLogger("default")

def criar_miniatura_imagem(request):
    print (os.system("/home/luiz/lfs_SANTARITA/bin/django lfs_regenerate_thumbs"))

    result = json.dumps({
        "message": (u"Miniaturas de imagens Criadas"),
    }, cls=LazyEncoder)

    return HttpResponse(result, content_type='application/json')

def sort_categories(request):
    """Sort categories
    """
    category_list = Category.objects.all().order_by('name')

    pos = 10
    for cat_str in category_list:
        cat_str.get_all_products_personalizado_para_filtrar_categorias()
        child = cat_str.id
        parent_id = cat_str.parent_id
        if parent_id == None:
            parent_id = 'root'
        child_id = str(child)
        child_obj = Category.objects.get(pk=child_id)
        parent_obj = None
        if parent_id != 'root':
            parent_obj = Category.objects.get(pk=parent_id)
        child_obj.parent = parent_obj
        child_obj.position = pos
        child_obj.save()

        pos = pos + 10

    set_category_levels()

    result = json.dumps({
        "message": (u"Categorias organizadas,ativadas quando populadas e desativadas quando nao populadas"),
    }, cls=LazyEncoder)

    return HttpResponse(result, content_type='application/json')

def shop_view_cidade(request):
    shop = Shop.objects.all()
    for i in shop:
        nome = i.shop_owner
    result = json.dumps({
        "cidade": nome,
    }, cls=LazyEncoder)
    return HttpResponse(result, content_type='application/json')

@login_required
def shop_view(request, template_name="lfs/shop/shop.html"):
    """Displays the shop.
    """
    # TODO: this is not necessary here as we have context processor that sets 'SHOP' variable
    #       this should be removed at some point but is here for backward compatibility


    banners = Banner.objects.filter(ativo=True)


    featured = FeaturedProduct.objects.all()
    featured_ids = [f.product.id for f in featured]

    shop = lfs_get_object_or_404(Shop, pk=1)
    query = (Q(active=True , stock_amount__gte=1 ,pk__in=featured_ids) | Q(active=True , manage_stock_amount=0, pk__in=featured_ids))

    products = Product.objects.filter(query)
    sorting = request.session.get("sorting")


    if sorting:
        products = products.order_by(sorting)

    row = []

    #products = products[0:8]
    total = products.count()

    for product in products:
        if product.is_product_with_variants():
            default_variant = product.get_variant_for_category(request)
            if default_variant:
                product = default_variant
        if product.get_active_packing_unit():
            packing_result = calculate_packing(request, product.id, 1, True, True)
        else:
            packing_result = ""

        packing_amount, packing_unit = product.get_packing_info()
        image = None
        product_image = product.get_image()
        if product_image:
            image = product_image.image
        row.append({
            "obj": product,
            "slug": product.slug,
            "name": product.get_name(),
            "image": image,
            "price_unit": product.get_price_unit(),
            "price_includes_tax": product.price_includes_tax(request),
            "quantity": product.get_clean_quantity(1),
            "unit": packing_unit,
            "packing_result": packing_result,
        })
    products = []
    if len(row) > 0:
        products.append(row)

    _banners = []

    for i,banner in enumerate(banners):
         _banners.append({"imagem":banner.imagem,"link":banner.link,"len":i})

    return render_to_response(template_name, RequestContext(request, {
        "shop": shop,
        "products": products,
        "total": total,
        "banners":_banners,
    }))

def calculate_packing(request, id, quantity=None, with_properties=False, as_string=False, template_name="lfs/catalog/packing_result.html"):
    """Calculates the actual amount of pieces to buy on base on packing
    information.
    """
    product = Product.objects.get(pk=id)

    if quantity is None:
        try:
            quantity = request.POST.get("quantity")
            if isinstance(quantity, unicode):
                # atof() on unicode string fails in some environments, like Czech
                quantity = quantity.encode("utf-8")
            quantity = locale.atof(quantity)
        except (AttributeError, TypeError, ValueError):
            quantity = 1

    packing_amount, packing_unit = product.get_packing_info()

def server_error(request):
    """Own view in order to pass RequestContext and send an error message.
    """
    exc_type, exc_info, tb = sys.exc_info()
    response = "%s\n" % exc_type.__name__
    response += "%s\n" % exc_info
    response += "TRACEBACK:\n"
    for tb in traceback.format_tb(tb):
        response += "%s\n" % tb

    if request.user:
        response += "User: %s\n" % request.user.username

    response += "\nREQUEST:\n%s" % request

    try:
        from_email = settings.ADMINS[0][1]
        to_emails = [a[1] for a in settings.ADMINS]
    except IndexError:
        pass
    else:
        mail = EmailMessage(
            subject="Error LFS", body=response, from_email=from_email, to=to_emails)
        mail.send(fail_silently=True)

    t = loader.get_template('500.html')
    return HttpResponseServerError(t.render(RequestContext(request)))


def one_time_setup():
    lfs_locale = getattr(settings, "LFS_LOCALE", None)
    if lfs_locale:
        try:
            locale.setlocale(locale.LC_ALL, lfs_locale)
        except locale.Error, e:
            logger.error("Unsupported locale in settings.LFS_LOCALE: '%s'." % lfs_locale)


class TextTemplateView(TemplateView):
    def render_to_response(self, context, **kwargs):
        return super(TextTemplateView, self).render_to_response(context,
                        content_type='text/plain', **kwargs)