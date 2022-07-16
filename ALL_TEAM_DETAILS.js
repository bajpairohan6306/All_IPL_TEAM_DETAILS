const fs=require("fs")
const path=require("path")
const request=require('request')
const cheerio=require("cheerio")
const AllMatchObj=require("./ALL_match")
const ALL_match = require('./ALL_match')
const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595"
request(url , cb)
function cb(error,response,html){
    if(error){
        console.log(error)
    }
    else{
        extracthtml(html)
    }
}

iplPath=path.join(__dirname,"IPL")

function extracthtml(html){
    let $=cheerio.load(html)
    let firstlink = $(".ds-py-3.ds-px-4 .ds-inline-flex.ds-items-center.ds-leading-none")
    firstlink = $(firstlink[10]).find("a").attr("href")
    fulllink="https://www.espncricinfo.com"+firstlink;
    // console.log(firstlink)
    ALL_match.gAlmatches(fulllink)
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath)
    }
    else{
        
    }
}
dirCreator(iplPath)