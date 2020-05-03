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

    var getQueryVariable = function(variable){
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    var filename = getQueryVariable('filename');
    if (filename=='-1'){
        console.log('Initial XML')
        MappingClassList.push({
            "SubjectLearningOutcome": "",
            "DL": new Array(69).fill("1"),
            "IsTicked": new Array(69).fill(false)
        });
        PieceOfAssessmentList.push({
            "PoaName": "",
            "PoaType": 0,
            "PoaWeight": 0,
            "PoaBreakdown": new Array(7).fill(0)
        })
    }else{
        console.log('Load XML')
        $.ajax({
            type: "GET",
            url: "../data/"+filename,
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
    }
    




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


    var init_step4 = function(){
        $(".step4-input-checkbox").each(function() {
            $(this).find("select").find("option:contains('DL1')").attr("selected", false);
            $(this).find("input").attr("checked", false);
            $(this).parent().parent().removeClass('highlight');
        });
    };

    /* Step 5 Function */ 
    $('#step5-remove').click(function() {
        if ($(".step5-tbody").find("tr").length>2){
            $(".step5-tbody").find("tr").eq(-2).remove();
        };
        if ($(".step5-tbody").find("tr").length<=2){
            $("#step5-remove").attr("disabled","true");
        };
    });

    $('#step5-add').click(function() {
        var html = "";
        var j = $(".step5-tbody").find("tr").length - 1;
        html += '      <tr>';
        html += '          <td>';
        html += '              <input type="text" name="PoaName'+j+'" value="">';
        html += '          </td>';
        html += '          <td>';
        html += '              <select class="form-select-large" id="PoaType'+j+'">';
        html += '                   <optgroup label="Exams">'
        html += '                       <option value ="0">Test/Exam (Invigilated)</option>';
        html += '                       <option value ="1">Test/Quiz (Non-Invigilated)</option>';
        html += '                       <option value ="2">Skill Test (Demonstration/Laboratory/Studio/Clinic/Field/Other)</option>';
        html += '                       <option value ="3">Objective Structured Clinical Examination</option>';
        html += '                   <optgroup label="Oral & Performance">'
        html += '                       <option value ="4">Creative Work</option>';
        html += '                       <option value ="5">Participation/Leadership</option>';
        html += '                       <option value ="6">Performance (Artistic/Exhibition/Moot Court/Other)</option>';
        html += '                       <option value ="7">Presentation (Seminar/Debate/Forum/Critique/Other)</option>';
        html += '                       <option value ="8">Teamwork Performance Evaluation</option>';
        html += '                   <optgroup label="Written Discourses">'
        html += '                       <option value ="9">Dissertation/Thesis/Research Paper</option>';
        html += '                       <option value ="10">Journal (Field/WIL/Laboratory/Reflective/Other)</option>';
        html += '                       <option value ="11">Portfolio</option>';
        html += '                       <option value ="12">Poster</option>';
        html += '                       <option value ="13">Proposal</option>';
        html += '                       <option value ="14">Report (Experimental/Analytical)</option>';
        html += '                       <option value ="15">Report (Project/Design/Research)</option>';
        html += '                       <option value ="16">Review (Literature/Critical)</option>';
        html += '                       <option value ="17">Tutorial Submission/Workbook/Logbook</option>';
        html += '                       <option value ="18">Other Writing (Abstract/Annotated Bibliography/Case Study/Essay/Other)</option>';
        html += '                   <optgroup label="Vocational">'
        html += '                       <option value ="19">Professional Practice (Planning/Execution/Report)</option>';
        html += '                       <option value ="20">Software/Manufactured Design/Other Physical Output</option>';
        html += '              </select>';
        html += '          </td>';
        html += '          <td>';
        html += '              <input class="small-width-input step5-weight-input" type="text" name="PoaWeight'+j+'" value="0">';
        html += '           </td>';
        for (var i=0; i<MappingClassList.length; i++){
            html += '       <td>';
            html += '           <input class="small-width-input step5-slo-input" type="text" name="Val'+i+''+j+'" value="0">';
            html += '       </td>';
        };
        html += '           <td class="slo-sum warning-number">0</td>';
        html += '       </tr>';
        $(".step5-tbody").find("tr:last").before(html);
        if ($(".step5-tbody").find("tr").length>2){
            $("#step5-remove").removeAttr("disabled");
        };
        /* 设置每一个weight change */
        $(".step5-weight-input").each(function(){
            $(this).bind('input propertychange', function() {
                var weight_sum = 0;
                $(".step5-weight-input").each(function(){
                    weight_sum = weight_sum + parseInt($(this).val());
                });
                $(".weight-sum").html(weight_sum);
                if (weight_sum != 100){
                    $(".weight-sum").addClass("warning-number");
                }else{
                    $(".weight-sum").removeClass("warning-number");
                };
            });
        });

        /* 设置每一个slo change */
        $(".step5-slo-input").each(function(){
            $(this).bind('input propertychange', function() {
                var slo_sum = parseInt($(this).val());
                $(this).parent().siblings().find(".step5-slo-input").each(function(){
                    slo_sum = slo_sum + parseInt($(this).val());
                });
                $(this).parent().siblings(".slo-sum").html(slo_sum);
                if (slo_sum != 100){
                    $(this).parent().siblings(".slo-sum").addClass("warning-number");
                }else{
                    $(this).parent().siblings(".slo-sum").removeClass("warning-number");
                };
            });
        });
    });



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
        $(".step5-slo").empty();
        $(".step5-slo").append(html);
        var html = '';
        var weight_sum_init = 0;
        var slo_sum_init = 0;
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
        html += '   <tbody class="step5-tbody">';
        for (var j=0; j<PieceOfAssessmentList.length; j++){
            weight_sum_init += parseInt(PieceOfAssessmentList[j]['PoaWeight']);
            slo_sum_init = 0;
            html += '      <tr>';
            html += '          <td>';
            html += '              <input type="text" name="PoaName'+j+'" value="'+PieceOfAssessmentList[j]['PoaName']+'">';
            html += '          </td>';
            html += '          <td>';
            html += '              <select class="form-select-large" id="PoaType'+j+'">';
            html += '                   <optgroup label="Exams">'
            html += '                       <option value ="0">Test/Exam (Invigilated)</option>';
            html += '                       <option value ="1">Test/Quiz (Non-Invigilated)</option>';
            html += '                       <option value ="2">Skill Test (Demonstration/Laboratory/Studio/Clinic/Field/Other)</option>';
            html += '                       <option value ="3">Objective Structured Clinical Examination</option>';
            html += '                   <optgroup label="Oral & Performance">'
            html += '                       <option value ="4">Creative Work</option>';
            html += '                       <option value ="5">Participation/Leadership</option>';
            html += '                       <option value ="6">Performance (Artistic/Exhibition/Moot Court/Other)</option>';
            html += '                       <option value ="7">Presentation (Seminar/Debate/Forum/Critique/Other)</option>';
            html += '                       <option value ="8">Teamwork Performance Evaluation</option>';
            html += '                   <optgroup label="Written Discourses">'
            html += '                       <option value ="9">Dissertation/Thesis/Research Paper</option>';
            html += '                       <option value ="10">Journal (Field/WIL/Laboratory/Reflective/Other)</option>';
            html += '                       <option value ="11">Portfolio</option>';
            html += '                       <option value ="12">Poster</option>';
            html += '                       <option value ="13">Proposal</option>';
            html += '                       <option value ="14">Report (Experimental/Analytical)</option>';
            html += '                       <option value ="15">Report (Project/Design/Research)</option>';
            html += '                       <option value ="16">Review (Literature/Critical)</option>';
            html += '                       <option value ="17">Tutorial Submission/Workbook/Logbook</option>';
            html += '                       <option value ="18">Other Writing (Abstract/Annotated Bibliography/Case Study/Essay/Other)</option>';
            html += '                   <optgroup label="Vocational">'
            html += '                       <option value ="19">Professional Practice (Planning/Execution/Report)</option>';
            html += '                       <option value ="20">Software/Manufactured Design/Other Physical Output</option>';
            html += '              </select>';
            html += '          </td>';
            html += '          <td>';
            html += '              <input class="small-width-input step5-weight-input" type="text" name="PoaWeight'+j+'" value="'+PieceOfAssessmentList[j]['PoaWeight']+'">';
            html += '           </td>';
            for (var i=0; i<MappingClassList.length; i++){
                slo_sum_init += PieceOfAssessmentList[j]['PoaBreakdown'][i];
                html += '       <td>';
                html += '           <input class="small-width-input step5-slo-input" type="text" name="Val'+i+''+j+'" value="'+PieceOfAssessmentList[j]['PoaBreakdown'][i]+'">';
                html += '       </td>';
            };
            if (slo_sum_init != 100){
                html += '           <td class="slo-sum warning-number">'+slo_sum_init+'</td>';
            }else{
                html += '           <td class="slo-sum">'+slo_sum_init+'</td>';
            }
            html += '       </tr>';
        };
        html += '       <tr>';
        html += '          <td></td>';
        html += '          <td></td>';
        if (weight_sum_init != 100){
            html += '           <td class="weight-sum warning-number">'+weight_sum_init+'</td>';
        }else{
            html += '           <td class="weight-sum">'+weight_sum_init+'</td>';
        }
        for (var i=0; i<MappingClassList.length; i++){
            html += '          <td></td>';
        };
        html += '          <td></td>';
        html += '       </tr>';
        html += '   <tbody>';
        html += '</table>';
        $(".table-responsive").empty();
        $(".table-responsive").append(html);
        if ($(".step5-tbody").find("tr").length<=2){
            $("#step5-remove").attr("disabled","true");
        };
        for (var j=0; j<PieceOfAssessmentList.length; j++){
            $("#PoaType"+j).get(0).selectedIndex=PieceOfAssessmentList[j]["PoaType"];
        };

        /* 设置每一个weight change */
        $(".step5-weight-input").each(function(){
            $(this).bind('input propertychange', function() {
                var weight_sum = 0;
                $(".step5-weight-input").each(function(){
                    weight_sum = weight_sum + parseInt($(this).val());
                });
                $(".weight-sum").html(weight_sum);
                if (weight_sum != 100){
                    $(".weight-sum").addClass("warning-number");
                }else{
                    $(".weight-sum").removeClass("warning-number");
                };
            });
        });

        /* 设置每一个slo change */
        $(".step5-slo-input").each(function(){
            $(this).bind('input propertychange', function() {
                var slo_sum = parseInt($(this).val());
                $(this).parent().siblings().find(".step5-slo-input").each(function(){
                    slo_sum = slo_sum + parseInt($(this).val());
                });
                $(this).parent().siblings(".slo-sum").html(slo_sum);
                if (slo_sum != 100){
                    $(this).parent().siblings(".slo-sum").addClass("warning-number");
                }else{
                    $(this).parent().siblings(".slo-sum").removeClass("warning-number");
                };
            });
        });
    };

    /* Store Step 5 */ 
    var Store_Step5 = function(){
        for (var i=0; i< $(".step5-tbody tr:not(:last)").length; i++){
            var row =  $(".step5-tbody tr:not(:last)").eq(i);
            var PoaName = row.find("td").eq(0).find("input").val();
            var PoaType = row.find("td").eq(1).find('select').get(0).selectedIndex;
            var PoaWeight = row.find("td").eq(2).find('input').val();
            var PoaBreakdown = new Array(7).fill(0);
            for (var j=3; j<row.find("td").length-1; j++){
                PoaBreakdown[j-3] = parseInt(row.find("td").eq(j).find('input').val());
            };
            var Piece = {
                "PoaName": PoaName,
                "PoaType": PoaType,
                "PoaWeight": PoaWeight,
                "PoaBreakdown": PoaBreakdown
            };
            PieceOfAssessmentList[i] = Piece;
        };
    };

    /* Load Step 6 */ 
    var Load_Step6 = function(){
        var html = "";
        html += "<div class='row'>"
        html += '<div class="col-lg-12">'
        html += "SubjectCode: " + SubjectCode;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "SubjectName: " + SubjectName;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "SubjectCoordinator: " + SubjectCoordinator;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "SubjectDescription: " + SubjectDescription;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "CreditPoints: " + CreditPoints;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "StudyYear: " + StudyYear;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "TeachingPeriod: " + TeachingPeriod;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "SLOCount: " + SLOCount;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "MappingClassList: " + MappingClassList;
        html += "</div>"
        html += '<div class="col-lg-12">'
        html += "PieceOfAssessmentList: " + PieceOfAssessmentList;
        html += "</div>"
        html += "</div>"
        $(".map").append(html)
    };

    Load_Step2();
    console.log("Step 2")
    var step = 3;
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
            case step == 4 + SLOCount + 1:
                Store_Step5();
                Load_Step6();
                console.log("Step 6")
                break;
            default:
                console.log("error")
        };
        if (step == 4 + SLOCount + 1 && $('.warning-number').length>0){
            alert("Sum of weight and SLO must be 100")
            step --;
        }
        if (step > 4 + SLOCount){
            $('#next').addClass("hide");
        }else{
            $("#next").removeClass("hide");
        };
        if (step >= 4 && step < 4 + SLOCount){
            $(".page").siblings().addClass("hide");
            $("#step4").removeClass("hide");
            $(".intro-list").siblings().removeClass("intro-list-active").eq(3).addClass("intro-list-active");
        }else if (step >= 4 + SLOCount){
            $(".page").siblings().addClass("hide");
            $("#step"+(step-SLOCount+1)).removeClass("hide");
            $(".intro-list").siblings().removeClass("intro-list-active").eq(step-SLOCount).addClass("intro-list-active");
        }else{
            $(".page").siblings().addClass("hide");
            $("#step"+step).removeClass("hide");
            $(".intro-list").siblings().removeClass("intro-list-active").eq(step-1).addClass("intro-list-active");
        };
        step ++;
    });

    $('#previous').on('click', function() {
        step --;
        switch(true) {
            case step == 0:
                console.log("error")
                break;
            case step == 1:
                console.log("error")
                break;
            case step == 2:
                window.location.href = "/"
                break;
            case step == 3:
                Load_Step2();
                console.log("Step 2")
                break;
            case step == 4:
                Load_Step3();
                console.log("Step 3")
                break;
            case step >= 5 && step < 4 + SLOCount:
                step4inner--;
                Load_Step4(step4inner-1);
                console.log("Step 4-"+(step4inner-1));
                break;
            case step == 4 + SLOCount:
                Load_Step5();
                console.log("Step 4-4")
                break;
            case step == 4 + SLOCount + 1:
                Load_Step5();
                console.log("Step 5")
                break;
            default:
                console.log("error")
        };
        if (step > 4 + SLOCount+1){
            $('#next').addClass("hide");
        }else{
            $("#next").removeClass("hide");
        };
        if (step >= 5 && step < 5 + SLOCount){
            $(".page").siblings().addClass("hide");
            $("#step4").removeClass("hide");
            $(".intro-list").siblings().removeClass("intro-list-active").eq(3).addClass("intro-list-active");
        }else if (step >= 4 + SLOCount){
            $(".page").siblings().addClass("hide");
            $("#step"+(step-SLOCount)).removeClass("hide");
            $(".intro-list").siblings().removeClass("intro-list-active").eq(step-SLOCount-1).addClass("intro-list-active");
        }else{
            $(".page").siblings().addClass("hide");
            $("#step"+(step-1)).removeClass("hide");
            $(".intro-list").siblings().removeClass("intro-list-active").eq(step-2).addClass("intro-list-active");
        };
        
    });
    
});