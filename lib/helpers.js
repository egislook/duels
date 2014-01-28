

function loadingTime(t1, t2) {
    var s = t2[0] - t1[0];
    var mms = t2[1] - t1[1];
    return s*1e9 + mms;
}

function dump(type, string, show){
    show = show || true;
    if(show){
        console.log(type +' : '+ string);
    }
        
}

module.exports.loadingTime = loadingTime;
module.exports.dump = dump;