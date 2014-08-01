require([
    "modules/jquery-mozu",
    "shim!vendor/underscore>_", 
    "hyprlive", 
    "modules/backbone-mozu", 
    'modules/api', 
    'modules/models-faceting',
    'modules/models-product',
    'modules/models-cart',
    'modules/cart-monitor'], function ($, _, Hypr, Backbone,Api, FacetingModels, ProductModels, CartModels, CartMonitor) {
        
        
    
    $(document).ready(function(){
        
        console.log('add to cart now!');
        
        $('[data-mz-productlist]').on('click', '.jb-add-to-cart', function(e) {
			e.preventDefault();
            var $target = $(e.currentTarget), productCode = $target.attr('href');
            var $quantity = $(e.target.parentNode).find('#quantity')[0].options[$(e.target.parentNode).find('#quantity')[0].options.selectedIndex];
            console.log('quantity is :'+$quantity.innerHTML);
            Api.get('product', productCode).then(function(sdkProduct) {
                var product = new ProductModels.Product(sdkProduct.data);
                var count = parseInt($quantity.innerHTML);
                product.set({'quantity':count});
                $target.addClass('is-loading');
                product.addToCart();
                product.on('addedtocart', function() {
                    $target.removeClass('is-loading');
                    console.log('adedd to cart');
                });
            });
        });
        
        
    });
    
    
        
    });


