const request=require('request')
const cheerio=require("cheerio")
const exp=require("./scorecard")

function getmatchlink(url){
    request(url,function(error , response, html){
        if(error){
            console.log(error)
        }
        else{
            extractlink(html)
        }
    })
    }
    
    function extractlink(html){
        let $=cheerio.load(html)
        let data_0=$(".ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line")
        let data_1=$(data_0[1]).find(".ds-border-b.ds-border-line")
        for(let i=0;i<data_1.length;i++){
    
            let data_2=$(data_1[i]).find(".ds-inline-flex.ds-items-center.ds-leading-none")
            data_3 =$(data_2[3]).find("a").attr("href")
            fulllink="https://www.espncricinfo.com"+data_3
            console.log(fulllink)
            exp.expo(fulllink)
    
        }
    }

module.exports={
    gAlmatches:getmatchlink
}