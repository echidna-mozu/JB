require([
    "modules/jquery-mozu", 
    "hyprlive", 
    "modules/backbone-mozu", 
    "modules/api", 
    "shim!vendor/owl.carousel[jQuery=jquery]"], function ($, Hypr, Backbone, api) {
	 
	$(document).ready(function () {
        
        var owlDsk = $('#home_gallery .slides');
        
        owlDsk.owlCarousel({
            center:true,
            loop:true,
            margin:10,
            nav:true,
            responsiveClass:true,
            transitionStyle : "fade",
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
        var brandList;
        $.ajax({
                url: catServiceurl,
                cache: true,
                complete: function(data) {
                    console.log("Jelly Belly "+ data);
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
                    
                    // var brandList = (data.responseJSON).items[0].childrenCategories[0].childrenCategories;
                    
                    for(var y in brandList){
                        brandList[y].yPosition = y * 64 * -1; 
                    }
                    $('#homepage-brands-listing').html(Hypr.getTemplate('modules/homepage-brands-listing').render({model:brandList}));
            }
        });

	});

});















