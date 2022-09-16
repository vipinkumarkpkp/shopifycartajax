(function ( $, window, document, undefined ) {

    var pluginName = 'offerifyCart',
        defaults = {
            propertyName: "value"
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = 'offerifyCart';
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var item = this.options.item,
                item_total = this.options.item_total,
                item_qty = this.options.item_qty,
                subtotal = $(this.options.subtotal);

            // Change line item quantity
            $(item_qty).change(function() {
                var qty = $(this).val(),
                    this_item = $(this).closest(item),
                    variant_id = this_item.data('variant-id'),
                    this_item_total = this_item.find(item_total);
                $.ajax({
                    type: 'POST',
                    url: '/cart/change.js',
                    dataType: 'json',
                    data: {
                        quantity: qty,
                        id: variant_id
                    },
                    success: function(cart) {
                        if ( qty == 0 ) {
                            this_item.remove();
                        } else {
                            $.each(cart.items,function(index,row) {
                                if ( variant_id == row.variant_id ) this_item_total.html( '$' + parseFloat(row.line_price / 100).toFixed(2) );
                            });
                        }
                        subtotal.html( '$' + parseFloat(cart.total_price / 100).toFixed(2) );
                    },
                    error: function(response) {
                        alert(response);
                    }
                });
            });

            // Remove line item
            $(this.options.item_remove).click(function(e) {
                e.preventDefault();
                $(this).closest(item).find(item_qty).val(0);
                $(this).closest(item).find(item_qty).trigger('change');
            });

        }
    };

    $.fn.shopifyAJAXCart = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );