/* TODO:  */

$(document).ready(function() {
    
    "use strict";

    var Step4Slice = [1,2,3,5,10,16,25,35,39,45,49,51,54,57,63,69];

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
            var i = 0;
            $(ResponseText).find('MappingClass').each(function () {
                var id = 'SLO'+(i+1);
                if (i+1 <= 5){
                    $("#remove").attr("disabled","true");
                }else{
                    $("#remove").removeAttr("disabled");
                }
                if (i+1 >= 7){
                    $("#add").attr("disabled","true");
                }else{
                    $("#add").removeAttr("disabled");
                }
                var SubjectLearningOutcome = $(this).find('SubjectLearningOutcome').text();
                if  (i > 5){
                    var html = "";
                    html += '<div class="row">';
                    html += '   <div class="col-lg-2">';
                    html += '       <p>' + id +'</p>';
                    html += '   </div>';
                    html += '   <div class="col-lg-10">';
                    html += '       <textarea class="form-input small-input" id="'+ id + '">' + SubjectLearningOutcome + '</textarea>';
                    html += '   </div>';
                    html += '</div>';
                    $("#step3-input").append(html);
                }else{
                    $("#"+id).val(SubjectLearningOutcome);
                }
                i ++;
            })
            // $(ResponseText).find('SubjectLearningOutcome').each(function () {
            //     // var first = $(this).find('firstName').text();
            //     console.log($(this))
            // })
            // console.log(ResponseText)
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

    /* Step 3 Add function  */
    $('#add').on('click', function() {
        var id = 'SLO' + ($("#step3-input").children('div').length + 1);
        var html = "";
        html += '<div class="row">';
        html += '   <div class="col-lg-2">';
        html += '       <p>' + id +'</p>';
        html += '   </div>';
        html += '   <div class="col-lg-10">';
        html += '       <textarea class="form-input small-input" id="'+ id + '"></textarea>';
        html += '   </div>';
        html += '</div>';
        $("#step3-input").append(html);
        if ($("#step3-input").children('div').length >= 7){
            $("#add").attr("disabled","true");
        }else{
            $("#add").removeAttr("disabled");
        }
        if ($("#step3-input").children('div').length <= 5){
            $("#remove").attr("disabled","true");
        }else{
            $("#remove").removeAttr("disabled");
        }
    });

    /* Step 3 Remove function  */
    $('#remove').on('click', function() {
        $("#step3-input").children(':last-child').remove();
        if ($("#step3-input").children('div').length >= 7){
            $("#add").attr("disabled","true");
        }else{
            $("#add").removeAttr("disabled");
        }
        if ($("#step3-input").children('div').length <= 5){
            $("#remove").attr("disabled","true");
        }else{
            $("#remove").removeAttr("disabled");
        }
    });

    /* Step 4 Function  */
    $(".step4-input-left-content li .left-content-title").click(function(){
        $(this).toggleClass("hover");
        $(this).next(".left-content-txt").slideToggle()
    })

    $(".left-content-txt-item").click(function(){
        $(this).toggleClass("active").siblings().removeClass("active");
        if ($(this).hasClass("active")){
            $(".right-content").addClass('hide').eq($(this).attr('data-type')).removeClass('hide');
        }else{
            $(".right-content").addClass('hide')
        }
    })

    $(".right-content-txt-select").hover(function(){
        $(".DL-image").removeClass('hide');
    },function(){
        $(".DL-image").addClass('hide');
    });

    $('.checkbox-inline input').click(function() {
        if ($(this).prop("checked")){
            $(this).parent().parent().parent().addClass('highlight');
        }else{
            $(this).parent().parent().parent().removeClass('highlight');
        }
    });
    
    /* Load Step 4 */
    $('#step3-step4').on('click', function() {
        $.ajax({
            type: "GET",
            url: "../data/COMP4130.xml",
            dataType: "xml",
            error: function(xml)
            {
                alert("XML Not found!");
            },
            success: function (ResponseText) {
                var i = 0;
                $(ResponseText).find('MappingClass').each(function () {
                    var id = 'SLO'+(i+1);
                    var user_slo = $("#"+id).val();
                    var xml_slo = $(this).find('SubjectLearningOutcome').text();
                    if (user_slo == xml_slo){
                        var idx = 0;
                        var highlight = false;
                        $(this).find('ChildCompetencies').find('ChildCompetencies').find('ChildCompetencies').each(function() {
                            var DL = $(this).find('DL');
                            $("#step4-"+id+"-select"+idx).find("option:contains('DL"+DL+"')").attr("selected", true);
                            var IsTicked = JSON.parse($(this).find('IsTicked').text());
                            if (IsTicked){
                                $("#step4-"+id+"-checkbox"+idx).attr("checked", true);
                                $("#step4-"+id+"-checkbox"+idx).parent().parent().parent().addClass('highlight');
                                highlight = true;
                            };

                            idx ++;
                            if (Step4Slice.indexOf(idx) != -1){
                                if (highlight){
                                    $("li[data-type='"+ Step4Slice.indexOf(idx) +"'").addClass('highlight');
                                }
                            }
                        });
                    }
                    i ++;
                })
            }
        });
    });

    
});