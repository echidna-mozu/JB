require(['jquery'], function($){
    $(function() {
        
        var LayoutType = 'cellsByRow';
        var sortby = '';
        var $isotope ;
        require(['shim!vendor/isotope.min[jquery=jQuery]'], function() {
                $isotope = $("#mz-productlist-list").isotope({
                    itemSelector: '.mz-productlist-item',
                    layoutMode: LayoutType,
                    animationOptions: {
                        duration: 400,
                        queue: false
                    },
                    getSortData : {
                        price : function ( $elem ) {
                            var str = $elem.find('.jb-product-prize').text();
                            return parseFloat(str.substr(str.indexOf('$')+1,str.length));
                        }
                    }
                    
                });
        }); 
        
        
            
            
            
            $(document).on('change',".mz-pagingcontrols-pagesize-dropdown[data-mz-value='SortBy']", function(){
                    var sort = $(".mz-pagingcontrols-pagesize-dropdown[data-mz-value='SortBy']").val();    
                    console.log(sort);
                    switch(sort){
                        case('popularity'):
                                $("#mz-productlist-list").isotope({
                                    sortBy : 'price',
                                    sortAscending : true
                                });
                            break;
                        case('highest_price'):
                            $("#mz-productlist-list").isotope({
                                    sortBy : 'price',
                                    sortAscending : false
                                });
                            break;
                        case('low_price'):
                            $("#mz-productlist-list").isotope({
                                    sortBy : 'price',
                                    sortAscending : true
                                });
                            break;
                        case('best_rating'):
                            $("#mz-productlist-list").isotope({
                                    sortBy : 'price',
                                    sortAscending : false
                                });
                            break;
                        case('number_of_reviews'):
                            $("#mz-productlist-list").isotope({
                                    sortBy : 'price',
                                    sortAscending : true
                                });
                            break;
                    }
            }); 
            
        
        
        
        function updateLayout(){
            if(LayoutType !== '' ){
            $("#mz-productlist-list").isotope({layoutMode: LayoutType});
                    if(LayoutType == "straightDown") { 
                        $('#mz-productlist-list').removeClass('mz-productlist-grid');
                        $('#mz-productlist-list').addClass("mz-productlist-list"); 
                    }
                    else {
                        $('#mz-productlist-list').removeClass('mz-productlist-list');
                        $('#mz-productlist-list').addClass("mz-productlist-grid"); 
                    }
                    $(window).smartresize();
                
            }
        }
        
        $(document).on('change',".mz-pagingcontrols-pagesize-dropdown[data-mz-value='View']",function(e) {
            e.preventDefault();
            var view = $(".mz-pagingcontrols-pagesize-dropdown[data-mz-value='View']").val();
            
            switch(view){
                    case('Grid'): 
                        LayoutType = 'cellsByRow';  
                        break;
                    case('List'): 
                        LayoutType = 'straightDown';
                        break;
            }
            // alert(view);
            updateLayout();
        });
        
        
        
        
        
    });
});
        
       




