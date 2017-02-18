# python imports
import locale

# django imports
from django import forms
from django.template import RequestContext
from django.template.loader import render_to_string

# portlets imports
from portlets.models import Portlet
from portlets.utils import register_portlet


class CartPortlet(Portlet):
    """Portlet to display the cart.
    """
    class Meta:
        app_label = 'portlet'

    def __unicode__(self):
        return u"%s" % self.id

    def render(self, context):
        """Renders the portlet as html.
        """
        import lfs.cart.utils
        request = context.get("request")

        cart = lfs.cart.utils.get_cart(request)
        if cart is None:
            amount_of_items_locale = None
            amount_of_items_int = None
            decimal = '0'
            centavos = '00'
        else:

            cart_amount_of_items = int(cart.get_amount_of_items())
            amount_of_items_locale = cart_amount_of_items
            amount_of_items_int = int(cart_amount_of_items)
            price = str(cart.get_price_gross(request, total=True))
            if price == '0':
                decimal = '0'
                centavos = '00'
            else:
                virgula = price.find('.')
                decimal = price[:virgula]
                centavos = price[virgula:]
                for a in [',','.']:
                    decimal = decimal.replace(a,'')
                    centavos = centavos.replace(a,'')


        return render_to_string("lfs/portlets/cart.html", RequestContext(request, {
            "title": self.title,
            "amount_of_items_locale": amount_of_items_locale,
            "amount_of_items_int": amount_of_items_int,
            "decimal": decimal,
            "centavos":centavos[:2],
        }))

    def form(self, **kwargs):
        return CartPortletForm(instance=self, **kwargs)


class CartPortletForm(forms.ModelForm):
    """Form for CartPortlet.
    """
    class Meta:
        model = CartPortlet
        exclude = ()
