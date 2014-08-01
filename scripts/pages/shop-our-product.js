require([
    "modules/jquery-mozu", 
    "hyprlive", 
    "modules/backbone-mozu", 
    "modules/api", 
    "shim!vendor/owl.carousel[jQuery=jquery]"], function ($, Hypr, Backbone, api) {
	 
	$(document).ready(function () {
        
        var owlDsk = $('#shop_our_product_gallery .slides');
        
        owlDsk.owlCarousel({
            center:true,
            loop:true,
            margin:10,
            nav:true,
            responsiveClass:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:1
                },
                1000:{
                    items:1
                }
            }
        });
        
        var getRenderProductContext=function (substituteModel) {
            var model = (substituteModel || this.model).toJSON({ helpers: true });
            return {
                Model: model,
                model: model
            };
        }
        
        // fetch all JellyBelly Categories to homrepage-brands-listing template
        /**
         * GET	
         *    /commerce/catalog/storefront/categories/
         *    Retrieves a list of categories according to any specified filter criteria and sort options.
         * GET	
         *    /commerce/catalog/storefront/categories/tree
         *    Retrieves the list of product categories that appear on the storefront organized in a hierarchical format. Hidden categories do not appear in the list.
         * GET	
         *    /commerce/catalog/storefront/categories/{categoryId}
         *    Retrieves the details of a single category.
         * */
        //  api.request('GET', '/commerce/catalog/storefront/categories/tree').then(function(resp){
        //      console.log(resp);
        //  });
        var catServiceurl = '/api/commerce/catalog/storefront/categories/tree';
        $.ajax({
                url: catServiceurl,
                cache: true,
                complete: function(data) {
                    // console.log("Jelly Belly "+ data);
                    var brandList ;//= (data.responseJSON).items[0].childrenCategories[0].childrenCategories;
                    for(var i =0 ; i < data.responseJSON.items.length; i++){
                        var item = data.responseJSON.items[i];
                        if(item.content.name === 'JellyBelly'){
                                for(var j=0; j < item.childrenCategories.length; j++){
                                    var childrenCategories = item.childrenCategories[j];
                                    if(childrenCategories.content.name === 'Brands'){
                                        brandList = childrenCategories.childrenCategories;
                                    }
                                }
                        }
                    }
                    
                    console.log(brandList);
                    // for(var y in brandList){
                    //     brandList[y].yPosition = y * 64 * -1; 
                    // }
                    $('#shop-our-product-brands-listing').html(Hypr.getTemplate('modules/shop-our-product-brands-listing').render({model:brandList}));
                }
        });

	});

});
















