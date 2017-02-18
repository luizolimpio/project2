// popup #################################################################


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


// TODO: use .data('...') instead of attr('data')
// TODO: limit number of handlers, preferrably split into separate .js files and use django's staticfiles
$(function () {
        // Delay plugin taken from ###############################################
        // http://ihatecode.blogspot.com/2008/04/jquery-time-delay-event-binding-plugin.html


        var $body = $('body');


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


        if ($(".errorlist").length) {
            $('html, body').animate({
                scrollTop: $(".errorlist").offset().top - 200
            }, 2000);
        }

        $("div.warning,div.failure,div.success").on("click", function () {
            $(this).hide()
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

    }
);




