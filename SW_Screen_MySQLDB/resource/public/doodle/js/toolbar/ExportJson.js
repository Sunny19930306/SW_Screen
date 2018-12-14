it.ExportJson = function (id) {
    this.$dom = $('#' + id);
    this.init();
}

it.ExportJson.prototype = {

    init: function () {
        this.handleClick = this.handleClick.bind(this);

        this.$dom.click(this.handleClick);
    },

    handleClick: function (e) {

        var testJson = {
            "name": "test",
            "version": "1.0.0",
            "description": "test",
            "main": "app.js",
            "dependencies": {
                "express": "^4.16.3",
                "lodash": "^4.17.10",
            },
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "repository": {
                "type": "git",
            },
            "author": "test",
            "license": "ISC"
        }

        var content = JSON.stringify(testJson)
        // var filename = prompt('请输入文件名：',"package");
        var filename = "package";

        // if(filename === null){
        //     return;
        // }

        this.fileDownload(content, filename);
    },

    fileDownload: function (content, filename) {
        var tempLink = document.createElement('a');
        tempLink.download = filename+".json";
        tempLink.style.display = 'none';
        // 字符内容转变成blob地址
        var blob = new Blob([content]);
       
        tempLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(tempLink);
        tempLink.click();
        // 然后移除
        document.body.removeChild(tempLink);
    },

    // fileDownload: function(content) {   
    //     try{ 
    //         var elemIF = document.createElement("iframe");
    //         var blob = new Blob([content]);   
            
    //         elemIF.src = URL.createObjectURL(blob);;   
    //         elemIF.style.display = "none";   
    //         document.body.appendChild(elemIF);   
    //     }catch(e){ 
    //     } 
    // }

}