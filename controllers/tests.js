
const DocxMerger = require('../utils/docx-merger/index.js');
var fs = require('fs');
var path = require('path');
const classes = require('../classes');
const utils = require("../utils");

exports.test = async(req, res) => {
    let list = []

    //GET THE FULL REPORT DATA
    list = []
    list.push(
    {
        model: "Report",
        search_type: "findOne",
        params: [{
            where: {
                id: 1,
            },
            include: utils.queries.searchType['Full Report'].include			
        }]
    }) 				
    let reports = await utils.queries.findData(list) 

    // console.log("////////////////////////////////////////////////////////////////////////")

    let report = utils.functions.sortReport(reports[0])
    
    // report.sections.forEach((section) => {
    //     console.log(section.order, section.name)

    //     section.subsections.forEach((subsection) => {
    //         console.log("    ",subsection.sectionsubsections.order, subsection.name)
    //     })
    // })    

    res.render("tests/index", {report:report});   

}

exports.merge = (req, res) => {

    let options = JSON.parse(first_queued.options);
    const mergeInstance = new classes.MergeDocument(options)
    mergeInstance.runMerge()        

}


/*
const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

exports.merge = (req, res) => {

    let output_name = ''
    let filepath = ''


    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;
    
    var apiInstance = new CloudmersiveConvertApiClient.MergeDocumentApi();

    
    // var inputFile1 = Buffer.from(fs.readFileSync("./out.docx").buffer); // File | First input file to perform the operation on.
    // var inputFile2 = Buffer.from(fs.readFileSync("./out.docx").buffer); // File | Second input file to perform the operation on (more than 2 can be supplied).

    var inputFile1 = Buffer.from(fs.readFileSync("C:\\Users\\thomas.cassady\\AppData\\Local\\Temp\\tmp-12232-D0WH139eIvBp\\0000002009.docx").buffer); // File | First input file to perform the operation on.
    var inputFile2 = Buffer.from(fs.readFileSync("C:\\Users\\thomas.cassady\\AppData\\Local\\Temp\\tmp-12232-D0WH139eIvBp\\0000002011.docx").buffer); // File | Second input file to perform the operation on (more than 2 can be supplied).    
      
    var callback = function(error, data, response) {
    if (error) {
        console.error(error);
        res.send(error)
    } else {

        fs.writeFile('test.docx', data, () => {
            res.send("completed!")
        });
    }
    };
    apiInstance.mergeDocumentDocxMulti(inputFile1, inputFile2, opts={}, callback);
}



exports.merge_NEW = (req, res) => {

    let output_name = ''
    let filepath = 'C:\\Users\\thomas.cassady\\AppData\\Local\\Temp\\tmp-24188-3dPNGUUbiVzT'


    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;
    
    var apiInstance = new CloudmersiveConvertApiClient.MergeDocumentApi();


    //UPLOAD THE REPORT FILES GENERATED
    var file_list = fs.readdirSync(filepath); 


    let file1;
    let file2;
    file_list.forEach( async(file, index) => {
        
        if(index === 0){
            file2 = path.join(filepath,file);
        }
        else{
            file1 = file2
            file2 = path.join(filepath,file)

            console.log(file1, file2)

            // await Buffer.from(fs.readFileSync(path.join(filepath,file)).buffer)
            var inputFile1 = Buffer.from(fs.readFileSync(file1).buffer); // File | First input file to perform the operation on.
            var inputFile2 = Buffer.from(fs.readFileSync(file2).buffer); // File | Second input file to perform the operation on (more than 2 can be supplied).

            let return_data = await apiInstance.mergeDocumentDocxMulti(inputFile1, inputFile2, opts={}, () => {
                return data
            });

            console.log("test")

        }

    })

}
*/