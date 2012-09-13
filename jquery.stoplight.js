(function($){  
    var settings = {
        errorClass: 'error'
    };
    
    var rules = {
        required        : "%1 is required.",
        
        min_length      : "%1 is too short, it should be at least %2 characters long.",
        max_length      : "%1 is too long, it should be less than %2 characters long.",
        exact_length    : "%1 needs to be %2 characters long.",
        between         : "%1 needs to be bettern %2 and %3 characters long.",
        
        greater         : "%1 is less than %2.",
        less            : "%1 needs to be %2 characters long.",
        
        alpha           : "%1 should only contain lower and upper case letters.",
        alpha_numeric   : "%1 should only contain letters and numbers.",
        alpha_dash      : "%1 should only contain letters, numbers, underscores and dashes.",
        numeric         : "%1 should only contain numbers.",
        
        natural         : "%1 should be a counting number (0, 1, 2).",
        nonzero         : "%1 should be a number other than zero.",
        
        email           : "%1 is invalid, it should be in email format (e.mail@gmail.com).",
        emails          : "%1 are invalid, they should be a comma sepperated list of emails (e.mail@gmail.com, a.mail@email.com).",
        ip              : "&1 needs to be a valid IP address (192.168.1.1)",
        base64          : "%1 is not a valid base64 string",
        
        cc_number       : "%1 is an invalid credit-card number.",
        
        phone           : "%1 is an invalid phone number, it should be a 10 digit number (503-555-1234)",
        address         : "%1 is not a valid address, it should be in this format: 12345 SW Fake Lane #555."
    };
    
    
    $.fn.stoplight = function () {
        return this.each(function() {
            $("input", this).bind('blur', function() {
                var $rules = parseRules($(this).data('rules')),
                    name   = $(this).siblings(".stoplight-name").text() || $(this).val() || "input",
                    econt  = $(this).siblings(".stoplight-error")[0]
                    ival   = $(this).val(),
                    passed = true;
                
                $(econt).html('');
                
                $.each($rules, function(index, value) {                     
                    if ( !validate[value[0]](ival, value[1], value[2], value[3]) ) {
                        passed = false;
                        var error = utility.lprint(rules[value[0]], name, value[1]);
                        
                        $(econt).append("<li>" + error + "</li>");
                    }
                });
                
                if (passed) 
                    $(this).removeClass('error').addClass('valid');
                else
                    $(this).removeClass('valid').addClass('error');  
        
            })
        });
    };
    

    /*  
     *  @input    rule string
     *  @returns  array of rule objects 
     *            Array( {rule, args...}, {rule, args...} )
     */
    var parseRules = function (ruleStr) {
        var ret = Array(),
            temp = $.trim(ruleStr).split(';'); 
            
        if (temp[temp.length-1] == "") temp.pop();
                
        $.each(temp, function (i, iv) {
            var split = iv.split(':'),
                reti  = Array( $.trim(split[0]) );
            
            $.each($.trim(split[1]).split(','), function (j, jv) {
                if (jv != "") reti.push($.trim(jv));
            });
            
            ret.push(reti);
        });
        
        return ret;
    },
    
    
    /*
     *  Validate Functions
     *  @input varies:
     *      arguments[0] is input value.
     *      arguments[1]+ are arguments.
     *  @returns true  if validation passes
     *  @returns false if validation fails
     */
    validate = {
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
        lprint: function (string) {  
            var args = arguments;  
            var pattern = new RegExp("%([1-" + arguments.length + "])", "g");  
            
            return String(string).replace(pattern, function(match, index) {  
                return args[index];  
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