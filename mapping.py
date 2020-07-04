import os
import sys
import copy
import xmltodict
import json
import xml.etree.ElementTree as ET
import numpy

""" Read file """
f = open("data/outputs.txt", "r")
line = f.readline()
line = eval(line)
SubjectCode = line["SubjectCode"]
SubjectName = line["SubjectName"]
SubjectCoordinator = line["SubjectCoordinator"]
SubjectDescription = line["SubjectDescription"]
CreditPoints = line["CreditPoints"]
StudyYear = line["StudyYear"]
TeachingPeriod = line["TeachingPeriod"]
SLOCount = line["SLOCount"]
MappingClassList = eval(line["MappingClassList"].replace("false","False").replace("true","True"))
PieceOfAssessmentList = eval(line["PieceOfAssessmentList"])
f.close()

""" Generate XML """
Exemplars_Index = [1,2,3,5,10,16,25,35,39,45,49,51,54,57,63,69]
Exemplars = ['1.1','1.2','1.3','1.4','1.5','1.6','2.1','2.2','2.3','2.4','3.1','3.2','3.3','3.4','3.5','3.6']

SubjectInfo = {'SubjectCode': SubjectCode, 'SubjectName': SubjectName, 'SubjectCoordinator': SubjectCoordinator, 'SubjectDescription': SubjectDescription, 'CreditPoints': CreditPoints, 'StudyYear': StudyYear, 'TeachingPeriod': TeachingPeriod}
SLOs = {'string': [x['SubjectLearningOutcome'] for x in MappingClassList]}
MappingPlotData1 = {'item': [{'key': {'string': '1.1'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '1.2'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '1.3'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '1.4'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '1.5'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '1.6'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '2.1'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '2.2'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '2.3'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '2.4'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '3.1'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '3.2'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '3.3'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '3.4'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '3.5'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}, {'key': {'string': '3.6'}, 'value': {'ArrayOfDouble': {'double': ['0', '0', '0']}}}]}

def Credit_points_mapped_to_SLOs(CreditPoints, PieceOfAssessmentList):
    Task_total_credit = [float(Piece['PoaWeight'])/100*float(Piece['PoaBreakdown'][slo_no])/100*float(CreditPoints) for slo_no in range(SLOCount) for Piece in PieceOfAssessmentList]
    Task_total_credit = numpy.array(Task_total_credit).reshape(SLOCount, -1)
    
    Task_total_credit = numpy.swapaxes(Task_total_credit,0,1)
    Total_breakdown = numpy.sum(Task_total_credit, axis = 0)
    # print(Total_breakdown)
    return Task_total_credit, Total_breakdown

Task_total_credit, Total_breakdown = Credit_points_mapped_to_SLOs(CreditPoints, PieceOfAssessmentList)

def Credit_points_mapped_to_competencies(Total_breakdown, MappingPlotData1):
    # Exemplars_Index = [1,2,3,5,10,16,25,35,39,45,49,51,54,57,63,69]
    # Exemplars = ['1.1','1.2','1.3','1.4','1.5','1.6','2.1','2.2','2.3','2.4','3.1','3.2','3.3','3.4','3.5','3.6']
    # print(PieceOfAssessmentList)
    # print([sum(MappingClassList[i]['IsTicked']) for i in range(SLOCount)])
    total_Credit_distribution = numpy.array([Total_breakdown[i]/sum(MappingClassList[i]['IsTicked']) for i in range(SLOCount)])
    for class_no, MappingClass in enumerate(MappingClassList):
        true_index = [i for i, x in enumerate(MappingClass['IsTicked']) if x]
        # dl_chosen = [MappingClass['DL'][i] for i in true_index]
        # Exemplars_chosen = []
        for i in true_index:
            exemplars_chosen = -1
            for index, j in enumerate(Exemplars_Index):
                if i >= j:
                    exemplars_chosen = index
            # Exemplars_chosen.append(exemplars+1)
            dl_chosen = MappingClass['DL'][i]
            # print(Exemplars[exemplars_chosen+1], dl_chosen, Credit_distribution[class_no])
            MappingPlotData1['item'][exemplars_chosen+1]['value']['ArrayOfDouble']['double'][int(dl_chosen)-1] = str(float(MappingPlotData1['item'][exemplars_chosen+1]['value']['ArrayOfDouble']['double'][int(dl_chosen)-1]) + total_Credit_distribution[class_no])

    return MappingPlotData1

MappingPlotData1 = Credit_points_mapped_to_competencies(Total_breakdown, MappingPlotData1)


AssessmentCategorisation = [0]*30
for Piece in PieceOfAssessmentList:
    AssessmentCategorisation[int(Piece['PoaType'])] += float(Piece['PoaWeight'])/100*float(CreditPoints)
AssessmentCategorisation = list(map(str, AssessmentCategorisation))


def calculate_AssessmentCategorisationByColumn1():
    PoaTypes = [int(Piece['PoaType']) for Piece in PieceOfAssessmentList]
    PoaTypes_distinct = set(PoaTypes)
    PoaTypes = numpy.array(PoaTypes).reshape(-1,1)

    for poaType in PoaTypes_distinct:
        mask = PoaTypes[:, 0] == poaType
        breakdown = numpy.sum(Task_total_credit[mask, :], axis = 0)
        Credit_distribution = numpy.array([breakdown[i]/sum(MappingClassList[i]['IsTicked']) for i in range(SLOCount)])
        for class_no, MappingClass in enumerate(MappingClassList):
            if Credit_distribution[class_no] == 0:
                continue
            true_index = [i for i, x in enumerate(MappingClass['IsTicked']) if x]
            for i in true_index:
                exemplars_chosen = -1
                for index, j in enumerate(Exemplars_Index):
                    if i >= j:
                        exemplars_chosen = index
                dl_chosen = MappingClass['DL'][i]
                # print(Exemplars[exemplars_chosen+1], dl_chosen, poaType, class_no, Credit_distribution[class_no])
                dl_values = AssessmentCategorisationByColumn1['item'][exemplars_chosen+1]['value']['ArrayOfXmlSerializableDictionaryOfInt32Double']['XmlSerializableDictionaryOfInt32Double']
                if '@xsi:nil' in dl_values[int(dl_chosen)-1].keys():
                    value = {'item': [{'key': {'int': str(poaType)}, 'value': {'double': str(Credit_distribution[class_no])}}]}
                    AssessmentCategorisationByColumn1['item'][exemplars_chosen+1]['value']['ArrayOfXmlSerializableDictionaryOfInt32Double']['XmlSerializableDictionaryOfInt32Double'][int(dl_chosen)-1] = value
                else:
                    dl_values_poatype = [int(x['key']['int']) for x in dl_values[int(dl_chosen)-1]['item']]
                    if poaType in dl_values_poatype:
                        pre_value = AssessmentCategorisationByColumn1['item'][exemplars_chosen+1]['value']['ArrayOfXmlSerializableDictionaryOfInt32Double']['XmlSerializableDictionaryOfInt32Double'][int(dl_chosen)-1]['item'][dl_values_poatype.index(poaType)]['value']['double']
                        AssessmentCategorisationByColumn1['item'][exemplars_chosen+1]['value']['ArrayOfXmlSerializableDictionaryOfInt32Double']['XmlSerializableDictionaryOfInt32Double'][int(dl_chosen)-1]['item'][dl_values_poatype.index(poaType)]['value']['double'] = str(float(pre_value)+Credit_distribution[class_no])
                    else:
                        keyvalue = {'key': {'int': str(poaType)}, 'value': {'double': str(Credit_distribution[class_no])}}
                        AssessmentCategorisationByColumn1['item'][exemplars_chosen+1]['value']['ArrayOfXmlSerializableDictionaryOfInt32Double']['XmlSerializableDictionaryOfInt32Double'][int(dl_chosen)-1]['item'].append(keyvalue)


AssessmentCategorisationByColumn1 = {'item': []}
for key in Exemplars:
    item = {'key': {'string': key}, 'value': {'ArrayOfXmlSerializableDictionaryOfInt32Double': {'XmlSerializableDictionaryOfInt32Double': [{'@xsi:nil': 'true'}, {'@xsi:nil': 'true'}, {'@xsi:nil': 'true'}]}}}
    AssessmentCategorisationByColumn1['item'].append(item)
calculate_AssessmentCategorisationByColumn1()


result = {'OutputClass': {'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'}}
result['OutputClass']['SubjectInfo'] = SubjectInfo
result['OutputClass']['SLOs'] = SLOs
result['OutputClass']['MappingPlotData1'] = MappingPlotData1
result['OutputClass']['MappingPlotData2'] = None
result['OutputClass']['AssessmentCategorisation'] = {'double': AssessmentCategorisation}
result['OutputClass']['AssessmentCategorisationByColumn1'] = AssessmentCategorisationByColumn1
result['OutputClass']['AssessmentCategorisationByColumn2'] = None

f = open("data/outputs/{}MappingResult.xml".format(SubjectCode), "w")
f.write(xmltodict.unparse(result, pretty=True))
f.close()

os. remove("data/outputs.txt")

print("data/outputs/{}MappingResult.xml".format(SubjectCode))
sys.stdout.flush()


