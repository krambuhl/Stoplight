(function($){  
    var settings = {
        errorClass: 'error'
    };
    
    var rules = {
        required        : ["required",      "%1 is required."],
        
        min_length      : ["min",           "%1 is too short, it should be at least %2 characters long."],
        max_length      : ["max",           "%1 is too long, it should be less than %2 characters long."],
        exact_length    : ["exact",         "%1 needs to be %2 characters long."],
        
        greater         : ["greater",       "%1 is less than %2."],
        less            : ["less",          "%1 needs to be %2 characters long."],
        
        alpha           : ["alpha",         "%1 should only contain lower and upper case letters."],
        alpha_numeric   : ["alpha-numeric", "%1 should only contain letters and numbers."],
        alpha_dash      : ["alpha-dash",    "%1 should only contain letters, numbers, underscores and dashes."],
        numeric         : ["numeric",       "%1 should only contain numbers."],
        
        natural         : ["natural",       "%1 should be a counting number (0, 1, 2)."],
        nonzero         : ["nonzero",       "%1 should be a number other than zero."],
        
        email           : ["email",         "%1 is invalid, it should be in email format (e.mail@gmail.com)."],
        emails          : ["emails",        "%1 are invalid, they should be a comma sepperated list of emails (e.mail@gmail.com, a.mail@email.com)."],
        ip              : ["ip",            "&1 needs to be a valid IP address (192.168.1.1)"],
        base64          : ["base64",        "%1 is not a valid base64 string"],
        
        cc_number       : ["cc-num",        "%1 is an invalid credit-card number."],
        
        phone           : ["phone",         "%1 is an invalid phone number, it should be a 10 digit number (503-555-1234)"],
        address         : ["address",       "%1 is not a valid address, it should be in this format: 12345 SW Fake Lane #555."]
    };
    
    $.fn.stoplight = function() {
        return this.each(function() {
            $(this).bind('blur', function() {
                $rules = parseRules($(this).data('rules')); 
                
                /*
                    Get what rule that rule title belongs to
                    
                    check rule sending arguments
                        if true do nothing
                        if false 
                            add error code to error box
                            add error class to textbox
                            prevent default 
                            
                        if all are true add success class to textbox
                        
                                        
                
                */
            })
        });
    };

    /*  
     *  @input    rule string
     *  @returns  array of rule objects 
     *            Array( {rule, args...}, {rule, args...} )
     */
    var parseRules = function (ruleStr) {
        ret = Array();
        
        temp = $.trim(ruleStr).split(';'); 
        if (temp.length > 1) temp.pop();
        
        $.each(temp, function (i, iv) {
            split = iv.split(':');
            ret[i] = Array( $.trim(split[0]) );
           
            temp = $.trim(split[1]).split(',');
            if (temp.length > 1) temp.pop();

            $.each(temp, function (j, jv) {
                ret[i].push($.trim(jv));
            });
        });
        
        return ret;
    } 
    
    /*
     *  Validate Functions
     *  @input varies:
     *      arguments[0] is input value.
     *      arguments[1]+ are arguments.
     *  @returns true  if validation passes
     *  @returns false if validation fails
     */
    var validate = {
        required        : function () {return (arguments[0] != "") ? true : false;},
        
        min_length      : function () {return arguments[0].length >= arguments[1] ? true : false;},
        max_length      : function () {return arguments[0].length <= arguments[1] ? true : false;},
        exact_length    : function () {return arguments[0].length == arguments[1] ? true : false;},
        
        greater         : function () {return arguments[0] >  arguments[1] ? true : false;},
        less            : function () {return arguments[0] <  arguments[1] ? true : false;},
        equal           : function () {return arguments[0] == arguments[1] ? true : false;},
        
        alpha           : function () {return (/^[a-z]+$/i.test(arguments[0]))      ? true : false;},
        alpha_numeric   : function () {return (/^[a-z0-9]+$/i.test(arguments[0]))   ? true : false;},
        alpha_dash      : function () {return (/^[a-z0-9-_]+$/i.test(arguments[0])) ? true : false;},
        numeric         : function () {return (/^[0-9]+$/.test(arguments[0]))       ? true : false;},
        
        natural         : function () {return (/^+?[1-9][0-9]*$/.test(arguments[0]))    ? true : false;},
        nonzero         : function () {return (/^(0|[1-9][0-9]*)$/.test(arguments[0]))  ? true : false;},
        
        email           : function () {return lrex.email.test(arguments[0]) ? true : false;},
        emails          : function () { 
                            var temp = $.trim(arguments[0]).split(',');
                            if (temp.length > 1) temp.pop();
                            
                            $.each(temp, function (i, iv) {
                               if (!this.email(iv))
                                   return false;
                            });
                            return true;
                        },
        ip              : function () {}
        
    };
    
    var utility = {        
        prepUrl: function (url) {
            return (url.indexOf('http://') != -1) ? url : 'http://' + url;
        }, 
        lprint: function (str) { // lite sprint javscript implimentation
            var pattern = new RegExp("%([1-" + arguments.length + "])", "g");  
            return str(string).replace(pattern, function(match, index) { 
                return arguments[index]; 
            });  
        }         
    };
    
    var lrex = {
        email       : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        ip          : /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/,
        cc_number   : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        phone       : /s/
    }
})(jQuery);