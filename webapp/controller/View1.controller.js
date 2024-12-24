sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    'sap/m/MessageToast',
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UIComponent, MessageToast, MessageBox, JSONModel, Button) {
        "use strict";

        return Controller.extend("PP.zdenimpacking.controller.View1", {
            onInit: function () {
                var plant = {
                    plant: "1200"
                };
                this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(plant), "oCommonModel");
                var oDate = new Date();
                var oModel = {
                    dDefaultDate: oDate.getFullYear() + '-' + Number(oDate.getMonth() + 1) + '-' + oDate.getDate()
                };
                this.getView().setModel(new JSONModel(oModel), "oDateModel")
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel");
                this.getView().getModel("oTableDataModel").setProperty("/aTableData", []);
                this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel1");
                this.getView().getModel("oTableDataModel1").setProperty("/aTableData1", []);
                // this.getView().setModel(new JSONModel(), "oTableModel");
                // this.getView().getModel("oTableModel").setProperty("aData", [])
                this.getView().byId("TP").setValue("1");
                this.getView().byId("rloc").setValue("FG01");
                // UIComponent.getRouterFor(this).getRoute('RouteView1').attachPatternMatched(this.ScreenRefrashFunction, this);


            },
            addfaultTableData: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();

                var oModel1 = this.getView().getModel();
                var table = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");
                var aNewArr = [];
                var aIndices = this.byId("table2").getSelectedIndices();
                var len = aIndices.length;
                if (len === 0) {
                    oBusyDialog.close();
                    MessageBox.error("Please Select Atleast 1 Line From Batch table");
                }
                else {

                    var oTableModel = this.getView().getModel("oTableDataModel1");
                    var aTableArr = oTableModel.getProperty("/aTableData1");

                    for (var i = 0; i < aIndices.length; i++) {
                        aNewArr.push(aTableArr[aIndices[i]]);
                    }
                    var batchtabel = aNewArr;
                    var TableModel = this.getView().getModel("oTableDataModel");
                    var aTableArr = TableModel.getProperty("/aTableData");
                    var oInput = this.getView().byId("idDel2");
                    var code = this.getView().byId("idDel2").getValue();
                    var ofilter1 = new sap.ui.model.Filter("Code", "EQ", code);
                    oModel1.read("/fault_code", {
                        filters: [ofilter1],
                        success: function (ores) {
                            if (ores.results.length === 0) {
                                oBusyDialog.close();
                                oInput.setValue("");
                                MessageBox.error("Fault Code Wrong");
                            }
                            else {

                                var aTablearr = [];
                                var aNewArr = [];
                                var obj = {
                                    Faultcode: ores.results[0].Code,
                                    Faultmeter: "",
                                    point: "",
                                    Faultname: ores.results[0].Description,
                                    Department: ores.results[0].Zdept,
                                    Partyname: batchtabel[0].partyname,
                                    Batch: batchtabel[0].Batch
                                }
                                aTableArr.push(obj);
                                TableModel.setProperty("/aTableData", aTableArr)

                                oInput.setValue("");
                                oBusyDialog.close();
                            }
                        }
                    })

                }



            },
            DeleteTableData: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableDataModel");
                var aTableArr = oTableModel.getProperty("/aTableData");
                var aNewArr = [];

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]])
                }

                aNewArr.map(function (item) {
                    var FaultCode = item.Faultcode;
                    var iIndex = "";
                    aTableArr.map(function (items, index) {
                        if (FaultCode === items.Faultcode) {
                            iIndex = index
                        }
                    })
                    aTableArr.splice(iIndex, 1);
                })
                oTableModel.setProperty("/aTableData", aTableArr)
            },
            DeleteTableData1: function (oEvent) {
                var oTable = oEvent.getSource().getParent().getParent();
                var aSelectedIndex = oTable.getSelectedIndices();
                var oTableModel = this.getView().getModel("oTableDataModel1");
                var aTableArr = oTableModel.getProperty("/aTableData1");
                var aNewArr = [];

                for (var i = 0; i < aSelectedIndex.length; i++) {
                    aNewArr.push(aTableArr[aSelectedIndex[i]])
                }

                aNewArr.map(function (item) {
                    var FaultCode = item.Faultcode;
                    var iIndex = "";
                    aTableArr.map(function (items, index) {
                        if (FaultCode === items.Faultcode) {
                            iIndex = index
                        }
                    })
                    aTableArr.splice(iIndex, 1);
                })
                oTableModel.setProperty("/aTableData1", aTableArr)
                var oInput = this.getView().byId("matn");
                oInput.setValue("");
                var oInput = this.getView().byId("metr");
                oInput.setValue("");
            },
            netweight: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel1 = this.getView().getModel();
                // var oInput3 = this.getView().byId("actozs");
                var oInput2 = this.getView().byId("netweig");
                // var lengthtot = this.getView().byId("lengthtot").getValue();
                // var FWDTH = Number(this.getView().byId("FWDTH").getValue());
                var GrossWeight = Number(this.getView().byId("grw").getValue());
                // var stdweight = Number(this.getView().byId("stdnetwe").getValue());

                var plant = this.getView().byId("plant").getValue();
                var ProductType = this.getView().getModel("oProductType").getProperty("/ProductType");
                if (ProductType === "ZPDN") {
                    var Product = this.getView().byId("matdesc").getValue();
                    var oFilter1 = new sap.ui.model.Filter("Pdno", "EQ", Product);
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    oModel1.read("/DStd", {
                        filters: [oFilter1, oFilter],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                if(plant === "1400"){
                                        
                                    var newe = parseFloat(GrossWeight - tarewight).toFixed(3);
                                    oInput2.setValue(newe);
                                }
                                else{
                                    MessageBox.error("Wrong Material For Std Width and Std Net Weight");
                                }
                            }
                            else {
                                var tarewight = Number(oresponse.results[0].Tareweight);
                                if (tarewight === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("Tareweight is 0 please check the Sort master is not maintain tareweight");
                                }
                                else {
                                    var newe = parseFloat(GrossWeight - tarewight).toFixed(3);
                                    oInput2.setValue(newe);
                                    oBusyDialog.close();
                                }



                            }

                        }.bind(this),
                    })
                }
                else {
                    var Product = this.getView().byId("matn").getValue();
                    var oFilter1 = new sap.ui.model.Filter("Material", "EQ", Product);
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    oModel1.read("/DStd", {
                        filters: [oFilter1, oFilter],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                if(plant === "1400"){    
                                    var newe = parseFloat(GrossWeight - tarewight).toFixed(3);
                                    oInput2.setValue(newe);
                                }
                                else{
                                    MessageBox.error("Wrong Material For Std Width and Std Net Weight");
                                }
                            }
                            else {
                                var tarewight = Number(oresponse.results[0].Tareweight);
                                if (tarewight === 0) {

                                    oBusyDialog.close();
                                    MessageBox.error("Tareweight is 0 please check the Sort master is not maintain tareweight");
                                }
                                else {
                                    var newe = parseFloat(GrossWeight - tarewight).toFixed(3);
                                    oInput2.setValue(newe);
                                    oBusyDialog.close();
                                }
                            }

                        }.bind(this),
                    })
                }


            },
            savedata: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    text: "Please wait"
                });
                oBusyDialog.open();
                var netweight = this.getView().byId("netweig").getValue();
                var cutablewidth = this.getView().byId("cutablewidth").getValue();
                var finishwidth = this.getView().byId("FWDTH").getValue();
                var shift = this.getView().byId("sln").getValue();
                var folionumber = this.getView().byId("FNO").getValue();
                var GrossWeight = this.getView().byId("grw").getValue();
                var receivingloc = this.getView().byId("rloc").getValue();
                var packgrade = this.getView().byId("Pacg").getValue();
                var inspectiomcno = this.getView().byId("Imn").getValue();
                var lengthtot = this.getView().byId("lengthtot").getValue();
                var recloc = this.getView().byId("FNO").getValue();
                if (recloc.length < 6) {
                    oBusyDialog.close();
                    MessageBox.error("Folio Number Length is not less than 6");
                    this.getView().byId("FNO").setValue("");
                }
                else if (netweight === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please enter Net Weight");
                }

                else if (inspectiomcno === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Inspection Machine No.");
                }
                else if (packgrade === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Packgrade");
                }
                else if (receivingloc === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Receiving Loc.");
                }
                else if (GrossWeight === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Gross Weight");
                }
                else if (folionumber === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Folio Number ");
                }
                else if (shift === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Shift");
                }
                else if (finishwidth === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Finsih Width");
                }
                else if (lengthtot === "") {
                    oBusyDialog.close();
                    MessageBox.error("Please fill the Roll Length Total");
                }
                else if (finishwidth != "" && shift != "" && folionumber != "" && GrossWeight != "" && receivingloc != "" && inspectiomcno != "" && netweight != "") {


                    var Reg = this.getView().byId("re-gra").getSelected();
                    if (Reg === true) {
                        var Regrading = "X";
                    }
                    else {
                        var Regrading = "";
                    }
                    var table = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
                    var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");

                    this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel2");
                    this.getView().getModel("oTableDataModel2").setProperty("/aTableData2", []);
                    var TableModel2 = this.getView().getModel("oTableDataModel2");
                    var aTablearr2 = TableModel2.getProperty("/aTableData2")

                    var aTablearr2 = [];

                    var stdOzs = this.getView().byId("stdOzs").getValue(); 12
                    var actozs = this.getView().byId("actozs").getValue(); 14
                    var f = parseFloat(stdOzs) + 1;
                    var g = parseFloat(stdOzs) - 1.5;
                    // var h = parseFloat(stdOzs) - 1;
                    // var j = parseFloat(stdOzs) - 0.5;
                    // var k = parseFloat(stdOzs);
                    var l = parseFloat(actozs);

                    if (l <= f && l >= g) {
                        var plant = this.getView().byId("plant").getValue();
                        var storloc = this.getView().byId("sloc").getValue();
                        var opername = this.getView().byId("opname").getValue();
                        var material = this.getView().byId("matn").getValue();
                        var finishwidth = this.getView().byId("FWDTH").getValue();
                        var stdwidth = this.getView().byId("stdwi").getValue();
                        var Packgrade = this.getView().byId("Pacg").getValue();

                        // var a = parseFloat(stdwidth) + 1;
                        var b = parseFloat(stdwidth) + 2;
                        var c = parseFloat(stdwidth) - 1;
                        // var e = parseFloat(stdwidth);
                        var d = parseFloat(finishwidth);
                        if ((Packgrade === "F1") && (d <= b && d >= c)) {
                            var shift = this.getView().byId("sln").getValue();
                            var foliono = this.getView().byId("FNO").getValue();
                            var Grossweight = this.getView().byId("grw").getValue();
                            var netWeight = this.getView().byId("netweig").getValue();
                            var point4 = this.getView().byId("flag").getValue();
                            var Recivloc = this.getView().byId("rloc").getValue();

                            var inspectiomcno = this.getView().byId("Imn").getValue();

                            var stdnetwt = this.getView().byId("stdnetwe").getValue();
                            var flagqty = this.getView().byId("flagqty").getValue();
                            var Remark1 = this.getView().byId("Rema1").getValue();
                            var Remark2 = this.getView().byId("Rema2").getValue();
                            var stdOzs = this.getView().byId("stdOzs").getValue();
                            var actozs = this.getView().byId("actozs").getValue();
                            var party = this.getView().byId("party").getValue();
                            var rolllength = this.getView().byId("lengthtot").getValue();
                            var Tpremk = this.getView().byId("Tpremk").getValue();
                            var TP = this.getView().byId("TP").getValue();
                            var dpt = this.getView().byId("dpt").getValue();
                            var totqty = String(point4 * flagqty);
                            var PostingDate = this.getView().byId("date").getValue()
                            if (PostingDate.length === 10) {
                                var yyyy = PostingDate.slice(0, 4);
                                var mm = PostingDate.slice(5, 7);
                                var dd = PostingDate.slice(8, 10);
                                var dte = yyyy + mm + dd;
                            }
                            else if (PostingDate.length === 9) {
                                var yyyy = PostingDate.slice(0, 4);
                                var mm = PostingDate.slice(5, 7);
                                if (mm.slice(1, 2) === '-') {
                                    var mm = PostingDate.slice(5, 6);
                                    mm = "0" + mm;
                                    var dd = PostingDate.slice(7, 9);
                                }
                                else {
                                    var mm = PostingDate.slice(5, 7);
                                    var dd = PostingDate.slice(8, 9);
                                    dd = "0" + dd;
                                }
                                var dte = yyyy + mm + dd;
                                var dte = yyyy + mm + dd;
                            }
                            else if (PostingDate.length === 8) {
                                var yyyy = PostingDate.slice(0, 4);
                                var mm = PostingDate.slice(5, 6);
                                mm = "0" + mm;
                                var dd = PostingDate.slice(7, 8);
                                dd = "0" + dd;
                                var dte = yyyy + mm + dd;
                            }


                            for (var i = 0; i < table1.length; i++) {
                                var items2 = {
                                    soitem: table1[i].Item,
                                    batch: table1[i].Batch,
                                    length: table1[i].Length,
                                    Loomno: table1[i].Loomno,
                                    setno: table1[i].setno,
                                    salesorder: table1[i].SalesOrder,
                                    trollyno: table1[i].trollyno,
                                    partyname: table1[i].partyname
                                }
                                aTablearr2.push(items2);
                                TableModel2.setProperty("/aTableData2", aTablearr2)
                            }

                            this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel3");
                            this.getView().getModel("oTableDataModel3").setProperty("/aTableData3", []);
                            var TableModel3 = this.getView().getModel("oTableDataModel3");
                            var aTablearr3 = TableModel3.getProperty("/aTableData3")

                            var aTablearr3 = [];

                            for (var i = 0; i < table.length; i++) {
                                var items3 = {
                                    Ftype: table[i].Faultcode,
                                    Meter: table[i].Faultmeter,
                                    ToMeter: table[i].toFaultmeter,
                                    Point: table[i].point,
                                    Faultname: table[i].Faultname,
                                    Department: table[i].Department,
                                    Partyname: table[i].Partyname,
                                    Batch: table[i].Batch
                                }
                                aTablearr3.push(items3);
                                TableModel3.setProperty("/aTableData3", aTablearr3)
                            }


                            //   https://my405100.s4hana.cloud.sap/sap/bc/http/sap/zpack_311_bapi?sap-client=080

                            var url = "/sap/bc/http/sap/zpack_311_bapi?sap-client=080";
                            $.ajax({
                                type: "post",
                                url: url,
                                data: JSON.stringify({
                                    plant,
                                    storloc,
                                    opername,
                                    material,
                                    finishwidth,
                                    shift,
                                    foliono,
                                    Grossweight,
                                    netWeight,
                                    Recivloc,
                                    Packgrade,
                                    inspectiomcno,
                                    stdwidth,
                                    cutablewidth,
                                    stdnetwt,
                                    flagqty,
                                    point4,
                                    Remark1,
                                    Remark2,
                                    stdOzs,
                                    actozs,
                                    party,
                                    Tpremk,
                                    TP,
                                    date: dte,
                                    totqty,
                                    Regrading,
                                    rolllength,
                                    dpt,
                                    aTablearr2,
                                    aTablearr3
                                }),
                                contentType: "application/json; charset=utf-8",
                                traditional: true,
                                success: function (data) {
                                    oBusyDialog.close();
                                    var folio = data.split(' ').slice(0, 1)[0];
                                    var meta = data.slice(40);
                                    var create = meta.split(' ').slice(0, 1)[0];
                                    if (create === 'ERROR' || folio === "ERROR") {
                                        oBusyDialog.close();
                                        MessageBox.error(data);
                                    }
                                    else if (folio === 'Folio') {
                                        oBusyDialog.close();
                                        MessageBox.error(data);
                                    }
                                    else {



                                        var decodedPdfContent = atob(data);
                                        var byteArray = new Uint8Array(decodedPdfContent.length);
                                        for (var i = 0; i < decodedPdfContent.length; i++) {
                                            byteArray[i] = decodedPdfContent.charCodeAt(i);
                                        }
                                        var blob = new Blob([byteArray.buffer], {
                                            type: 'application/pdf'
                                        });
                                        var _pdfurl = URL.createObjectURL(blob);
                                        if (!this._PDFViewer) {
                                            this._PDFViewer = new sap.m.PDFViewer({
                                                width: "auto",
                                                source: _pdfurl,
                                                showDownloadButton: true,

                                            });
                                            jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                                        }
                                        else {
                                            this._PDFViewer = new sap.m.PDFViewer({
                                                width: "auto",
                                                source: _pdfurl,
                                                showDownloadButton: true,

                                            });
                                            jQuery.sap.addUrlWhitelist("blob");
                                        }
                                        oBusyDialog.close();
                                        this._PDFViewer.open();
                                        // this.ScreenRefrashFunction();


                                    }
                                }.bind(this),
                                error: function (error) {
                                    oBusyDialog.close();
                                    MessageBox.error(error);
                                }

                            });



                        }
                        else if (Packgrade != "F1") {
                            var shift = this.getView().byId("sln").getValue();
                            var foliono = this.getView().byId("FNO").getValue();
                            var Grossweight = this.getView().byId("grw").getValue();
                            var netWeight = this.getView().byId("netweig").getValue();
                            var point4 = this.getView().byId("flag").getValue();
                            var Recivloc = this.getView().byId("rloc").getValue();

                            var inspectiomcno = this.getView().byId("Imn").getValue();

                            var stdnetwt = this.getView().byId("stdnetwe").getValue();
                            var flagqty = this.getView().byId("flagqty").getValue();
                            var Remark1 = this.getView().byId("Rema1").getValue();
                            var Remark2 = this.getView().byId("Rema2").getValue();
                            var stdOzs = this.getView().byId("stdOzs").getValue();
                            var actozs = this.getView().byId("actozs").getValue();
                            var party = this.getView().byId("party").getValue();
                            var rolllength = this.getView().byId("lengthtot").getValue();
                            var Tpremk = this.getView().byId("Tpremk").getValue();
                            var TP = this.getView().byId("TP").getValue();
                            var dpt = this.getView().byId("dpt").getValue();
                            var totqty = String(point4 * flagqty);
                            var PostingDate = this.getView().byId("date").getValue()
                            if (PostingDate.length === 10) {
                                var yyyy = PostingDate.slice(0, 4);
                                var mm = PostingDate.slice(5, 7);
                                var dd = PostingDate.slice(8, 10);
                                var dte = yyyy + mm + dd;
                            }
                            else if (PostingDate.length === 9) {
                                var yyyy = PostingDate.slice(0, 4);
                                var mm = PostingDate.slice(5, 7);
                                if (mm.slice(1, 2) === '-') {
                                    var mm = PostingDate.slice(5, 6);
                                    mm = "0" + mm;
                                    var dd = PostingDate.slice(7, 9);
                                }
                                else {
                                    var mm = PostingDate.slice(5, 7);
                                    var dd = PostingDate.slice(8, 9);
                                    dd = "0" + dd;
                                }
                                var dte = yyyy + mm + dd;
                            }
                            else if (PostingDate.length === 8) {
                                var yyyy = PostingDate.slice(0, 4);
                                var mm = PostingDate.slice(5, 6);
                                mm = "0" + mm;
                                var dd = PostingDate.slice(7, 8);
                                dd = "0" + dd;
                                var dte = yyyy + mm + dd;
                            }


                            for (var i = 0; i < table1.length; i++) {
                                var items2 = {
                                    soitem: table1[i].Item,
                                    batch: table1[i].Batch,
                                    length: table1[i].Length,
                                    Loomno: table1[i].Loomno,
                                    setno: table1[i].setno,
                                    salesorder: table1[i].SalesOrder,
                                    trollyno: table1[i].trollyno,
                                    partyname: table1[i].partyname
                                }
                                aTablearr2.push(items2);
                                TableModel2.setProperty("/aTableData2", aTablearr2)
                            }

                            this.getView().setModel(new sap.ui.model.json.JSONModel(), "oTableDataModel3");
                            this.getView().getModel("oTableDataModel3").setProperty("/aTableData3", []);
                            var TableModel3 = this.getView().getModel("oTableDataModel3");
                            var aTablearr3 = TableModel3.getProperty("/aTableData3")

                            var aTablearr3 = [];

                            for (var i = 0; i < table.length; i++) {
                                var items3 = {
                                    Ftype: table[i].Faultcode,
                                    Meter: table[i].Faultmeter,
                                    ToMeter: table[i].toFaultmeter,
                                    Point: table[i].point,
                                    Faultname: table[i].Faultname,
                                    Department: table[i].Department,
                                    Partyname: table[i].Partyname,
                                    Batch: table[i].Batch
                                }
                                aTablearr3.push(items3);
                                TableModel3.setProperty("/aTableData3", aTablearr3)
                            }


                            //   https://my405100.s4hana.cloud.sap/sap/bc/http/sap/zpack_311_bapi?sap-client=080

                            var url = "/sap/bc/http/sap/zpack_311_bapi?sap-client=080";
                            $.ajax({
                                type: "post",
                                url: url,
                                data: JSON.stringify({
                                    plant,
                                    storloc,
                                    opername,
                                    material,
                                    finishwidth,
                                    shift,
                                    foliono,
                                    Grossweight,
                                    netWeight,
                                    Recivloc,
                                    Packgrade,
                                    cutablewidth,
                                    inspectiomcno,
                                    stdwidth,
                                    stdnetwt,
                                    flagqty,
                                    point4,
                                    Remark1,
                                    Remark2,
                                    stdOzs,
                                    actozs,
                                    party,
                                    Tpremk,
                                    TP,
                                    date: dte,
                                    totqty,
                                    Regrading,
                                    rolllength,
                                    dpt,
                                    aTablearr2,
                                    aTablearr3
                                }),
                                contentType: "application/json; charset=utf-8",
                                traditional: true,
                                success: function (data) {
                                    oBusyDialog.close();
                                    var folio = data.split(' ').slice(0, 1)[0];
                                    var meta = data.slice(40);
                                    var create = meta.split(' ').slice(0, 1)[0];
                                    if (create === 'ERROR' || folio === "ERROR") {
                                        oBusyDialog.close();
                                        MessageBox.error(data);
                                    }
                                    else if (folio === 'Folio') {
                                        oBusyDialog.close();
                                        MessageBox.error(data);
                                    }
                                    else {


                                        var decodedPdfContent = atob(data);
                                        var byteArray = new Uint8Array(decodedPdfContent.length);
                                        for (var i = 0; i < decodedPdfContent.length; i++) {
                                            byteArray[i] = decodedPdfContent.charCodeAt(i);
                                        }
                                        var blob = new Blob([byteArray.buffer], {
                                            type: 'application/pdf'
                                        });
                                        var _pdfurl = URL.createObjectURL(blob);
                                        if (!this._PDFViewer) {
                                            this._PDFViewer = new sap.m.PDFViewer({
                                                width: "auto",
                                                source: _pdfurl,
                                                showDownloadButton: true,

                                            });
                                            jQuery.sap.addUrlWhitelist("blob"); // register blob url as whitelist
                                        }
                                        else {
                                            this._PDFViewer = new sap.m.PDFViewer({
                                                width: "auto",
                                                source: _pdfurl,
                                                showDownloadButton: true,

                                            });
                                            jQuery.sap.addUrlWhitelist("blob");
                                        }
                                        oBusyDialog.close();
                                        this._PDFViewer.open();
                                        // this.ScreenRefrashFunction();
                                        // Window.location.reload();

                                    }
                                }.bind(this),
                                error: function (error) {
                                    oBusyDialog.close();
                                    MessageBox.error(error);
                                }
                            });

                        }

                        else {
                            oBusyDialog.close();
                            MessageBox.error("Finish Width is Greater Than 2 and less Than 1 with Std Width");
                        }

                    }
                    else {
                        oBusyDialog.close();
                        MessageBox.error("Act Ozs is Greater Than 1 and less Than 1.5 with Std Ozs");
                    }



                }

            },
            onClose: function (oEvent) {
                if (this._oDialog) {
                    this._oDialog.close();
                }
            },
            onReadbatchtable: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");
                var oModel1 = this.getView().getModel();
                // this.oObject = oEvent.getSource().getBindingContext("oTableDataModel1").getObject();
                var plant = this.getView().byId("plant").getValue();
                var Supplier = this.getView().byId("Supplier").getValue();
                var storloc = this.getView().byId("sloc").getValue();
                var me = this.getView().byId("metr").getValue();
                var batch = this.getView().byId("idDel1").getValue();
                var oInput1 = this.getView().byId("matdesc");
                var oInp = this.getView().byId("party");
                var material = this.getView().byId("matn").getValue();

                if (Supplier.length > 0) {
                    if (material.length > 0) {
                        var salesorder = table1[0].SalesOrder;
                        var ofilter6 = new sap.ui.model.Filter("SDDocument", "EQ", salesorder);
                        var item = table1[0].Item;
                        var ofilter5 = new sap.ui.model.Filter("Supplier", "EQ", Supplier);
                        var ofilter4 = new sap.ui.model.Filter("SDDocumentItem", "EQ", item);
                        var ofilter3 = new sap.ui.model.Filter("Material", "EQ", material);
                        var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", storloc);
                        var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", plant);
                        var oFilter = new sap.ui.model.Filter("Batch", "EQ", batch);

                        oModel1.read("/mat_stock", {
                            filters: [oFilter1, oFilter, oFilter2, ofilter3, ofilter4, ofilter5, ofilter6],
                            success: function (ores) {
                                if (ores.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("All Batch should be material,storage location,plant,salesorder,item are same");
                                }
                                else {
                                    // this.oObject.SalesOrder= oresponse.results[0].SDDocument;
                                    var kluv = ores.results[0].Partyname;
                                    oInp.setValue(kluv);
                                    var i = table1.length + 1;
                                    var TableModel1 = this.getView().getModel("oTableDataModel1");
                                    var aTableArr1 = TableModel1.getProperty("/aTableData1")
                                    var aTablearr1 = [];
                                    var aNewArr = [];
                                    var obj = {
                                        serialno: i,
                                        Batch: ores.results[0].Batch,
                                        Length: "",
                                        Loomno: ores.results[0].Loomnumber,
                                        setno: ores.results[0].Setno,
                                        SalesOrder: ores.results[0].SDDocument,
                                        Item: ores.results[0].SDDocumentItem,
                                        trollyno: ores.results[0].Trollyno,
                                        partyname: ores.results[0].Partyname
                                    }
                                    aTableArr1.push(obj);
                                    TableModel1.setProperty("/aTableData1", aTableArr1)

                                    var material = {
                                        material: ores.results[0].Material
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(material), "oCommonModel1");
                                    var met = parseFloat(me);
                                    var m2 = parseFloat(ores.results[0].MatlWrhsStkQtyInMatlBaseUnit);
                                    var meteR = met + m2;
                                    var meter = {
                                        meter: meteR.toFixed(3)
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(meter), "oCommonModel7");

                                    var ProductType = {
                                        ProductType: ores.results[0].ProductType
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(ProductType), "oProductType");
                                }
                                var oInput = this.getView().byId("idDel1");
                                oInput.setValue("");
                                this.stdweight();
                                oBusyDialog.close();
                            }.bind(this),
                            error: function (ores) {
                                oBusyDialog.close();
                                MessageBox.error("Please Check Data Is nOt Upload");
                            }.bind(this)
                        })



                    }
                    else {

                        var ofilter5 = new sap.ui.model.Filter("Supplier", "EQ", Supplier);
                        var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", storloc);
                        var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", plant);
                        var oFilter = new sap.ui.model.Filter("Batch", "EQ", batch);

                        oModel1.read("/mat_stock", {
                            filters: [oFilter1, oFilter, oFilter2, ofilter5],
                            success: function (ores) {
                                if (ores.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("Inavlid Plant for the Batch");
                                }
                                else {
                                    var kluv = ores.results[0].Partyname;
                                    oInp.setValue(kluv);
                                    var i = table1.length + 1;
                                    var TableModel1 = this.getView().getModel("oTableDataModel1");
                                    var aTableArr1 = TableModel1.getProperty("/aTableData1")
                                    var aTablearr1 = [];
                                    var aNewArr = [];
                                    var obj = {
                                        serialno: i,
                                        Batch: ores.results[0].Batch,
                                        Length: "",
                                        Loomno: ores.results[0].Loomnumber,
                                        setno: ores.results[0].Setno,
                                        SalesOrder: ores.results[0].SDDocument,
                                        Item: ores.results[0].SDDocumentItem,
                                        trollyno: ores.results[0].Trollyno,
                                        partyname: ores.results[0].Partyname
                                    }
                                    aTableArr1.push(obj);
                                    TableModel1.setProperty("/aTableData1", aTableArr1)

                                    var material = {
                                        material: ores.results[0].Material
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(material), "oCommonModel1");
                                    var meter = {
                                        meter: ores.results[0].MatlWrhsStkQtyInMatlBaseUnit
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(meter), "oCommonModel7");

                                    var ProductType = {
                                        ProductType: ores.results[0].ProductType
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(ProductType), "oProductType");
                                    var matdesc = ores.results[0].ProductDescription;
                                    oInput1.setValue(matdesc);

                                }
                                var oInput = this.getView().byId("idDel1");
                                oInput.setValue("");
                                this.stdweight();
                                oBusyDialog.close();
                            }.bind(this),
                            error: function (ores) {
                                oBusyDialog.close();
                                MessageBox.error("Please Check Data Is nOt Upload");
                            }.bind(this)
                        })
                    }
                }
                else {
                    if (material.length > 0) {
                        var salesorder = table1[0].SalesOrder;
                        var ofilter5 = new sap.ui.model.Filter("SDDocument", "EQ", salesorder);
                        var item = table1[0].Item;
                        var ofilter4 = new sap.ui.model.Filter("SDDocumentItem", "EQ", item);
                        var ofilter3 = new sap.ui.model.Filter("Material", "EQ", material);
                        var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", storloc);
                        var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", plant);
                        var oFilter = new sap.ui.model.Filter("Batch", "EQ", batch);

                        oModel1.read("/mat_stock", {
                            filters: [oFilter1, oFilter, oFilter2, ofilter3, ofilter4, ofilter5],
                            success: function (ores) {
                                if (ores.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("All Batch should be material,storage location,plant,salesorder,item are same");
                                }
                                else {
                                    // this.oObject.SalesOrder= oresponse.results[0].SDDocument;
                                    var kluv = ores.results[0].Partyname;
                                    oInp.setValue(kluv);
                                    var i = table1.length + 1;
                                    var TableModel1 = this.getView().getModel("oTableDataModel1");
                                    var aTableArr1 = TableModel1.getProperty("/aTableData1")
                                    var aTablearr1 = [];
                                    var aNewArr = [];
                                    var obj = {
                                        serialno: i,
                                        Batch: ores.results[0].Batch,
                                        Length: "",
                                        Loomno: ores.results[0].Loomnumber,
                                        setno: ores.results[0].Setno,
                                        SalesOrder: ores.results[0].SDDocument,
                                        Item: ores.results[0].SDDocumentItem,
                                        trollyno: ores.results[0].Trollyno,
                                        partyname: ores.results[0].Partyname
                                    }
                                    aTableArr1.push(obj);
                                    TableModel1.setProperty("/aTableData1", aTableArr1)

                                    var material = {
                                        material: ores.results[0].Material
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(material), "oCommonModel1");
                                    var met = parseFloat(me);
                                    var m2 = parseFloat(ores.results[0].MatlWrhsStkQtyInMatlBaseUnit);
                                    var meteR = met + m2;
                                    var meter = {
                                        meter: meteR.toFixed(3)
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(meter), "oCommonModel7");

                                    var ProductType = {
                                        ProductType: ores.results[0].ProductType
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(ProductType), "oProductType");
                                }
                                var oInput = this.getView().byId("idDel1");
                                oInput.setValue("");
                                this.stdweight();
                                oBusyDialog.close();
                            }.bind(this),
                            error: function (ores) {
                                oBusyDialog.close();
                                MessageBox.error("Please Check Data Is nOt Upload");
                            }.bind(this)
                        })



                    }
                    else {


                        var oFilter2 = new sap.ui.model.Filter("StorageLocation", "EQ", storloc);
                        var oFilter1 = new sap.ui.model.Filter("Plant", "EQ", plant);
                        var oFilter = new sap.ui.model.Filter("Batch", "EQ", batch);

                        oModel1.read("/mat_stock", {
                            filters: [oFilter1, oFilter, oFilter2],
                            success: function (ores) {
                                if (ores.results.length === 0) {
                                    oBusyDialog.close();
                                    MessageBox.error("Inavlid Plant for the Batch");
                                }
                                else {
                                    var kluv = ores.results[0].Partyname;
                                    oInp.setValue(kluv);
                                    var i = table1.length + 1;
                                    var TableModel1 = this.getView().getModel("oTableDataModel1");
                                    var aTableArr1 = TableModel1.getProperty("/aTableData1")
                                    var aTablearr1 = [];
                                    var aNewArr = [];
                                    var obj = {
                                        serialno: i,
                                        Batch: ores.results[0].Batch,
                                        Length: "",
                                        Loomno: ores.results[0].Loomnumber,
                                        setno: ores.results[0].Setno,
                                        SalesOrder: ores.results[0].SDDocument,
                                        Item: ores.results[0].SDDocumentItem,
                                        trollyno: ores.results[0].Trollyno,
                                        partyname: ores.results[0].Partyname
                                    }
                                    aTableArr1.push(obj);
                                    TableModel1.setProperty("/aTableData1", aTableArr1)

                                    var material = {
                                        material: ores.results[0].Material
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(material), "oCommonModel1");
                                    var meter = {
                                        meter: ores.results[0].MatlWrhsStkQtyInMatlBaseUnit
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(meter), "oCommonModel7");

                                    var ProductType = {
                                        ProductType: ores.results[0].ProductType
                                    };
                                    this.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(ProductType), "oProductType");
                                    var matdesc = ores.results[0].ProductDescription;
                                    oInput1.setValue(matdesc);

                                }
                                var oInput = this.getView().byId("idDel1");
                                oInput.setValue("");
                                this.stdweight();
                                oBusyDialog.close();
                            }.bind(this),
                            error: function (ores) {
                                oBusyDialog.close();
                                MessageBox.error("Please Check Data Is nOt Upload");
                            }.bind(this)
                        })
                    }
                }

            },
            stdweight: function () {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                var oModel1 = this.getView().getModel();
                var ProductType = this.getView().getModel("oProductType").getProperty("/ProductType");

                if (ProductType === "ZPDN") {
                    var oInput4 = this.getView().byId("stdOzs");
                    var odpt = this.getView().byId("dpt");
                    var oInput3 = this.getView().byId("stdwi");
                    var oInput2 = this.getView().byId("stdnetwe");
                    var oInput9 = this.getView().byId("actozs");
                    var plant = this.getView().byId("plant").getValue();
                    var netweig = this.getView().byId("netweig").getValue();
                    var totalpoint = this.getView().byId("flagqty").getValue();
                    var finishwidth34 = this.getView().byId("FWDTH").getValue();
                    var Product = this.getView().byId("matdesc").getValue();
                    var lengthtot = this.getView().byId("lengthtot").getValue();

                    var oFilter1 = new sap.ui.model.Filter("Pdno", "EQ", Product);
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    oModel1.read("/DStd", {
                        filters: [oFilter1, oFilter],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                if (plant === "1400") {

                                }
                                else {
                                    MessageBox.error("Wrong Material For Std Width and Std Net Weight");
                                }

                            }
                            else {

                                // Std  Width  
                                var STDWIDTH = oresponse.results[0].Finwd;
                                var a = Number(STDWIDTH) / 2.54;
                                a = parseFloat(a).toFixed(3);
                                oInput3.setValue(a);

                                //   Std OZS
                                var k = oresponse.results[0].gsm;
                                var ozs = Number(k) / 33.91;
                                ozs = parseFloat(ozs).toFixed(3);
                                oInput4.setValue(ozs);

                                // std net Weight
                                oInput2.setValue(k);

                                if (lengthtot != "") {


                                    var STDWIDTH = Number(oresponse.results[0].Finwd);
                                    var ltot = Number(lengthtot);
                                    finishwidth34 = Number(finishwidth34) * 2.54;
                                    // Act Ozs
                                    var l = (Number(netweig) / ltot) / finishwidth34;
                                    // STDWIDTH;
                                    var k = (l / 33.91) * 100000;
                                    k = parseFloat(k).toFixed(3);
                                    oInput9.setValue(k);

                                    // DPT
                                    var m = (Number(totalpoint) * 100) / ltot;
                                    var p = finishwidth34 / 100;
                                    // STDWIDTH /100;
                                    var qprt = m / p;
                                    qprt = parseFloat(qprt).toFixed(3);
                                    odpt.setValue(qprt);

                                }


                                oBusyDialog.close();


                            }

                        }.bind(this),
                    })
                }
                else {
                    var oInput4 = this.getView().byId("stdOzs");
                    var odpt = this.getView().byId("dpt");
                    var oInput3 = this.getView().byId("stdwi");
                    var oInput2 = this.getView().byId("stdnetwe");
                    var oInput9 = this.getView().byId("actozs");

                    var netweig = this.getView().byId("netweig").getValue();
                    var totalpoint = this.getView().byId("flagqty").getValue();

                    var lengthtot = this.getView().byId("lengthtot").getValue();
                    var finishwidth34 = this.getView().byId("FWDTH").getValue();
                    var plant = this.getView().byId("plant").getValue();
                    var Product = this.getView().byId("matn").getValue();
                    var oFilter1 = new sap.ui.model.Filter("Material", "EQ", Product);
                    var oFilter = new sap.ui.model.Filter("Plant", "EQ", plant);
                    oModel1.read("/DStd", {
                        filters: [oFilter1, oFilter],
                        success: function (oresponse) {
                            if (oresponse.results.length === 0) {
                                oBusyDialog.close();
                                if (plant === "1400") {

                                }
                                else {
                                    MessageBox.error("Wrong Material For Std Width and Std Net Weight");
                                }
                            }
                            else {

                                // net weight 
                                var Tareweight = oresponse.results[0].Tareweight;

                                // Std  Width  
                                var STDWIDTH = oresponse.results[0].Finwd;
                                var a = Number(STDWIDTH) / 2.54;
                                a = parseFloat(a).toFixed(3);
                                oInput3.setValue(a);

                                //   Std OZS
                                var k = oresponse.results[0].gsm;
                                var ozs = Number(k) / 33.91;
                                ozs = parseFloat(ozs).toFixed(3);
                                oInput4.setValue(ozs);

                                // std net Weight
                                oInput2.setValue(k);

                                if (lengthtot != "") {


                                    var STDWIDTH = Number(oresponse.results[0].Finwd);
                                    var ltot = Number(lengthtot);
                                    finishwidth34 = Number(finishwidth34) * 2.54;

                                    // Act Ozs
                                    var l = (Number(netweig) / ltot) / finishwidth34;
                                    // STDWIDTH;
                                    var k = (l / 33.91) * 100000;
                                    k = parseFloat(k).toFixed(3);
                                    oInput9.setValue(k);

                                    // DPT
                                    var m = (Number(totalpoint) * 100) / ltot;
                                    var p = finishwidth34 / 100;
                                    // STDWIDTH /100;
                                    var qprt = m / p;
                                    qprt = parseFloat(qprt).toFixed(3);
                                    odpt.setValue(qprt);

                                }


                                oBusyDialog.close();


                            }

                        }.bind(this),
                    })
                }

            },
            total: function (oEvent) {
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Fetching Data",
                    text: "Please wait"
                });
                oBusyDialog.open();
                this.oObject = oEvent.getSource().getBindingContext("oTableDataModel1").getObject();
                var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");
                var Metervalue = this.getView().byId("metr").getValue();

                var Total = 0;

                table1.map(function (items) {
                    var Length = Number(items.Length)
                    Total = Number(Total) + Length
                })

                if (Number(Total) > Number(Metervalue)) {
                    MessageBox.error("Length is greater than Meter value")
                    this.oObject.Length = "";
                    var oInput = this.getView().byId("lengthtot");
                    oInput.setValue("");
                    oBusyDialog.close();

                } else {
                    this.getView().setModel(new JSONModel(), "oTotalModel")
                    this.getView().getModel("oTotalModel").setProperty("/TotalQty", parseFloat(Total).toFixed(3))
                    this.stdweight();
                    oBusyDialog.close();
                }


            },
            strogaelocation: function () {
                var storloc = this.getView().byId("sloc").getValue();

                if (storloc == "DY01" || storloc == "FG01" || storloc == "FN01" || storloc == "INS1" || storloc == "PH01" || storloc == "PSUB" || storloc == "QA01" || storloc == "RW01" || storloc == "ST01" || storloc == "WRP1" || storloc == "WST1" || storloc == "YRM1") {

                }
                else {
                    var oInput = this.getView().byId("sloc");
                    oInput.setValue("");
                    MessageBox.error("kindly select valid Storage Location");

                }

            },
            reclocation: function () {
                var recloc = this.getView().byId("rloc").getValue();

                if (recloc == "DY01" || recloc == "FG01" || recloc == "FN01" || recloc == "INS1" || recloc == "PH01" || recloc == "PSUB" || recloc == "QA01" || recloc == "RW01" || recloc == "ST01" || recloc == "WRP1" || recloc == "WST1" || recloc == "YRM1" || recloc === "FRC1") {

                }
                else {
                    var oInput = this.getView().byId("rloc");
                    oInput.setValue("");
                    MessageBox.error("kindly select valid Receiving Location");

                }

            },
            Shift: function () {
                var shift = this.getView().byId("sln").getValue();

                if (shift == "A" || shift == "B" || shift == "C") {

                }
                else {
                    var oInput = this.getView().byId("sln");
                    oInput.setValue("");
                    MessageBox.error("kindly select valid Shift");

                }



            },
            packgrade: function () {
                var oModel1 = this.getView().getModel();
                var Pacg = this.getView().byId("Pacg").getValue();
                var oInput = this.getView().byId("Pacg");
                var ofilter1 = new sap.ui.model.Filter("Grade", "EQ", Pacg);
                oModel1.read("/grading_table", {
                    filters: [ofilter1],
                    success: function (ores) {
                        if (ores.results.length === 0) {

                            oInput.setValue("");
                            MessageBox.error("Grade Wrong");
                        }

                    }
                })


            },
            operatorname: function () {
                var oModel1 = this.getView().getModel();
                var Empname = this.getView().byId("opname").getValue();
                var oInput = this.getView().byId("opname");
                var ofilter1 = new sap.ui.model.Filter("Empname", "EQ", Empname);
                oModel1.read("/operator_data", {
                    filters: [ofilter1],
                    success: function (ores) {
                        if (ores.results.length === 0) {
                            oInput.setValue("");
                            MessageBox.error("Operator Name Wrong");
                        }

                    }
                })


            },
            machineno: function () {
                var mno = this.getView().byId("Imn").getValue();

                if (mno == "01" || mno == "02" || mno == "03" || mno == "04" || mno == "05" || mno == "06" || mno == "07" || mno == "08" || mno == "09") {

                }
                else {
                    var oInput = this.getView().byId("Imn");
                    oInput.setValue("");
                    MessageBox.error("kindly select valid Machine NO.");

                }

            },
            frcLocationValidation: function () {

                var plant = this.getView().byId("plant").getValue();
                var receivingloc = this.getView().byId("rloc").getValue();

                var secondTableModel = this.getView().getModel("oTableDataModel1");
                var secondTableModel_Property = secondTableModel.getProperty("aTableData1");

                var lengthMeter = secondTableModel_Property[0].Length;



            },
            Onsetno: function (oEvent) {
                var oBusy = new sap.m.BusyDialog({
                    text: "Please Wait"
                });
                oBusy.open();
                var oTableModel = this.getView().getModel('oTableDataModel1');
                var sPath = oEvent.getSource().getBindingContext('oTableDataModel1');

                var oContext = oEvent.getSource().getBindingContext("oTableDataModel1").getObject();
                var oModel1 = this.getView().getModel();
                var setnumber = oContext.setno;
                var Batch = oContext.Batch;

                var oFilter = new sap.ui.model.Filter("Setno", "EQ", setnumber);
                var oFilter1 = new sap.ui.model.Filter("Batch", "EQ", Batch);
                oModel1.read("/mat_stock", {
                    filters: [oFilter, oFilter1],
                    success: function (ores) {
                        if (ores.results.length != 0) {
                            this.getView().byId("party").setValue(ores.results[0].Partyname);
                            oTableModel.getProperty(sPath.getPath()).Batch = ores.results[0].Batch;
                            oTableModel.getProperty(sPath.getPath()).Loomno = ores.results[0].Loomnumber;
                            // oTableModel.getProperty(sPath.getPath()).SalesOrder = ores.results[ores.results.length-1].SDDocument;
                            oTableModel.getProperty(sPath.getPath()).SalesOrder = ores.results[0].SDDocument;
                            oTableModel.getProperty(sPath.getPath()).Item = ores.results[0].SDDocumentItem;
                            oTableModel.getProperty(sPath.getPath()).trollyno = ores.results[0].Trollyno;
                            oTableModel.getProperty(sPath.getPath()).partyname = ores.results[0].Partyname;
                            oTableModel.setProperty(sPath.getPath(), oTableModel.getProperty(sPath.getPath()));
                        }
                        oBusy.close();
                    }.bind(this)
                })


            },
            // ZDNMFAULTData: function () {

            //     var table = this.getView().getModel("oTableDataModel").getProperty("/aTableData");
            //     var table1 = this.getView().getModel("oTableDataModel1").getProperty("/aTableData1");

            //     for (var i = 0; i < table.length; i++) {
            //         var faultcode = table[i].Faultcode;
            //         var faultmeter = table[i].Faultmeter;
            //         var toFaultmeter =table[i].toFaultmeter;
            //         var point = Number(table[i].point);
            //         var data = this.getView().getModel("oCommonModel3").getProperty("/Data");
            //         var recbatch = this.getView().getModel("oCommonModel9").getProperty("/recbatch");
            //         var batch = table1[0].Batch;
            //         var plant = this.getView().byId("plant").getValue();
            //         var material = this.getView().byId("matn").getValue();
            //         var date = this.getView().byId("date").getValue();
            //         var oDate = new Date(date);
            //         var oDate1 = new Date(oDate.getTime() - oDate.getTimezoneOffset() * 60000);
            //         var Postingdate = oDate1.toISOString().slice(0, 16);
            //         var oModel1 = this.getView().getModel();
            //         var items = {
            //             Werks: plant,
            //             Matnr: material.toUpperCase(),
            //             Charg: batch.toUpperCase(),
            //             Bagno: recbatch,
            //             Ftype: faultcode,
            //             Budat: Postingdate,
            //             Meter: faultmeter,
            //             ToMeter:toFaultmeter,
            //             Baleno: "1234567890",
            //             Mblnr: data,
            //             Point: point,
            //         }
            //         oModel1.create("/ZDNMFAULT_dm", items, {
            //             // filters: [],
            //             method: "POST",
            //             success: function (ores) {



            //             }.bind(this),
            //             error: function (ores) {

            //                 MessageBox.error("Please Check Data is Not Upload (Fault Data)");
            //             }.bind(this)
            //         })
            //     }

            // },
            // ScreenRefrashFunction: function () {
            //     this.getView().getModel("oTableDataModel1").setProperty("/aTableData1", []);
            //     this.getView().byId("netweig").setValue("");
            //     this.getView().byId("cutablewidth").setValue("");
            //     this.getView().byId("FWDTH").setValue("");
            //     this.getView().byId("sln").setValue("");
            //     this.getView().byId("FNO").setValue("");
            //     this.getView().byId("grw").setValue("");
            //     this.getView().byId("Pacg").setValue("");
            //     this.getView().byId("Imn").setValue("");
            //     this.getView().byId("lengthtot").setValue("");
            //     this.getView().byId("FNO").setValue("");
            //     this.getView().byId("opname").setValue("");
            //     this.getView().byId("matn").setValue("");
            //     this.getView().byId("metr").setValue("");
            //     this.getView().byId("flag").setValue("");
            //     this.getView().byId("matdesc").setValue("");
            //     this.getView().byId("stdwi").setValue("");
            //     this.getView().byId("stdnetwe").setValue("");
            //     this.getView().byId("stdOzs").setValue("");
            //     this.getView().byId("actozs").setValue("");
            //     this.getView().byId("party").setValue("");
            //     this.getView().byId("dpt").setValue("");

            // },
        });
    });
