// popup #################################################################
function imagemnot() {
    $(window).load(function () {
        $('img').each(function () {
            if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
                // image was broken, replace with your new image
                this.src = "/static/img/Em-breve.jpg";
            }
        });
    });
}
function imagemnotupdate() {
    $('img').each(function () {
        $(this).on('error', function () {
            $(this).attr('src', '/static/img/Em-breve.jpg');
        });
    });
}


function popup(url, w, h) {
    w = window.open(url, "Preview", "height=" + h + ", width=" + w + ", screenX=500, screenY=150, scrollbars=yes, resizable=yes");
    w.focus();
}

function safeParseJSON(data) {
    if (typeof(data) == 'string') {
        data = $.parseJSON(data);
    }
    return data;
}

// Update checkout
var update_checkout = function () {
    var data = $(".checkout-form").ajaxSubmit({
        url: $(".checkout-form").attr("data"),
        "success": function (data) {
            var data = safeParseJSON(data);
            $("#cart-inline2").html(data["cart"]);
            $("#shipping-inline").html(data["shipping"]);
            $("#payment-inline").html(data["payment"]);
            $('.informacao-conta').hide();
            imagemnotupdate();
            if ($(".payment-method-type-0").is(":checked") == true) {
                $('.informacao-conta').show()
            }
        }
    });

};

