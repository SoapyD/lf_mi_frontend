
const DocxMerger = require('../utils/docx-merger/index.js');
var fs = require('fs');
var path = require('path');
const classes = require('../classes');
const utils = require("../utils");

exports.test = async(req, res) => {
 

    res.render("tests/index", {report:report});   

}

