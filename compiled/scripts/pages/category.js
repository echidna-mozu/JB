define("pages/category",["modules/jquery-mozu","shim!vendor/underscore>_","hyprlive","modules/backbone-mozu","modules/models-faceting","modules/views-productlists","modules/views-paging"],function(e,t,a,n,o,d,i){var r=a.getThemeSetting("useAnimatedProductLists")&&!Modernizr.mq("(max-width: 480px)");e(document).ready(function(){var a,s=e("[data-mz-category]"),c=e("[data-mz-facets]"),l=s.data("mz-category"),m=require.mozuData("facetedproducts");if(m){var u=new o.FacetedProductCollection(m);l&&u.setHierarchy("categoryId",l),a={pagingControls:new i.PagingControls({el:s.find("[data-mz-pagingcontrols]"),model:u}),pageNumbers:new i.PageNumbers({el:s.find("[data-mz-pagenumbers]"),model:u}),productList:r?new d.AnimatedList({el:s.find("[data-mz-productlist] .mz-productlist-list"),model:u}):new d.List({el:s.find("[data-mz-productlist]"),model:u})},c.length>0&&(a.facetPanel=new d.FacetingPanel({el:c,model:u})),n.history.start({pushState:!0,root:window.location.pathname});var g=new n.Router;u.on("facetchange",function(e){g.navigate(e,{replace:!0})}),u.on("change:pageSize",u.updateFacets,u)}t.invoke(a,"render"),s.noFlickerFadeIn(),window.facetingViews=a})});