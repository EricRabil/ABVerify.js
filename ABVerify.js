//
// ABVerify.js
// by AppleBetas (github.com/AppleBetas)
//
// Please make sure this header stays intact when using the script.
//

$.fn.ABVerify = function() {
    $(this).submit(function(e) {
        var form = $(this);
        var failedElements = [];
        form.find("span.abverify-fail-text").remove();
        form.find("input[type=number], input[type=password], input[type=text], input[type=search], input[type=tel], input[type=url], input[type=email], textarea").each(function() {
            $(this).removeClass("abverify-failed");
            var dataAttributes = this.dataset;
            var abDataAttributes = {};
            $.each(dataAttributes, function(i, item) {
                if(i != "abverifyMessage") {
                    if(i.startsWith("abverify")) {
                        if(!i.endsWith("Message")) {
                            abDataAttributes[cleanseName(i)] = item;
                        }
                    }
                }
            });
            if(count(abDataAttributes) > 0) {
                var failedChecks = {};
                var input = $(this);
                $.each(abDataAttributes, function(i, item) {
                    if(!performCheck(i, item, input.val())) {
                        failedChecks[i] = item;
                    }
                });
                if(count(failedChecks) > 0) {
                    var message = getMessage(this, failedChecks);                    
                    failedElements.push(this);
                    $(this).addClass("abverify-failed");
                    $(this).after("<span class=\"abverify-fail-text\">" + message + "</span>");
                }
            }
        }).on("keydown paste keyup textchanged", function() {
            $(this).removeClass("abverify-failed");
            if($(this).next().is("span.abverify-fail-text")) {
                $(this).next().remove();
            }
        });
        form.find("div[data-abverify-required=true]").each(function() {
            var group = $(this);
            var valid = false;
            $(this).children("input[type=radio]").each(function() {
                if($(this).is(":checked")) {
                    valid = true;
                }
            }).click(function() {
                group.removeClass("abverify-failed");
                group.find("span.abverify-fail-text").remove();
            });
            if(!valid) {
                failedElements.push(this);
                $(this).addClass("abverify-failed");
                var message = getMessage(this, {abRequired: true});
                $(this).append("<span class=\"abverify-fail-text\">" + message + "</span>");
            }
        });
        if (failedElements.length > 0) {
            e.preventDefault();
            $(document).scrollTop($(failedElements[0]).offset().top - 50);
        }
    });
    
    function getMessage(element, failedChecks) {
        var dataAttributes = element.dataset;
        var abMessages = {};
        var messageOverride = null;
        $.each(dataAttributes, function(i, item) {
            if(i == "abverifyMessage") {
                messageOverride = item;
            } else {
                if(i.startsWith("abverify")) {
                    if(i.endsWith("Message")) {
                        abMessages[cleanseName(i)] = item;
                    }
                }
            }
        });
        var message = "";
        if(messageOverride != null) {
            message = messageOverride;
        } else {
            var messages = [];
            $.each(failedChecks, function(i, item) {
                if (i in abMessages) {
                    messages.push(properize(abMessages[i]));
                } else {
                    messages.push(getFailMessage(i, item));
                }
            });
            message = messages.join(" ");
        }
        return message;
    }
    
    function performCheck(name, argument, value) {
        if(name == "Required") {
            if(value == null || value == "") {
                return !argument;
            } else {
                return argument;
            }
        } else if(name == "MaxLength") {
            return value.length <= argument
        } else if(name == "MinLength") {
            return value.length >= argument
        } else if(name == "EqualTo") {
            return value == argument
        } else if(name == "NotEqualTo") {
            return value != argument
        } else if(isNumeric(value)) {
            if(name == "NumGreaterThan") {
                return value > argument
            } else if(name == "NumGreaterThanOrEqualTo") {
                return value >= argument
            } else if(name == "NumLessThan") {
                return value < argument
            } else if(name == "NumLessThanOrEqualTo") {
                return value <= argument
            } else if(name == "NumWhole") {
                if(isWholeNumber(value)) {
                    return argument;
                } else {
                    return !argument;
                }
            }
        } else if(name == "TextContains") {
            return value.includes(argument)
        } else if(name == "TextDoesntContain") {
            return !value.includes(argument)
        } else if(name == "TextStartsWith") {
            return value.startsWith(argument)
        } else if(name == "TextDoesntStartWith") {
            return !value.startsWith(argument)
        } else if(name == "TextEndsWith") {
            return value.endsWith(argument)
        } else if(name == "TextDoesntEndWith") {
            return !value.endsWith(argument)
        } else if(name == "IsEmailAddress") {
            if(isValidEmail(value)) {
                return argument;
            } else {
                return !argument;
            }
        } else if(name == "IsUrl") {
            if(isValidURL(value)) {
                return argument;
            } else {
                return !argument;
            }
        } else if(name == "IsNumber") {
            if(isNumeric(value)) {
                return argument;
            } else {
                return !argument;
            }
        }
        
        return false;
    }
    
    function getFailMessage(name, argument) {
        if(name == "Required") {
            if(argument) {
                return "This field must be filled in.";
            } else {
                return "This field must not be filled in.";
            }
        } else if(name == "MaxLength") {
            return "This is too long. Enter something " + argument + " character" + (argument == 1 ? "" : "s") + " long or less.";
        } else if(name == "MinLength") {
            return "This is too short. Enter something " + argument + " character" + (argument == 1 ? "" : "s") + " long or more.";
        } else if(name == "EqualTo") {
            return "This must equal the text \"" + argument + "\".";
        } else if(name == "NotEqualTo") {
            return "This cannot equal the text \"" + argument + "\".";
        } else if(name == "NumGreaterThan") {
            return "This must be a number greater than " + argument + ".";
        } else if(name == "NumGreaterThanOrEqualTo") {
            return "This must be a number greater than or equal to " + argument + ".";
        } else if(name == "NumLessThan") {
            return "This must be a number less than " + argument + ".";
        } else if(name == "NumLessThanOrEqualTo") {
            return "This must be a number less than or equal to " + argument + ".";
        } else if(name == "NumWhole") {
            if(argument) {
                return "This must be a whole number.";
            } else {
                return "This cannot be a whole number.";
            }
        } else if(name == "TextContains") {
            return "This must contain the text \"" + argument + "\".";
        } else if(name == "TextDoesntContain") {
            return "This cannot contain the text \"" + argument + "\".";
        } else if(name == "TextStartsWith") {
            return "This must start with the text \"" + argument + "\".";
        } else if(name == "TextDoesntStartWith") {
            return "This cannot start with the text \"" + argument + "\".";
        } else if(name == "TextEndsWith") {
            return "This must end with the text \"" + argument + "\".";
        } else if(name == "TextDoesntEndWith") {
            return "This cannot end with the text \"" + argument + "\".";
        } else if(name == "IsEmailAddress") {
            if(argument) {
                return "This must be a valid email address.";
            } else {
                return "This cannot be an email address.";
            }
        } else if(name == "IsUrl") {
            if(argument) {
                return "This must be a valid URL.";
            } else {
                return "This cannot be a URL.";
            }
        } else if(name == "IsNumber") {
            if(argument) {
                return "This must be a number.";
            } else {
                return "This cannot be a number.";
            }
        }
        
        return "You did not fill this out properly.";
    }
        
    function cleanseName(name) {
        var prefix = "abverify";
        var suffix = "Message";
        if(name.startsWith(prefix)) {
            name = name.slice(prefix.length);
        }
        if(name.endsWith(suffix)) {
            name = name.substr(0, name.length - suffix.length)
        }
        return name;
    }
                    
    function properize(sentence) {
        if(!(sentence.endsWith(".") || sentence.endsWith("!") || sentence.endsWith("?"))) {
            sentence += "."
        }
        return sentence;
    }
    
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    
    function isWholeNumber(n) {
        return isNumeric(n) && (n % 1 == 0);
    }
    
    function isValidEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    function isValidURL(url) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(url);
    }
    
    function count(obj) {
        return Object.keys(obj).length;
    }
}
