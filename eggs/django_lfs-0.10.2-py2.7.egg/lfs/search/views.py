import json
import locale

# django imports
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.template.loader import render_to_string

# lfs imports
from lfs.catalog.models import Product
from lfs.catalog.settings import STANDARD_PRODUCT, PRODUCT_WITH_VARIANTS, VARIANT
import unicodedata

from lfs.marketing.models import Replacebusca


def livesearch(request, template_name="lfs/search/livesearch_results.html"):
    """
    """
    q = request.GET.get("q", "")
    try:
        q = unicodedata.normalize('NFKD', q).encode('ascii', 'ignore')
    except:
        q = q

    if q == "" or q == " " or q == "  " or q == "   " or q == "    " :
        result = json.dumps({
            "state": "failure",
        })
    else:
        # Products
        query = Q()
        # Products

        q = q.upper()
        p = q.split()

        termos_remover = ['DE','DO','DA', 'PARA','POR', 'EM', 'COM', 'PRA']
        for remover in termos_remover:
            for i in p:
                if remover == i:
                    p.remove(i)

        for replace in Replacebusca.objects.all():
            for i, termos_busca in enumerate(p):
                if termos_busca == replace.termo:
                    p[i] = replace.novotermo

        print p

        if p:
            verificar_termo_tem_produtos = varrer_termos_validos(p)
        else:
            result = json.dumps({
                "state": "failure",
            })
            return HttpResponse(result, content_type='application/json')


        temp = verificar_termo_tem_produtos
        sorting = request.session.get("sorting")

        if sorting == None:
            sorting = 'effective_price'
        temp = temp.order_by(sorting)
        total = temp.count()
        products = temp[0:4]

        products = render_to_string(template_name, RequestContext(request, {
            "products": products,
            "q": q,
            "total": total,
        }))

        result = json.dumps({
            "state": "success",
            "products": products,
        })
    return HttpResponse(result, content_type='application/json')

