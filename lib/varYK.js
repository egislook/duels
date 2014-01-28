var fs = require('fs');

var read = './styles/default.css.js';
var write = './public/css/default.css';

var data = fs.readFileSync(read, 'utf8');

var opts = {
    signs : {
        props : [':root{', '}'],
        vars : ['var(', ')']
    },
    pos : {
        props : [0, 0],
        vars : [0, 0]
    }
}


function sub(str, sign1, sign2, start, format){
    
    format = format || 'guts';
    var data = {};
    
    var pos1 = str.indexOf(sign1);
    var pos2 = str.indexOf(sign2)+1;
    
    if(format == 'json'){
        if(sign1==':root{')
            pos1 = pos1+5;
        data = {json: JSON.parse(str.slice(pos1,pos2)), end:pos2};
    }
    else if(format == 'guts'){
        strPos1 = pos1+sign1.length;
        strPos2 = pos2-sign2.length;
        data = {string:str.slice(strPos1,strPos2), start:pos1, end:pos2};
    }
    else
        data = str.plice(pos1,pos2);
        
    return data;
}

function render(str, type){
    var pointer = 0, css, find;
    var props = sub(str, opts.signs.props[0], opts.signs.props[1], pointer, 'json');
    css = str.slice(props.end+1);
    props = props.json;
    
    for(i in props){
        find = opts.signs.vars[0]+''+i+''+opts.signs.vars[1];
        css = css.split(find).join(props[i]);
    }
    return css;
}

var css = render(data,'css');



fs.writeFile(write,css,function(err) {
    if(err){
      console.log(err);
    } else {
      console.log('css rewrited');
    }
});