// TODO: use .data('...') instead of attr('data')
// TODO: limit number of handlers, preferrably split into separate .js files and use django's staticfiles
$(function () {
        // Delay plugin taken from ###############################################
        // http://ihatecode.blogspot.com/2008/04/jquery-time-delay-event-binding-plugin.html


        var $body = $('body');

        function atualizarcarrinhonovosubimit() {

            $("#cart-form").ajaxSubmit({
                "type": "post",
                "success": function (data) {
                    var data = safeParseJSON(data);
                    $("#cart-inline").html(data["html"]);
                    $body.trigger({
                        type: "cart-updated"
                    });
                    if (data["message"]) {
                        if (data["cor"] == "verde") {
                            $("div.warning").hide();
                            $("div.failure").hide();
                            $(".success p").text(data["message"]);
                            $("div.success").fadeIn(300).fadeOut(1000);
                            atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                        }
                        if (data["cor"] == "amarelo") {
                            $("div.success").hide();
                            $("div.failure").hide();
                            $(".warning p").text(data["message"]);
                            $("div.warning").fadeIn(300).fadeOut(13000);
                            atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                        }
                        if (data["cor"] == "vermelho") {
                            $("div.success").hide();
                            $("div.warning").hide();
                            $(".failure p").text(data["message"]);
                            $("div.failure").fadeIn(300).fadeOut(1000);
                            atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                        }

                    }
                }
            })
        }

        function atualizarcarrinhonovo() {
            if ($(".carrinhonovo").length == 0) {
                $.get("/cartnovo", function (data) {
                    $("<div class='carrinhonovo'>").html(data).appendTo($("body"));
                    imagemnotupdate();
                    $(".delete-button.delete-cart-item").each(function () {
                        $(this).css({"pointer-events": "auto"})
                    });
                    $(".carrinhonovo-top-fechar").click(function () {
                        $(".carrinhonovo").fadeToggle();
                    });
                    $(".pagina-carrinho .thumbnail").each(function () {
                        var self = $(this);
                        self.find(".qtdProdLess").on("click", function () {
                            var quantidade = parseInt(self.find(".cart-amount").val()) - 1;
                            if (quantidade < 1) {
                                quantidade = 1
                            }
                            self.find(".cart-amount").val(quantidade);
                            atualizarcarrinhonovosubimit();
                            update_checkout();

                        });
                        self.find(".qtdProdPlus").on("click", function () {
                            var quantidade = parseInt(self.find(".cart-amount").val()) + 1;
                            if (quantidade < 1) {
                                quantidade = 1
                            }
                            self.find(".cart-amount").val(quantidade);
                            atualizarcarrinhonovosubimit();
                            update_checkout();

                        });
                    })
                });
            } else {
                $.get("/cartnovo", function (data) {
                    $(".carrinhonovo").html(data);
                    imagemnotupdate();
                    $(".delete-button.delete-cart-item").each(function () {
                        $(this).css({"pointer-events": "auto"})
                    });
                    $(".carrinhonovo-top-fechar").click(function () {
                        $(".carrinhonovo").fadeToggle();
                    });
                    $(".pagina-carrinho .thumbnail").each(function () {
                        var self = $(this);
                        self.find(".qtdProdLess").on("click", function () {
                            var quantidade = parseInt(self.find(".cart-amount").val()) - 1;
                            if (quantidade < 1) {
                                quantidade = 1
                            }
                            self.find(".cart-amount").val(quantidade);
                            atualizarcarrinhonovosubimit();
                            update_checkout();

                        });
                        self.find(".qtdProdPlus").on("click", function () {
                            var quantidade = parseInt(self.find(".cart-amount").val()) + 1;
                            if (quantidade < 1) {
                                quantidade = 1
                            }
                            self.find(".cart-amount").val(quantidade);
                            atualizarcarrinhonovosubimit();
                            update_checkout();

                        });
                    })
                });
            }

        }

        atualizarcarrinhonovo();

        $.fn.delay = function (options) {
            var timer;
            var delayImpl = function (eventObj) {
                if (timer != null) {
                    clearTimeout(timer);
                }
                var newFn = function () {
                    options.fn(eventObj);
                };
                timer = setTimeout(newFn, options.delay);
            };

            return this.each(function () {
                var obj = $(this);
                obj.bind(options.event, function (eventObj) {
                    delayImpl(eventObj);
                });
            });
        };

        // Message ################################################################

        var message = $.cookie("message");

        if (message != null) {

            $("div.warning").hide();
            $("div.failure").hide();
            $(".success p").text(message);
            $("div.success").fadeIn(300).fadeOut(2000);

            $.removeCookie('message', {path: '/'});
        }

        // Rating #################################################################
        $(".rate").click(function () {
            var $this = $(this);
            $(".rate").each(function () {
                $(this).removeClass("current-rating")
            });

            $this.addClass("current-rating");

            $("#id_score").val($this.attr("data"));
            return false;
        });

        // General ################################################################
        // $().ajaxSend(function(r,s){
        //     $("#spinner").show()
        // });
        //
        // $().ajaxStop(function(r,s){
        //     $("#spinner").hide()
        // });

        // Product ################################################################

        $("a.product-image").fancybox({loop: false});

        // ----- REPORTED TO BE WORKING IN RECENT jQuery VERSIONS WITHOUT THIS HACK ------
        //    // Hack to make the change event on radio buttons for IE working
        //    // http://stackoverflow.com/questions/208471/getting-jquery-to-recognise-change-in-ie
        //    if ($.browser.msie) {
        //        $body.on('click', 'input.variant', function() {
        //            this.blur();
        //            this.focus();
        //        });
        //    }

        $body.on('change', 'input.variant', function () {
            var url = $(this).parents("table.product-variants").attr("data");
            var variant_id = $(this).attr("value");

            $("#product-form").ajaxSubmit({
                url: url,
                data: {"variant_id": variant_id},
                success: function (data) {
                    var data = safeParseJSON(data);
                    $("#product-inline").html(data["product"]);
                    $.jGrowl(data["message"], {theme: 'lfs'});

                    // Re-bind fancybox
                    $("a.product-image").fancybox({loop: false});
                }
            });
        });

        $body.on('change', 'select.property', function () {
            $("#product-form").ajaxSubmit({
                url: $("#product-form").attr("data"),
                success: function (data) {
                    var data = safeParseJSON(data);
                    $("#product-inline").html(data["product"]);
                    $.jGrowl(data["message"], {theme: 'lfs'});

                    // Re-bind fancybox
                    $("a.product-image").fancybox({loop: false});
                }
            });
        });

        $(".product-quantity").attr("autocomplete", "off");

        $body.on('keyup', '.product-quantity', function () {
            var url = $("#packing-url").attr("data");
            if (url) {
                $("#product-form").ajaxSubmit({
                    url: url,
                    success: function (data) {
                        var data = safeParseJSON(data);
                        $(".packing-result").html(data["html"]);
                    }
                });
            }
        });

        $body.on('change', 'select.cp-property', function () {
            $("#product-form").ajaxSubmit({
                url: $("#cp-url").attr("data"),
                success: function (data) {
                    var data = safeParseJSON(data);
                    $(".standard-price-value").html(data["price"]);
                    $(".for-sale-price-value").html(data["for-sale-price"]);
                    $(".for-sale-standard-price-value").html(data["for-sale-standard-price"]);
                    $(".packing-result").html(data["packing-result"]);
                    $.jGrowl(data["message"], {theme: 'lfs'});

                    // Re-bind fancybox
                    $("a.product-image").fancybox({loop: false});
                }
            });
        });

        // Cart ###################################################################

        $body.on('click', '.add-accessory-link', function () {
            var url = $(this).attr("href");
            $.post(url, function (data) {
                $("#cart-items").html(data);
                $(".delete-button.delete-cart-item").each(function () {
                    $(this).css({"pointer-events": "auto"})
                });
            });
            $body.trigger({
                type: "cart-updated"
            });
            return false;
        });

        $body.on('click', '.delete-cart-item', function (event) {
            event.preventDefault();
            var url = $(this).attr("href");
            $.post(url, function (data) {
                var data = safeParseJSON(data);
                $("#cart-inline").html(data["html"]);
                $(".delete-button.delete-cart-item").each(function () {
                    $(this).css({"pointer-events": "auto"})
                });
                $body.trigger({
                    type: "cart-updated"


                });
                if (data["message"]) {
                    if (data["cor"] == "vermelho") {
                        $("div.success").hide();
                        $("div.warning").hide();
                        $(".failure p").text(data["message"]);
                        $("div.failure").fadeIn(300).fadeOut(2000);
                        atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                    }
                }
            });
            update_checkout();
        });

        $(".delete-button.delete-cart-item").each(
            $body.on('change', '.cart-amount', function () {
                $("#cart-form").ajaxSubmit({
                    "type": "post",
                    "success": function (data) {
                        var data = safeParseJSON(data);
                        $("#cart-inline").html(data["html"]);
                        imagemnotupdate();
                        $(".delete-button.delete-cart-item").each(function () {
                            $(this).css({"pointer-events": "auto"})
                        });
                        $body.trigger({
                            type: "cart-updated"
                        });
                        if (data["message"]) {
                            if (data["cor"] == "verde") {
                                $("div.warning").hide();
                                $("div.failure").hide();
                                $(".success p").text(data["message"]);
                                $("div.success").fadeIn(300).fadeOut(1000);
                                atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                            }
                            if (data["cor"] == "amarelo") {
                                $("div.success").hide();
                                $("div.failure").hide();
                                $(".warning p").text(data["message"]);
                                $("div.warning").fadeIn(300).fadeOut(13000);
                                atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                            }
                            if (data["cor"] == "vermelho") {
                                $("div.success").hide();
                                $("div.warning").hide();
                                $(".failure p").text(data["message"]);
                                $("div.failure").fadeIn(300).fadeOut(1000);
                                atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                            }

                        }
                    }
                });
                update_checkout();
            })
        );

        $body.on('change', '.cart-country', function () {
            $("#cart-form").ajaxSubmit({
                "type": "post",
                "success": function (data) {
                    var data = safeParseJSON(data);
                    $("#cart-inline2").html(data["html"]);
                    $(".delete-button.delete-cart-item").each(function () {
                        $(this).css({"pointer-events": "auto"})
                    });
                    $body.trigger({
                        type: "cart-updated"
                    });
                }
            })
        });

        $body.on('change', '.cart-shipping-method', function () {
            $("#cart-form").ajaxSubmit({
                "type": "post",
                "success": function (data) {
                    var data = safeParseJSON(data);
                    $("#cart-inline2").html(data["html"]);
                    $(".delete-button.delete-cart-item").each(function () {
                        $(this).css({"pointer-events": "auto"})
                    });
                }
            })
        });

        $body.on('change', '.cart-payment-method', function () {
            $("#cart-form").ajaxSubmit({
                "type": "post",
                "success": function (data) {
                    var data = safeParseJSON(data);
                    $("#cart-inline2").html(data["html"]);
                    $(".delete-button.delete-cart-item").each(function () {
                        $(this).css({"pointer-events": "auto"})
                    });
                    $body.trigger({
                        type: "cart-updated"
                    });
                }
            })
        });


        // Search ##################################################################
        $(".search-jquery").each(function () {
            var busca = $(this);
            busca.find(".search-input").on('blur', function (e) {
                window.setTimeout(function () {
                    busca.find(".livesearch-result").hide();
                }, 1000);
            });

            busca.find(".search-input").delay({
                delay: 400,
                event: "keyup",
                fn: function (e) {
                    if (e.keyCode == 27 || e.keyCode == 13) {
                        busca.find(".livesearch-result").hide();
                    }
                    else {

                        var q = busca.find(".search-input").val();
                        var url = '/livesearch';
                        $.get(url, {"q": q}, function (data) {
                            data = safeParseJSON(data);
                            if (data["state"] == "success") {
                                busca.find(".livesearch-result").html(data["products"]);
                                busca.find(".livesearch-result").slideDown("fast");
                                imagemnotupdate();
                                if ($(window).width() < 799) {
                                    busca.find(".produtos-busca-rapida").on('mouseover', function () {
                                        url = $(this).find(".image a").attr("href");
                                        window.location.href = url;
                                    });
                                    $(".all-results-fechar").mouseover(function () {
                                        console.log("funfou");
                                        $(".livesearch-result").hide();
                                    });
                                }
                                else {
                                    busca.find(".produtos-busca-rapida").on('mouseup', function () {
                                        url = $(this).find(".image a").attr("href");
                                        window.location.href = url;
                                    });
                                    $(".all-results-fechar").click(function () {
                                        console.log("funfou");
                                        $(".livesearch-result").hide();
                                    });
                                }
                            }
                            else {
                                busca.find(".livesearch-result").html();
                                busca.find(".livesearch-result").hide();

                            }
                        })
                    }
                }
            });
        });

        // Checkout ##################################################################
        var $shipping_table = $('.shipping-address');
        var $invoice_table = $('.invoice-address');
        var $no_shipping = $("#id_no_shipping");
        var $no_invoice = $("#id_no_invoice");

        if ($no_shipping.length > 0) {  // there is an option to mark shipping address same as invoice address
            if ($no_shipping.prop('checked')) {
                $shipping_table.hide();
            }
            else {
                $shipping_table.show();
            }

            $body.on('click', '#id_no_shipping', function () {
                var table = $('.shipping-address');
                if ($('#id_no_shipping').prop('checked')) {
                    table.hide();
                }
                else {
                    table.show();
                }
                var data = $(".checkout-form").ajaxSubmit({
                    url: $(".checkout-form").attr("data"),
                    "success": function (data) {
                        var data = safeParseJSON(data);
                        $("#cart-inline2").html(data["cart"]);
                        $("#shipping-inline").html(data["shipping"]);
                        imagemnotupdate();
                    }
                });
            });
        }
        else {  // there is an option to mark invoice address same as shipping address
            if ($no_invoice.prop('checked')) {
                $invoice_table.hide();
            }
            else {
                $invoice_table.show();
            }

            $body.on('click', '#id_no_invoice', function () {
                var table = $('.invoice-address');
                if ($('#id_no_invoice').prop('checked')) {
                    table.hide();
                }
                else {
                    table.show();
                }
                var data = $(".checkout-form").ajaxSubmit({
                    url: $(".checkout-form").attr("data"),
                    "success": function (data) {
                        var data = safeParseJSON(data);
                        $("#cart-inline2").html(data["cart"]);
                        $("#shipping-inline").html(data["shipping"]);
                        imagemnotupdate();
                    }
                });
            });
        }

        if ($(".payment-method-type-2:checked").val() != null) {
            $("#credit-card").show();
        }
        else {
            $("#credit-card").hide();
        }
        if ($(".payment-method-type-8:checked").val() != null) {
            $("#dinheiro-troco").show();
        }
        else {
            $("#dinheiro-troco").hide();
        }

        if ($(".payment-method-type-1:checked").val() != null) {
            $("#bank-account").show();
        }
        else {
            $("#bank-account").hide();
        }


        $body.on('click', '.payment-methods', function () {
            if ($(".payment-method-type-1:checked").val() != null) {
                $("#bank-account").show();
            }
            else {
                $("#bank-account").hide();
            }
            if ($(".payment-method-type-2:checked").val() != null) {
                $('#credit-card').show();
            }
            else {
                $('#credit-card').hide();
            }
            if ($(".payment-method-type-8:checked").val() != null) {
                $('#dinheiro-troco').show();
            }
            else {
                $('#dinheiro-troco').hide();
            }
        });

        var update_invoice_address = function () {

            var data = $(".postal-address").ajaxSubmit({
                url: $(".postal-address").attr("invoice"),
                "success": function (data) {
                    var data = safeParseJSON(data);
                    $("#invoice-address-inline").html(data["invoice_address"]);

                }
            });
        };

        var save_invoice_address = function () {

            var data = $(".postal-address").ajaxSubmit({
                url: $(".postal-address").attr("invoice"),
                "success": function (data) {
                }
            });
        };

        var update_shipping_address = function () {

            var data = $(".postal-address").ajaxSubmit({
                url: $(".postal-address").attr("shipping"),
                "success": function (data) {
                    var data = safeParseJSON(data);
                    $("#shipping-address-inline").html(data["shipping_address"]);

                }
            });
        };

        var save_shipping_address = function () {

            var data = $(".postal-address").ajaxSubmit({
                url: $(".postal-address").attr("shipping"),
                "success": function (data) {
                }
            });
        };

        $body.on('change', '#id_invoice-firstname,#id_invoice-datanascimento,#id_invoice-line1,#id_invoice-line2,#id_invoice-city,#id_invoice-state,#id_invoice-code,#id_invoice-phone,#id_invoice-email', function () {
            save_invoice_address();
        });

        $body.on('click', '.update-checkout', function () {
            update_checkout();
        });

        $body.on('change', '#id_invoice-country', function () {
            update_invoice_address();
            update_checkout();
        });

        $body.on('change', '#id_shipping-country', function () {
            update_shipping_address();
            update_checkout();
        });

        $body.on('change', '#id_shipping-firstname,#id_shipping-datanascimento,#id_shipping-line1,#id_shipping-line2,#id_shipping-city,#id_shipping-state,#id_shipping-code,#id_shipping-phone,#id_shipping-email', function () {
            save_shipping_address();
        });


        var update_html = function (data) {
            data = safeParseJSON(data);
            for (var html in data["html"])
                $(data["html"][html][0]).html(data["html"][html][1]);

            if (data["message"]) {
                $.jGrowl(data["message"], {theme: 'lfs'});
            }
        };

        $body.on('change', '#voucher', function () {
            var url = $(this).attr("data");
            var voucher = $(this).val();
            $.post(url, {"voucher": voucher}, function (data) {
                update_html(data);
            });
        });

        $body.on('change', ".property-checkbox", function () {
            var url = $(this).attr("url");
            document.location = url;
        });
        $(".informacao-conta").addClass("none");


        $(document).ajaxSend(function (event, xhr, settings) {
            function sameOrigin(url) {
                // url could be relative or scheme relative or absolute
                var host = document.location.host; // host + port
                var protocol = document.location.protocol;
                var sr_origin = '//' + host;
                var origin = protocol + sr_origin;
                // Allow absolute or scheme relative URLs to same origin
                return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
                    (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
                    // or any other URL that isn't scheme relative or absolute i.e relative.
                    !(/^(\/\/|http:|https:).*/.test(url));
            }

            function safeMethod(method) {
                return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
            }

            if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
                xhr.setRequestHeader("X-CSRFToken", $.cookie("csrftoken"));
            }
        });

        //adicionar produto no carrinho
        function atualizarcarrinho(quantidade, decimal, centavos) {
            $(".cart-novo").each(function () {
                var self = $(this);
                if ($(".quant").length == 0) {
                    $("<div>").addClass("quant").appendTo(".carrinho-top")
                }

                if (parseInt(quantidade) == 0) {
                    $(".quant").remove();
                    $(".carrinhonovo").remove()
                }

                self.find(".decimal").text(decimal);
                self.find(".centavos").text(centavos);
                self.find(".quant").text(parseInt(quantidade));
                atualizarcarrinhonovo();
            })
        }

        $(".produtos").each(function () {
            var self = $(this);
            self.find(".adicionar-produto").click(function (event) {
                event.preventDefault();
                var quantidade = self.find(".quantity").val();
                var codigo = self.find(".produto-id").val();
                var url = "/add-to-cart";
                $(this).animate({"margin-left": "+=35"});
                $(this).animate({"margin-left": "-=35"});
                $.get(url, {"product_id": codigo, "quantity": quantidade}, function (data) {
                    if (data["message"]) {

                        if (data["cor"] == "verde") {
                            $("div.warning").hide();
                            $("div.failure").hide();
                            $(".success p").text(data["message"]);
                            $("div.success").fadeIn(300).fadeOut(1000);
                            atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                        }
                        if (data["cor"] == "amarelo") {
                            $("div.success").hide();
                            $("div.failure").hide();
                            $(".warning p").text(data["message"]);
                            $("div.warning").fadeIn(300).fadeOut(13000);
                            atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                        }
                        if (data["cor"] == "vermelho") {
                            $("div.success").hide();
                            $("div.warning").hide();
                            $(".failure p").text(data["message"]);
                            $("div.failure").fadeIn(300).fadeOut(1000);
                            atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                        }
                    }
                })
            });
            self.find("input.number.quantity").keypress(function (e) {
                if (e.keyCode == 27 || e.keyCode == 13) {
                    event.preventDefault();
                    var quantidade = self.find(".quantity").val();
                    var codigo = self.find(".produto-id").val();
                    var url = "/add-to-cart";
                    $.get(url, {"product_id": codigo, "quantity": quantidade}, function (data) {
                        if (data["message"]) {

                            if (data["cor"] == "verde") {
                                $("div.warning").hide();
                                $("div.failure").hide();
                                $(".success p").text(data["message"]);
                                $("div.success").fadeIn(300).fadeOut(1000);
                                atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                            }
                            if (data["cor"] == "amarelo") {
                                $("div.success").hide();
                                $("div.failure").hide();
                                $(".warning p").text(data["message"]);
                                $("div.warning").fadeIn(300).fadeOut(13000);
                                atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                            }
                            if (data["cor"] == "vermelho") {
                                $("div.success").hide();
                                $("div.warning").hide();
                                $(".failure p").text(data["message"]);
                                $("div.failure").fadeIn(300).fadeOut(1000);
                                atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                            }
                        }
                    })
                }
            });
            self.find(".qtdProdLess").on("click", function (e) {
                e.preventDefault();
                var objeto_quantidade = self.find(".quantity");
                quantidade = objeto_quantidade.val();
                quantidade = parseFloat(quantidade) - 1;
                if (quantidade < 0) {
                    var quantidade = 0
                }
                objeto_quantidade.val(quantidade);
            });
            self.find(".qtdProdPlus").on("click", function (e) {
                e.preventDefault();
                var objeto_quantidade = self.find(".quantity");
                quantidade = objeto_quantidade.val();
                quantidade = parseFloat(quantidade) + 1;
                objeto_quantidade.val(quantidade);
            });
        });

        $(".botao-recomprar").on("click", function (event) {
            event.preventDefault();
            $(".success p").text("Verde: Produto foi adicionado.");
            $(".failure p").text("Vermelho: Produto não adicionado (Sem estoque).");
            $(".warning p").text("Amarelo:  Quantidade adicionada menor que a selecionada (Sem estoque)");
            $('html, body').animate({scrollTop: $(".total").offset().top}, 3000, function () {
                $('html, body').animate({scrollTop: $("html").offset().top}, 3000, function () {
                    $("div.success").show();
                    $("div.failure").css({"top": "90px"}).show();
                    $("div.warning").css({"top": "200px"}).show();
                    window.setTimeout(function () {
                        $("div.warning,div.failure,div.success").hide()
                    }, 15000);
                })

            });

            $(".minhas-compras-itens").each(function () {
                var self = $(this);
                var quantidade = self.find(".minhas-compras-itens-quantidade").text();
                var codigo = self.find(".minhas-compras-itens-codigo").text();
                var url = "/add-to-cart";
                $.get(url, {"product_id": codigo, "quantity": quantidade}, function (data) {

                    if (data["cor"] == "verde") {
                        self.animate({"background-color": "#a1f0a2"}, 2000);


                        atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                    }
                    else if (data["cor"] == "amarelo") {

                        self.animate({"background-color": "#f6fca7"}, 2000);


                        atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                    }
                    else if (data["cor"] != "amarelo" && data["cor"] != "verde") {

                        self.animate({"background-color": "#ffabae"}, 2000);


                        atualizarcarrinho(data["quantidade"], data["decimal"], data['centavos'])
                    }
                });
            });
        });

        function corrigicep() {
            var self = $("#id_invoice-code");
            self.delay({
                deley: 400, event: "keyup", fn: function (e) {
                    var lista = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ' ', '  ', '-', '.', ',', '\\', '/', '_'];
                    var texto = self.val();
                    $(lista).each(function () {
                        texto = texto.replace(this, "");
                    });
                    self.val(texto)
                }
            });

        }

        $(corrigicep);
        function corrigiemail() {
            var objeto = $("#id_invoice-email,#id_username,#id_email,#id_shipping-email");
            objeto.each(function () {
                var self = $(this);
                self.delay({
                    deley: 400, event: "keyup", fn: function (e) {
                        var lista = [" ", "  "];
                        var texto = self.val();
                        texto = texto.toLowerCase();
                        $(lista).each(function () {
                            texto = texto.replace(this, "");
                        });
                        self.val(texto)
                    }
                });
            })
        }

        $(corrigiemail);

        imagemnot();

        if ($(window).width() < 950) {
            $(".product-title3").each(function () {
                    var myTag = $(this).text();
                    if (myTag.length > 60) {
                        var truncated = myTag.trim().substring(0, 60).split(" ").slice(0, -1).join(" ") + "…";
                        $(this).text(truncated);
                    }

                }
            );
        }
        else {
            $(".product-title3").each(function () {
                    var myTag = $(this).text();
                    if (myTag.length > 80) {
                        var truncated = myTag.trim().substring(0, 80).split(" ").slice(0, -1).join(" ") + "…";
                        $(this).text(truncated);
                    }

                }
            );
        }


        $('a').delegate('a', 'click', function () {

        });
        window.onbeforeunload = function (e) {
            $(".se-pre-con").fadeIn("fast");
            setTimeout(function () {
                $(".se-pre-con").fadeOut("fast");
            }, 12000);

        };
        $(window).load(function () {
            $(".se-pre-con").fadeOut("fast");
        });
        setTimeout(function () {
            $(".se-pre-con").fadeOut("fast");
        }, 12000);

        function scrolltoptop() {
            $('body').prepend('<a href="#" class="back-to-top">Back to Top</a>');

            var amountScrolled = 450;

            $(window).scroll(function () {
                if ($(window).scrollTop() > amountScrolled) {
                    $('a.back-to-top').fadeIn('slow');
                } else {
                    $('a.back-to-top').fadeOut('slow');
                }
            });

            $('a.back-to-top').click(function () {
                $('html, body').animate({
                    scrollTop: 0
                }, 700);
                return false;
            });
        }

        function animescrolltoptop() {

            var amountScrolled = 450;

            $(window).scroll(function () {
                if ($(window).scrollTop() > amountScrolled) {
                    $('.navbar').addClass("sainav").removeClass("entnav");
                    $('.header-superior').addClass("saihead").removeClass("enthead");
                    $('.cd-dropdown-wrapper').addClass("saimenu").removeClass("entmenu");
                    $('.livesearch-result').addClass("saibusca").removeClass("entbusca");
                } else if ($('.navbar').hasClass("sainav")) {
                    $('.navbar').removeClass("sainav").addClass("entnav");
                    $('.header-superior').removeClass("saihead").addClass("enthead");
                    $('.cd-dropdown-wrapper').removeClass("saimenu").addClass("entmenu");
                    $('.livesearch-result').removeClass("saibusca").addClass("entbusca");
                }
            });
        }

        scrolltoptop();
        if ($(window).width() > 950) {
            animescrolltoptop();
            $(".cd-dropdown").addClass("dropdown-is-active");
        }

        function navbarmobile() {
            var navhtml = $(".navbar");
            var header = $(".header-superior");
            header.append(navhtml);
            navhtml.css({"visibility": "visible"})
        }

        navbarmobile();

        if ($(".errorlist").length) {
            $('html, body').animate({
                scrollTop: $(".errorlist").offset().top - 200
            }, 2000);
        }

        $("div.warning,div.failure,div.success").on("click", function () {
            $(this).hide()
        });

        $("input#shipping-method-3").attr("checked", "checked");

        $(".carrinho-top,.carrinho-topo-valor").on("click", function (e) {
            e.preventDefault();
            $(".carrinhonovo").slideToggle("slow")
        });

        $(".glyphicon-search").on("click", function () {
            $("div#divBusca .btn-group").slideToggle("slow")
        });

        function atualizacidade() {
            var url = "/cidade";
            $.post(url, function (data) {
            $(".botaocidade").text(data["cidade"]);

            });
        }
        atualizacidade();
    }
);