def search(request, template_name="lfs/search/search_results.html"):
    """Returns the search result according to given query (via get request)
    ordered by the globally set sorting.
    """
    q = request.GET.get("q", "")
    try:
        q = unicodedata.normalize('NFKD', q).encode('ascii', 'ignore')
    except:
        q = q

    if q == "" or q == " " or q == "  " or q == "   " or q == "    " :
        return render_to_response(template_name, RequestContext(request, {
            "products": {},
            "q": q,
            "total": 0,
        }))

    else:
        query = Q()
        # Products

        q = q.upper()
        p = q.split()

        termos_remover = ['DE','DO','DA', 'PARA','POR', 'EM', 'COM', 'PRA']
        for remover in termos_remover:
            for i in p:
                if remover == i:
                    p.remove(i)

        for replace in Replacebusca.objects.all():
            for i, termos_busca in enumerate(p):
                if termos_busca == replace.termo:
                    p[i] = replace.novotermo

        if p:
            verificar_termo_tem_produtos = varrer_termos_validos(p)
            temp = verificar_termo_tem_produtos
            sorting = request.session.get("sorting")

            if sorting == None:
                sorting = 'effective_price'

            if sorting:
                products = temp.order_by(sorting)
            temp = temp.order_by(sorting)
            products = temp[0:240]
            total = products.count()
            row = []
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



            return render_to_response(template_name, RequestContext(request, {
                "products": products,
                "q": q,
                "total": total,
            }))
        else:
            return render_to_response(template_name, RequestContext(request, {
                "products": {},
                "q": q,
                "total": 0,
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

def query_produto(p):
    query = Q()
    if len(p) >= 4:
        query = (Q(active=True, stock_amount__gte=1) | Q(active=True, manage_stock_amount=0)) & \
                (Q(name__icontains=p[0]) & Q(name__icontains=p[1]) & Q(name__icontains=p[2]) & Q(name__icontains=p[3]) |
                 Q(manufacturer__name__icontains=p[0]) & Q(manufacturer__name__icontains=p[1]) & Q(
                     manufacturer__name__icontains=p[2]) & Q(manufacturer__name__icontains=p[3]) |
                 Q(sku_manufacturer__icontains=p[0]) & Q(sku_manufacturer__icontains=p[1]) & Q(
                     sku_manufacturer__icontains=p[2]) & Q(sku_manufacturer__icontains=p[3])
                 )  # & \
        # Q(sub_type__in=(STANDARD_PRODUCT, PRODUCT_WITH_VARIANTS, VARIANT))
    if len(p) == 3:
        query = (Q(active=True, stock_amount__gte=1) | Q(active=True, manage_stock_amount=0)) & \
                (Q(name__icontains=p[0]) & Q(name__icontains=p[1]) & Q(name__icontains=p[2]) |
                 Q(manufacturer__name__icontains=p[0]) & Q(manufacturer__name__icontains=p[1]) & Q(
                     manufacturer__name__icontains=p[2]) |
                 Q(sku_manufacturer__icontains=p[0]) & Q(sku_manufacturer__icontains=p[1]) & Q(
                     sku_manufacturer__icontains=p[2])
                 )  # & \
    if len(p) == 2:
        # Q(sub_type__in=(STANDARD_PRODUCT, PRODUCT_WITH_VARIANTS, VARIANT))
        query = (Q(active=True, stock_amount__gte=1) | Q(active=True, manage_stock_amount=0)) & \
                (Q(name__icontains=p[0]) & Q(name__icontains=p[1]) |
                 Q(manufacturer__name__icontains=p[0]) & Q(manufacturer__name__icontains=p[1]) |
                 Q(sku_manufacturer__icontains=p[0]) & Q(sku_manufacturer__icontains=p[1])
                 )  # & \
    if len(p) == 1:
        # Q(sub_type__in=(STANDARD_PRODUCT, PRODUCT_WITH_VARIANTS, VARIANT))
        query = (Q(active=True, stock_amount__gte=1) | Q(active=True, manage_stock_amount=0)) & \
                (Q(name__icontains=p[0]) |
                 Q(manufacturer__name__icontains=p[0]) |
                 Q(sku_manufacturer__icontains=p[0])
                 )  # & \
        # Q(sub_type__in=(STANDARD_PRODUCT, PRODUCT_WITH_VARIANTS, VARIANT))
    return query


def varrer_termos_validos(p):
    verificar_termo_tem_produtos = False
    while bool(verificar_termo_tem_produtos) == False:
        query = query_produto(p)
        verificar_termo_tem_produtos = Product.objects.filter(query)
        if bool(verificar_termo_tem_produtos) == False:
            if len(p) == 1:
                break
            querys = []
            if len(p) >= 4:
                querys.append(query_produto([p[0], p[1], p[2]]))
                querys.append(query_produto([p[0], p[1], p[3]]))
                querys.append(query_produto([p[0], p[2], p[3]]))
                querys.append(query_produto([p[1], p[2], p[3]]))
                for i in querys:
                    verificar_termo_tem_produtos = Product.objects.filter(i)
                    if bool(verificar_termo_tem_produtos) == True:
                        break
                if bool(verificar_termo_tem_produtos) == True:
                    break

            if len(p) == 3:
                querys.append(query_produto([p[0], p[1]]))
                querys.append(query_produto([p[0], p[2]]))
                querys.append(query_produto([p[1], p[2]]))

                for i in querys:
                    verificar_termo_tem_produtos = Product.objects.filter(i)
                    if bool(verificar_termo_tem_produtos) == True:
                        break
                if bool(verificar_termo_tem_produtos) == True:
                    break

            if len(p) == 2:
                querys.append(query_produto([p[0]]))
                querys.append(query_produto([p[1]]))
                for i in querys:
                    verificar_termo_tem_produtos = Product.objects.filter(i)
                    if bool(verificar_termo_tem_produtos) == True:
                        break
                if bool(verificar_termo_tem_produtos) == True:
                    break
            p.pop()
    return  verificar_termo_tem_produtos