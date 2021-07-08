
const DocxMerger = require('../utils/docx-merger/index.js');
var fs = require('fs');
var path = require('path');

exports.mergeDocument = async(req, res) => {

    let output_name, filepath

    output_name = "test"
    filepath = "C:\\Users\\thomas.cassady\\Downloads\\tmp-14652-RwmIw91Pi4uH"

    //UPLOAD THE REPORT FILES GENERATED
    var file_list = fs.readdirSync(filepath); 

    let imported_files = [];
    file_list.forEach( async(item, index) => {
        if(item.includes('docx')){
            await imported_files.push(fs.readFileSync(path.join(filepath,item), 'binary'))
        }
    })
    

    var docx = new DocxMerger({},imported_files);
    //SAVING THE DOCX FILE
    console.log("merging document")
    
    
    docx.save('nodebuffer',function (data) {

        fs.writeFile(path.join(filepath,output_name+".docx"), data, function(err){});

        // let filename = output_name+"_"+Date.now()+".docx"
        // storageUtil.saveBlob(data, filename);
    });   
  

}


