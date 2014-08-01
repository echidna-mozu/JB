require([
    "modules/jquery-mozu",
    "shim!vendor/underscore>_", 
    "hyprlive", 
    "modules/backbone-mozu", 
    "shim!vendor/isotope.min[jQuery=jquery]"], function ($, _, Hypr, Backbone) {
    
    $(document).ready(function(){
        
        $('.mz-utilitynav-myaccount').click(function(event){
            event.preventDefault();
            if($('.jb-my-account-alert').height() === 0 ){
                $('.jb-my-account-alert').css({'height':'300px','top':'0px'});
            }else{
                $('.jb-my-account-alert').css({'height':'0px','top':'-42px'});
            }
        });
        
        
        $('#accountInfoClose').click(function(event){
            event.preventDefault();
            $('.jb-my-account-alert').css({'height':'0px','top':'-42px'});
        });
        
    });
    });
    
    

