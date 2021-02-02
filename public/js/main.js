
var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},
updateIndex = function(e, ui) {
    $('td.index', ui.item.parent()).each(function (i) {
        $(this).html(i + 1);
    });
};

// the help is the element that visible when being dragged
// The stop function runs when the element is finished being dragged
$("#sort tbody").sortable({
    helper: fixHelperModified,
    stop: updateIndex
})
 .disableSelection()

// triggered at the end of an "add row" call, this function updates the element index of each draggable element
$("#sort tbody").on('sortupdate',() => {

    let indexes =  $('td.index');
    // console.log(indexes)
    indexes.each((i, el) => {
        $(el).html(i + 1)

    })
 });
