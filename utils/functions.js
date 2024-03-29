
exports.sortDynamic = (array, item, is_number=true) => {

    if(is_number === true){
        array.sort(function (a, b) {
            return a[item] - b[item];
        });
    }else{
        array.sort((a, b) => {
            if ( a[item] < b[item] ){
                return -1;
            }
            if ( a[item] > b[item] ){
                return 1;
            }
            return 0;
        })

    }

    return array
}


exports.sortReport = (report) => {

    //SORT THE REPORT SUBSECTIONS BY ORDER
    if(report.sections){

        report.sections.sort(function (a, b) {
            return a.order - b.order;
        });

        report.sections.forEach((section) => {

            if(section.subsections){
                section.subsections.sort(function (a, b) {
                    return a.sectionsubsections.order - b.sectionsubsections.order;
                    });
            }
        })
    }

    return report
}

exports.compare = ( a, b ) => {
    if ( a.id < b.id ){
        return -1;
    }
    if ( a.id > b.id ){
        return 1;
    }
    return 0;
}



// example of how the below can be used
// if(subsections[0]){
//     subsections[0] = subsections[0].sort(functionsUtil.compareOrder)
// }

exports.compareOrder = ( a, b ) => {
    if ( a.order < b.order ){
        return -1;
    }
    if ( a.order > b.order ){
        return 1;
    }
    return 0;
}

exports.compareItem = ( a, b ) => {
    if ( a[order] < b[order] ){
        return -1;
    }
    if ( a.order > b.order ){
        return 1;
    }
    return 0;
}



exports.onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}


exports.delay = async(ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


exports.timeDifference = (timestamp1, timestamp2) => {
    var difference = timestamp1 - timestamp2;
    ///1000/60/60/24 --this for days
    var time_difference = Math.floor(difference/1000/60);

    return time_difference;
}