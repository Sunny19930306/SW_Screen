it.ToolbarManager = function () {
    this.init();
}

it.ToolbarManager.prototype = {

    init: function () {

        this.importXml = new it.ImportXml('import-xml');
        this.exportJson = new it.ExportJson('export');
        this.saveScene = new it.SaveScene('exportscene');
    },
}