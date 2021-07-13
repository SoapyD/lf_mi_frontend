
const DocxMerger = require('../utils/docx-merger/index.js');
var fs = require('fs');
var path = require('path');
const classes = require('../classes');

const PImage = require('pureimage');
const docx = require("docx");



// exports.mergeDocument = async(req, res) => {

//     let output_name, filepath

//     output_name = "test"
//     filepath = "C:\\Users\\thomas.cassady\\Downloads\\tmp-14652-RwmIw91Pi4uH"

//     //UPLOAD THE REPORT FILES GENERATED
//     var file_list = fs.readdirSync(filepath); 

//     let imported_files = [];
//     file_list.forEach( async(item, index) => {
//         if(item.includes('docx')){
//             await imported_files.push(fs.readFileSync(path.join(filepath,item), 'binary'))
//         }
//     })
    

//     var docx = new DocxMerger({},imported_files);
//     //SAVING THE DOCX FILE
//     console.log("merging document")
    
    
//     docx.save('nodebuffer',function (data) {

//         fs.writeFile(path.join(filepath,output_name+".docx"), data, function(err){});
//     });   
// }

exports.addImage = (doc, path, w=950, h=350) => {
	return new docx.Paragraph(
		docx.Media.addImage(doc, fs.readFileSync(path), w, h)
	);	
};


exports.draw = async(req, res) => {
    const Generator = new classes.Generator();
    
    PImage.decodePNGFromStream(fs.createReadStream('./assets/img/flowchart.png')).then(async(img) => {
        // if (err) throw err; // Fail if the file can't be read.

        await Generator.loadFont()

        let options = {
            img: img
        }
        await Generator.setupImage(options)

        Generator.draw()

        PImage.encodePNGToStream(Generator.img, fs.createWriteStream('out.png')).then( async() => {
            // console.log("wrote out the png file to out.png");
    

            const doc = new docx.Document({
                creator: "Clippy",
                title: "Sample Document",
                description: "A brief example of using docx",
                // styles: {
                //         paragraphStyles: docBuilder.addStyles()
                //     }		
            });

            let para_arr = [
            exports.addImage(doc, "out.png", 950, 475)
            ]

            doc.addSection({
                properties: {},
                size: {
                orientation: docx.PageOrientation.LANDSCAPE,
                },		
                children: para_arr,
                });


            const b64string = await docx.Packer.toBase64String(doc);
    
            require("fs").writeFile("out.docx", b64string, 'base64', function(err) {
                // console.log(err);
              });

            // res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
            // res.send(Buffer.from(b64string, 'base64'));	

  
        }).catch((e)=>{
            console.log(e)
            console.log("there was an error writing");
        });
      });   
}



const CloudmersiveConvertApiClient = require('cloudmersive-convert-api-client');
const defaultClient = CloudmersiveConvertApiClient.ApiClient.instance;

exports.merge = (req, res) => {

    let output_name = ''
    let filepath = ''


    var Apikey = defaultClient.authentications['Apikey'];
    Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;
    
    var apiInstance = new CloudmersiveConvertApiClient.MergeDocumentApi();

    
    var inputFile1 = Buffer.from(fs.readFileSync("./out.docx").buffer); // File | First input file to perform the operation on.
    var inputFile2 = Buffer.from(fs.readFileSync("./out.docx").buffer); // File | Second input file to perform the operation on (more than 2 can be supplied).
      
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

    
    // var inputFile1 = Buffer.from(fs.readFileSync("./out.docx").buffer); // File | First input file to perform the operation on.
    // var inputFile2 = Buffer.from(fs.readFileSync("./out.docx").buffer); // File | Second input file to perform the operation on (more than 2 can be supplied).
      
    // var callback = function(error, data, response) {
    // if (error) {
    //     console.error(error);
    //     res.send(error)
    // } else {

    //     fs.writeFile('test.docx', data, () => {
    //         res.send("completed!")
    //     });
    // }
    // };
    // apiInstance.mergeDocumentDocxMulti(inputFile1, inputFile2, opts={}, callback);
}
