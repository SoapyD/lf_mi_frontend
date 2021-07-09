
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

