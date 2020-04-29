/* TODO:  */

$(document).ready(function() {
    
    "use strict";

    var Step4Slice = [1,2,3,5,10,16,25,35,39,45,49,51,54,57,63,69];
    var SubjectCode = "";
    var SubjectName = "";
    var SubjectCoordinator = "";
    var SubjectDescription = "";
    var CreditPoints = 0;
    var StudyYear = 0;
    var TeachingPeriod = 0;
    var SLOCount = 0;
    var MappingClassList = [];
    var PieceOfAssessmentList = [];

    $.ajax({
        type: "GET",
        url: "../data/COMP4130.xml",
        dataType: "xml",
        async: false, //设置为同步请求
        error: function(xml)
        {
            alert("XML Not found!");
        },
        success: function (ResponseText) {
            SubjectCode = $(ResponseText).find('SubjectCode').text();
            SubjectName = $(ResponseText).find('SubjectName').text();
            SubjectCoordinator = $(ResponseText).find('SubjectCoordinator').text();
            SubjectDescription = $(ResponseText).find('SubjectDescription').text();
            CreditPoints = $(ResponseText).find('CreditPoints').text();
            StudyYear = $(ResponseText).find('StudyYear').text();
            TeachingPeriod = $(ResponseText).find('TeachingPeriod').text();
            SLOCount = parseInt($(ResponseText).find('SLOCount').text());

            var MappingClass = $(ResponseText).find('MappingClass');
            for (var i=0; i<MappingClass.length; i++){
                var SubjectLearningOutcome = MappingClass.eq(i).find('SubjectLearningOutcome').text();
                var DLList = [];
                var IsTickedList = [];
                MappingClass.eq(i).find('ChildCompetencies').find('ChildCompetencies').find('ChildCompetencies').each(function() {
                    var DL = $(this).find('DL').text();
                    var IsTicked = JSON.parse($(this).find('IsTicked').text());
                    DLList.push(DL);
                    IsTickedList.push(IsTicked);
                });
                var Mapping = {
                    "SubjectLearningOutcome": SubjectLearningOutcome,
                    "DL": DLList,
                    "IsTicked": IsTickedList
                };
                MappingClassList.push(Mapping);
            };

            var PieceOfAssessment = $(ResponseText).find('PieceOfAssessment');
            for (var i=0; i<MappingClass.length; i++){
                var PoaName = PieceOfAssessment.eq(i).find('PoaName').text();
                var PoaType = PieceOfAssessment.eq(i).find('PoaType').text();
                var PoaWeight = PieceOfAssessment.eq(i).find('PoaWeight').text();
                var PoaBreakdown = new Array(7).fill(0);
                for (var j=0; j<7; j++){
                    PoaBreakdown[j] = parseInt(PieceOfAssessment.eq(i).find('PoaBreakdown').find('Val'+(j+1)).text());
                };
                var Piece = {
                    "PoaName": PoaName,
                    "PoaType": PoaType,
                    "PoaWeight": PoaWeight,
                    "PoaBreakdown": PoaBreakdown
                };
                PieceOfAssessmentList.push(Piece);
            };
        }
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
        };
        SLOCount ++;
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
        };
        SLOCount --;
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
    let slo_index = 1;
    $('#step4next').on('click', function() {
        document.getElementById("step4-input").getElementsByClassName("title")[0].innerHTML = "<strong>SLO"+slo_index+": </strong>"+$("#SLO"+slo_index).val();
        $.ajax({
            type: "GET",
            url: "../data/COMP4130.xml",
            dataType: "xml",
            error: function(xml)
            {
                alert("XML Not found!");
            },
            success: function (ResponseText) {
                var MappingClass = $(ResponseText).find('MappingClass').eq(slo_index-1);
                var xml_slo = MappingClass.find('SubjectLearningOutcome').text();
                var user_slo = $("#SLO"+slo_index).val();
                if (user_slo == xml_slo){
                    var idx = 0;
                    var highlight = false;
                    MappingClass.find('ChildCompetencies').find('ChildCompetencies').find('ChildCompetencies').each(function() {
                        // console.log($(this).parent().find('Prefix').text() + "  " + $(this).find('Prefix').text() + "===" + $(this).find('DL').text())
                        var DL = $(this).find('DL').text();
                        $(".step4-input-checkbox").eq(idx).find("select").find("option:contains('DL"+DL+"')").attr("selected", true);
                        var IsTicked = JSON.parse($(this).find('IsTicked').text());
                        if (IsTicked){
                            $(".step4-input-checkbox").eq(idx).find("input").attr("checked", true);
                            $(".step4-input-checkbox").eq(idx).parent().parent().addClass('highlight');
                            highlight = true;
                        };
                        idx ++;
                        // if (Step4Slice.indexOf(idx) != -1){
                        //     if (highlight){
                        //         $("li[data-type='"+ Step4Slice.indexOf(idx) +"'").addClass('highlight');
                        //     }
                        // }
                    });
                }else{
                    console.log("clean")
                    init_step4();
                };
            },
            complete: function (){
                slo_index ++;
            }
        });
        // slo_index ++;
        
    });

    var init_step4 = function(){
        $(".step4-input-checkbox").each(function() {
            $(this).find("select").find("option:contains('DL1')").attr("selected", false);
            $(this).find("input").attr("checked", false);
            $(this).parent().parent().removeClass('highlight');
        });
    };


    /* Load Step 2 */ 
    var Load_Step2 = function(){
        $("#SubjectCode").val(SubjectCode);
        $("#SubjectName").val(SubjectName);
        $("#SubjectCoordinator").val(SubjectCoordinator);
        $("#SubjectDescription").val(SubjectDescription);
        $("#CreditPoints").find("option:contains('"+CreditPoints+"')").attr("selected", true);
        $("#StudyYear").get(0).selectedIndex=StudyYear;
        $("#TeachingPeriod").get(0).selectedIndex=TeachingPeriod;
    };

    /* Store Step 2 */ 
    var Store_Step2 = function(){
        SubjectCode = $("#SubjectCode").val();
        SubjectName = $("#SubjectName").val();
        SubjectCoordinator = $("#SubjectCoordinator").val();
        SubjectDescription = $("#SubjectDescription").val();
        CreditPoints = $("#CreditPoints").get(0).selectedIndex;
        StudyYear = $("#StudyYear").get(0).selectedIndex;
        TeachingPeriod = $("#TeachingPeriod").get(0).selectedIndex;
    };

    /* Load Step 3 */ 
    var Load_Step3 = function(){
        if (MappingClassList.length <= 5){
            $("#remove").attr("disabled","true");
        }else{
            $("#remove").removeAttr("disabled");
        }
        if (MappingClassList.length >= 7){
            $("#add").attr("disabled","true");
        }else{
            $("#add").removeAttr("disabled");
        }
        for (var i=0; i<MappingClassList.length; i++){
            if  (i > 5){
                var html = "";
                html += '<div class="row">';
                html += '   <div class="col-lg-2">';
                html += '       <p>SLO' + (i+1) +'</p>';
                html += '   </div>';
                html += '   <div class="col-lg-10">';
                html += '       <textarea class="form-input small-input" id="SLO'+ (i+1) + '">' + MappingClassList[i]["SubjectLearningOutcome"] + '</textarea>';
                html += '   </div>';
                html += '</div>';
                $("#step3-input").append(html);
            }else{
                $("#SLO"+(i+1)).val(MappingClassList[i]["SubjectLearningOutcome"]);
            };
        };
    };

    /* Store Step 3 */ 
    var Store_Step3 = function(){
        var newMapping = $("#step3-input").find(".form-input").length - MappingClassList.length;
        for (var i=0; i<newMapping; i++){
            var Mapping = {
                "SubjectLearningOutcome": "",
                "DL": new Array(69).fill("1"),
                "IsTicked": new Array(69).fill(false)
            };
            MappingClassList.push(Mapping);
        };
        for (var i=0; i<$("#step3-input").find(".form-input").length; i++){
            var text = $("#step3-input").find(".form-input").eq(i).val();
            if (text != MappingClassList[i]["SubjectLearningOutcome"]){
                var Mapping = {
                    "SubjectLearningOutcome": text,
                    "DL": new Array(69).fill("1"),
                    "IsTicked": new Array(69).fill(false)
                };
                MappingClassList[i] = Mapping;
            }
        };
    };

    /* Load Step 4 */ 
    var Load_Step4 = function(index){
        var SubjectLearningOutcome = MappingClassList[index]['SubjectLearningOutcome'];
        var DLList = MappingClassList[index]['DL'];
        var IsTickedList = MappingClassList[index]['IsTicked'];
        document.getElementById("step4-input").getElementsByClassName("title")[0].innerHTML = "<strong>SLO"+(index+1)+": </strong>"+SubjectLearningOutcome;
        for (var i=0; i<DLList.length; i++){
            if (DLList[i] == "1"){
                // BUG: if add slo, it does not show DL1
                $(".step4-input-checkbox").eq(i).find("select").find("option:contains('DL1')").attr("selected", false);
            }else{
                $(".step4-input-checkbox").eq(i).find("select").find("option:contains('DL"+DLList[i]+"')").attr("selected", true);
            }
            if (IsTickedList[i]){
                $(".step4-input-checkbox").eq(i).find("input").attr("checked", true);
                $(".step4-input-checkbox").eq(i).parent().parent().addClass('highlight');
            }else{
                $(".step4-input-checkbox").eq(i).find("input").attr("checked", false);
                $(".step4-input-checkbox").eq(i).parent().parent().removeClass('highlight');
            };
        };
    };

    /* Store Step 4 */ 
    var Store_Step4 = function(index){
        var DLList = [];
        var IsTickedList = [];
        $(".step4-input-checkbox").each(function() {
            var select_value = $(this).find("select").get(0).selectedIndex+1;
            var checkbox_value = $(this).find("input").is(':checked');
            DLList.push(""+select_value);
            IsTickedList.push(checkbox_value);
        });
        MappingClassList[index]["DL"] = DLList;
        MappingClassList[index]["IsTicked"] = IsTickedList;
    };

    /* Load Step 5 */ 
    var Load_Step5 = function(){
        var html = '<div class="row">';
        for (var i=0; i<MappingClassList.length; i++){
            var SubjectLearningOutcome = MappingClassList[i]['SubjectLearningOutcome'];
            html += '   <div class="col-lg-1">';
            html += '       <strong>SLO'+(i+1)+':</strong>';
            html += '   </div>';
            html += '   <div class="col-lg-11">';
            html += '       <p>'+SubjectLearningOutcome+'</p>';
            html += '   </div>';
        };
        $(".step5-slo").append(html);
        var html = '';
        html += '<table class="table">';
        html += '   <thead>';
        html += '       <tr>';
        html += '           <th rowspan="2">Assessment Piece</th>';
        html += '           <th rowspan="2">Category</th>';
        html += '           <th>Weight</th>';
        html += '           <th colspan="5">Percentage Breakdown (/100% per piece)</th>';
        html += '           <th></th>';
        html += '       </tr>';
        html += '       <tr>';
        html += '           <th>(%)</th>';
        for (var i=0; i<MappingClassList.length; i++){
            html += '       <th>SLO'+(i+1)+'</th>';
        };
        html += '           <th></th>';
        html += '       </tr>';
        html += '   </thead>';
        html += '   <tbody>';
        for (var j=0; j<PieceOfAssessmentList.length; j++){
            html += '      <tr>';
            html += '          <td>';
            html += '              <input type="text" name="PoaName'+j+'" value="'+PieceOfAssessmentList[j]['PoaName']+'">';
            html += '          </td>';
            html += '          <td>';
            html += '              <select class="form-select-large" id="PoaType'+j+'">';
            html += '                  <option value ="6.0">6.0</option>';
            html += '              </select>';
            html += '          </td>';
            html += '          <td>';
            html += '              <input type="text" name="PoaWeight'+j+'" value="'+PieceOfAssessmentList[j]['PoaWeight']+'">';
            html += '           </td>';
            for (var i=0; i<MappingClassList.length; i++){
                html += '       <td>';
                html += '           <input type="text" name="Val'+i+''+j+'" value="'+PieceOfAssessmentList[j]['PoaBreakdown'][i]+'">';
                html += '       </td>';
            };
            html += '           <td>100</td>';
            html += '       </tr>';
        };
        html += '   <tbody>';
        html += '</table>';
        $(".table-responsive").append(html);
        
    };

    var step = 9;
    var step4inner = 0;
    $('#next').on('click', function() {
        switch(true) {
            case step == 0:
                console.log("error")
                break;
            case step == 1:
                window.location.href = "/"
                break;
            case step == 2:
                Load_Step2();
                console.log("Step 2")
                break;
            case step == 3:
                Store_Step2();
                Load_Step3();
                console.log("Step 3")
                break;
            case step == 4:
                Store_Step3();
                Load_Step4(step4inner);
                console.log("Step 4-"+step4inner)
                step4inner++;
                break;
            case step >= 5 && step < 4 + SLOCount:
                Store_Step4(step4inner-1);
                Load_Step4(step4inner);
                console.log("Step 4-"+step4inner);
                step4inner++;
                break;
            case step == 4 + SLOCount:
                // Store_Step4(step4inner-1);
                Load_Step5();
                console.log("Step 5")
                break;
            default:
                console.log("error")
        };
        if (step >= 4 && step < 4 + SLOCount){
            $(".page").siblings().addClass("hide");
            $("#step4").removeClass("hide");
        }else if (step >= 4 + SLOCount){
            $(".page").siblings().addClass("hide");
            $("#step"+(step-SLOCount+1)).removeClass("hide");
        }else{
            $(".page").siblings().addClass("hide");
            $("#step"+step).removeClass("hide");
        }
        step ++;
    });
    
    
});
