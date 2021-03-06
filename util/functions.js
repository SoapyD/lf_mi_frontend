


exports.compare = ( a, b ) => {
    if ( a.id < b.id ){
        return -1;
    }
    if ( a.id > b.id ){
        return 1;
    }
    return 0;
}


exports.onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
}
