define([
    'modules/jquery-mozu',
    'shim!vendor/jquery.hoverIntent[jQuery=jquery]'], function ($) {
    $(document).ready(function () {
        $('[data-mz-contextify]').each(function () {
            var $this = $(this),
                config = $this.data();

            $this.find(config.mzContextify).each(function () {
                var $item = $(this);
                if (config.mzContextifyAttr === "class") {
                    $item.addClass(config.mzContextifyVal);
                } else {
                    $item.prop(config.mzContextifyAttr, config.mzContextifyVal);
                }
            });
        });
    });
    
    
    $('.mz-sitenav-link').hoverIntent(function(){
            $('.closeSubNav').css('display','block');
            // $('.mz-l-pagecontent').css('top','300px');
            $('.nav-menu-details').css({'height':'293px'});
        });
    $('#mz-sitenav-link-close').click(function(){
            
            // $('.mz-l-pagecontent').css('top','0px');
            $('.nav-menu-details').css({'height':'0px'});
            $('.closeSubNav').css({'display':'none'});
               
    });
    
    
});




