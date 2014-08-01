define(['modules/jquery-mozu', 'shim!vendor/underscore>_', 'hyprlive', 'modules/backbone-mozu', "modules/models-faceting", "modules/views-productlists", "modules/views-paging"], function($, _, Hypr, Backbone, FacetingModels, ProductListViews, PagingViews){

    var useAnimatedLists = Hypr.getThemeSetting('useAnimatedProductLists') && !Modernizr.mq('(max-width: 480px)');
    
    $(document).ready(function () {
        
        var $categoryPageBody = $('[data-mz-category]'),
            $facetPanel = $('[data-mz-facets]'),
            categoryId = $categoryPageBody.data('mz-category'),
            productListData = require.mozuData('facetedproducts'),
            facetingViews;

        if (productListData) {
            var facetingModel = new FacetingModels.FacetedProductCollection(productListData);

            if (categoryId) facetingModel.setHierarchy('categoryId',categoryId);

            facetingViews = {
                pagingControls: new PagingViews.PagingControls({
                    el: $categoryPageBody.find('[data-mz-pagingcontrols]'),
                    model: facetingModel
                }),
                pageNumbers: new PagingViews.PageNumbers({
                    el: $categoryPageBody.find('[data-mz-pagenumbers]'),
                    model: facetingModel
                }),
                productList: ( useAnimatedLists ? new ProductListViews.AnimatedList({
                    el: $categoryPageBody.find('[data-mz-productlist] .mz-productlist-list'),
                    model: facetingModel
                }) : new ProductListViews.List({
                    el: $categoryPageBody.find('[data-mz-productlist]'),
                    model: facetingModel
                }) )
            };

            if ($facetPanel.length > 0) {
                facetingViews.facetPanel = new ProductListViews.FacetingPanel({
                    el: $facetPanel,
                    model: facetingModel
                });
            }

            Backbone.history.start({ pushState: true, root: window.location.pathname });
            var router = new Backbone.Router();

            facetingModel.on('facetchange', function (newQuery) {
                router.navigate(newQuery, { replace: true });
            });

            facetingModel.on('change:pageSize', facetingModel.updateFacets, facetingModel);

        }

        _.invoke(facetingViews, 'render');

        $categoryPageBody.noFlickerFadeIn();

        window.facetingViews = facetingViews;
        
        
        /**
         * Scripts to make colapsable category with description and sub category
         * if height is greater than 100, close the container else show the contents.
        **/
        $(".jb-colapsing-title").bind("click", function(e){
            if(this.parentNode.clientHeight > 100){
                $(this.parentNode).css('max-height','62px');
            }else{
                /**
                 * On increasing height of the div to show the contents, 
                 * maximize height to exactly to the content height.
                 * FOr that getting all the child elements and add its heights up and set to max height of div.
                 **/
                var maxHeight = 46;
                for(var i =0; i<this.parentNode.children.length; i++){
                    maxHeight += this.parentNode.children[i].clientHeight;
                }
                $(this.parentNode).css('max-height', maxHeight+'px');
            }
        });
    });
    require(["modules/paging-controls"]);
});




