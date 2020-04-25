/* TODO: line 42: html += '       <textarea class="form-input small-input" id="'+ id + '">'+ ????? +'</textarea>'; */

$(document).ready(function() {
    
    "use strict";

    $.ajax({
        type: "GET",
        url: "../data/COMP4130.xml",
        dataType: "xml",
        error: function(xml)
        {
            alert("XML Not found!");
        },
        success: function (ResponseText) {
            /* Load Step 2 */ 
            var SubjectCode = $(ResponseText).find('SubjectCode').text();
            var SubjectName = $(ResponseText).find('SubjectName').text();
            var SubjectCoordinator = $(ResponseText).find('SubjectCoordinator').text();
            var SubjectDescription = $(ResponseText).find('SubjectDescription').text();
            var CreditPoints = $(ResponseText).find('CreditPoints').text();
            var StudyYear = $(ResponseText).find('StudyYear').text();
            var TeachingPeriod = $(ResponseText).find('TeachingPeriod').text();
            $("#SubjectCode").val(SubjectCode);
            $("#SubjectName").val(SubjectName);
            $("#SubjectCoordinator").val(SubjectCoordinator);
            $("#SubjectDescription").val(SubjectDescription);
            $("#CreditPoints").find("option:contains('"+CreditPoints+"')").attr("selected", true);
            $("#StudyYear").get(0).selectedIndex=StudyYear;
            $("#TeachingPeriod").get(0).selectedIndex=TeachingPeriod;
            /* Load Step 3 */ 
            var SLOCount = $(ResponseText).find('SLOCount').text();
            for (var i=0; i<SLOCount; i++){
                var id = 'SLO'+(i+1);
                if (i > 5){
                    var html = "";
                    html += '<div class="row">';
                    html += '   <div class="col-lg-2">';
                    html += '       <p>' + id +'</p>';
                    html += '   </div>';
                    html += '   <div class="col-lg-10">';
                    html += '       <textarea class="form-input small-input" id="'+ id + '"></textarea>';
                    html += '   </div>';
                    html += '</div>';
                    $("#step3").append(html);
                } else {

                }
            }
            // $(ResponseText).find('SubjectLearningOutcome').each(function () {
            //     // var first = $(this).find('firstName').text();
            //     console.log($(this))
            // })
            console.log(ResponseText)
            // $("#SubjectCode").val(SubjectCode);
            // $("#SubjectCode").val(SubjectCode);
            // $("#SubjectCode").val(SubjectCode);
            // $("#SubjectCode").val(SubjectCode);
        //   $(ResponseText).find('friend').each(function () {
        //     var first = $(this).find('firstName').text();
        //     var last = $(this).find('lastName').text();
        //     var city = $(this).find('city').text();
        //     table += "<tr><td>" + first + "</td><td>" + last + "</td><td>" + city + "</td></tr>";
        //   })
        //   table += "</table>";
        }
      });


      $('#next').on('click', function() {
        $(this).addClass("active-page").siblings().removeClass('active-page');
    });
});