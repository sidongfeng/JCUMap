$(document).ready(function() {
    "use strict";

    $(".submit").attr("disabled","true");

    var oInput = document.getElementById('fileInput');
    oInput.onchange = function() {
        if(this.value != '') {
            $(".submit").removeAttr("disabled");
        }else {
            $(".submit").attr("disabled","true");
        }
    }
});