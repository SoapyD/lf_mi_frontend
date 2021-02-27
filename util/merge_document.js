
var fs = require('fs');
var path = require('path');
// const DocxMerger = require('docx-merger');
const DocxMerger = require('../util/docx-merger/index.js');

const storageUtil = require('../util/storage');


// exports.mergeDocument = async(filepath, file_list, filename) => {
exports.mergeDocument = async(filepath) => {

    //UPLOAD THE REPORT FILES GENERATED
    var file_list = fs.readdirSync(filepath); 

    let imported_files = [];
    file_list.forEach( async(item, index) => {
        await imported_files.push(fs.readFileSync(path.join(filepath,item), 'binary'))
    })
    

    var docx = new DocxMerger({},imported_files);
    //SAVING THE DOCX FILE
    console.log("merging document")
    
    
    docx.save('nodebuffer',function (data) {

        fs.writeFile(path.join(filepath,"output.docx"), data, function(err){});

        filename = Date.now()
        storageUtil.saveBlob(data, filename);
    });   
    /**/    

}