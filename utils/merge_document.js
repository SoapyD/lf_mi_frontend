
var fs = require('fs');
var path = require('path');
// const DocxMerger = require('docx-merger');
const DocxMerger = require('../utils/docx-merger/index.js');

const storageUtil = require('../utils/storage');
// const classes = require('../classes');


// exports.mergeDocument = async(filepath, file_list, filename) => {
exports.mergeDocument = async(output_name, filepath) => {


    //UPLOAD THE REPORT FILES GENERATED
    var file_list = fs.readdirSync(filepath); 

    let imported_files = [];
    file_list.forEach( async(item, index) => {
        await imported_files.push(fs.readFileSync(path.join(filepath,item), 'binary'))
    })
    


    var docx = new DocxMerger({pageBreak: false},imported_files);
    //SAVING THE DOCX FILE
    console.log("merging document")
    
    
    docx.save('nodebuffer',function (data) {

        fs.writeFile(path.join(filepath,output_name+".docx"), data, function(err){});

        let filename = output_name+"_"+Date.now()+".docx"
        storageUtil.saveBlob(data, filename);
    });   

}


