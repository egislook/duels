:root{
    "ruleColorTextLight": "color:#FFFFFF",
    "ruleColorTextDark": "color:#383838",
    "textSmall": "11px",
    "textNormal": "16px",
    "textBig": "18px",
    "textLarge": "26px",
    "textExtra": "38",
    "paddingNormal": "7px",
    "colorAccept": "#92C24C",
    "colorEdit": "#E4AE33",
    "colorDelete": "#EB4B4B",
    "colorLight" : "#FFFFFF",
    "colorLightGrey" : "#F2F2F2",
    "colorDarkGrey" : "#BCBCBC",
    "colorMain" : "#4B69FF",
    "colorOrange" : "#ED6639",
    "colorDark" : "#383838",
    "colorGrey" : "#9E9E9E",
    "colorBlue" : "#39C0ED",
    "colorCom" : "#B0C3D9",
    "colorUnc" : "#5E98D9",
    "colorRare" : "#4B69FF",
    "colorMyth" : "#8847FF",
    "colorLeg" : "#D32CE6",
    "colorAnc" : "#EB4B4B",
    "colorIm" : "#E4AE33",
    "colorArc" : "#ADE55C"
}

ol{list-style-type:circle;}
*{padding:0;margin:0;border:none;text-decoration:none;box-sizing:border-box;}
body{padding:1px;font-family:"Arial";font-size:var(textNormal);padding-bottom:90px;background:var(colorLightGrey);}
a{var(ruleColorTextLight);}
.inputs{padding:5px 10px 5px 10px;color:var(colorDark);border:solid 2px var(colorDark);border-left:none;background:var(colorLight);}
.left{float:left;}
.right{float:right;}
.hero{width:48px;}
.avatar{height:27px;}
.clear{clear:both;overflow:hidden;}

#toolbar{background:#4A4A4A;position:fixed;bottom:0px;width:100%;z-index:0;box-shadow: 0px -1px 3px #000000;}
#toolbar img{height:30px;display:block;margin:auto;}
#clock{right:0px;padding:10px;width:200px;}
p{font-size:14px;clear:both;padding-top:5px;}
.list{padding:25px 25px 15px 25px;background:var(colorMain);border-right:solid 2px #4A4A4A;}
.list_small{padding:10px 5px 5px 40px; margin-top:30px;}
.list:hover{background:var(colorDark);padding:25px 25px 15px 25px;border-right:solid 2px #4A4A4A;}
.textLight{var(ruleColorTextLight);}
.textLightGrey{color:var(colorDarkGrey);}
.textDark{color:var(colorDark);}
.textSmall{font-size:var(textSmall);}
.textBig{font-size:var(textBig);text-transform:uppercase;}
.textLarge{font-size:var(textLarge);letter-spacing:-2px;}
.textExtra{font-size:var(textExtra);}
.up_case{text-transform:uppercase;}
.center{text-align:center;}

.space{padding:15px 5px 15px 5px}
.data-list{text-align:center;width:100%;border-bottom:solid 10px var(colorDark);border-top:solid 2px var(colorDark);}
.data-list tr{background:var(colorDark);}
.data-list tr:hover{background:#1A1A1A;cursor:pointer;}
.data-list tr.selected{background:#1A1A1A}
.data-list tr.finished:hover{background:#1A1A1A;cursor:pointer;}
.data-list tr.finished{background:#4A4A4A;}
.data-list td{
    border-top:solid 1px #4A4A4A;border-bottom:solid 1px #1A1A1A;border-left:solid 1px #4A4A4A;border-right:solid 1px #1A1A1A;
}
.data-text{padding-left:var(paddingNormal);padding-right:var(paddingNormal);}
.click-dark:hover{background:var(colorLight);color:var(colorDark);}
.item{padding:0px;}
.items div:hover{border:solid 2px var(colorDelete);}

.icon img{height:21px;}
.page{overflow:hidden;margin:auto;width:100%;text-align:center;border-top:solid 5px var(colorDark);padding-bottom:20px;}
.page table{font-size:var(textNormal);position:relative;z-index:3;}
.page table td > div{padding:2px 5px 2px 5px;}
.tournament{float:left;padding-left:30px;/*border:solid 1px var(colorGrey);*/}
.spaced{min-width:200px;display:inline-block;}
.spaced .b-l{padding-top:5px;padding-bottom:5px;}

.b-r{border-right:solid 2px var(colorDark);}
.b-r-r{border-right:solid 2px var(colorDelete);}
.b-l{border-left:solid 2px var(colorDark);}
.b-t{border-top:solid 2px var(colorDark);}
.b-b{border-bottom:solid 2px var(colorDark);}
.b-a{border:solid 2px var(colorDark);}
.b-w{border:solid 2px var(colorEdit);outline:var(colorEdit) solid 1px;}
.b-w-r{border-right:solid 2px var(colorEdit);}
.nb-r{border-right:none;}
.nb-l{border-left:none;}

.rare{background:var(colorRare);}
.unc{background:var(colorUnc);}
.com{background:var(colorCom);}
.key{background:var(colorIm);}

.dark{background:var(colorDark);}

.click{padding:2px 5px 2px 5px;overflow:hidden;cursor:pointer;}
.tip{width:70px;text-align:left;font-size:var(textSmall);}
.dest{padding:8px 5px 0px 10px;}
.click:hover{background:var(colorDark);color:var(colorLight);}
.note{display:none;position:absolute;border-radius:2px;padding:5px;font-size:11px;max-width:145px;color:var(colorLight);z-index:100;}

.players{padding:0px; padding-right:2px}
.players img{width:35px; border:solid 2px var(colorDark);padding:0px;margin:0px;}

.duel{padding:0px;margin-right:3px;border-top:solid 4px transparent;border-bottom:solid 4px transparent;}
.duel:hover{border-top:solid 4px var(colorAccept);}
.img{border:solid 2px var(colorDark);width:35px;}
.first{margin-right:2px;}
.duel div{text-align:center;padding:2px}
.win{width:40px;border:solid 2px var(colorDark);border-top:3px solid var(colorAccept);}
.lose{width:25px;border:solid 2px var(colorDark);border-top:solid 3px var(colorDelete);}


.accept{background:var(colorAccept);}
.free{background:var(colorAccept);}
.edit{background:var(colorEdit);}
.delete{background:var(colorDelete);}
.neutral{color:var(colorDark);background:var(colorLight);}
.grey{background:var(colorDarkGrey);}

.t:hover{background:#E0E0E0;cursor:pointer;opacity:1;}
.t-finished{opacity:0.7;}
.hbr{border-right:1px solid var(colorLight);}
.hbl{border-left:1px solid var(colorDarkGrey);}
.h-line{background:var(colorDarkGrey);height:2px;border-bottom:1px solid var(colorLight);}
.v-line{background:var(colorDarkGrey);width:2px;border-right:1px solid var(colorLight);}
.count{width:14px;padding:2px;}
.ticket{vertical-align:top;padding-right:5px;background-image:url('http://s26.postimg.org/davaqpoit/dota_icon_curve.png');background-repeat:no-repeat;background-position:bottom left;}