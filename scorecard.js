const request=require('request')
const cheerio=require("cheerio")
const path=require("path")
const fs=require("fs")
const xlsx=require("xlsx")

const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard"

function exporting(url){

    request(url , cb)
}
function cb(error,response,html){
    if(error){
        console.log(error)
    }
    else{
        extractdata(html)
    }
}

function extractdata(html){
    let $=cheerio.load(html)
    let desp=$(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid")
    let winner =$(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title")
    desp=$(desp).text().split(",")
    winner=$(winner).text()
    venue=desp[1]
    date=desp[2]+desp[3]
    // console.log(venue,date)
    // console.log(winner)
    let innings = $(".ds-bg-fill-content-prime.ds-rounded-lg")
    // htmlstring=""
    for(let i=0; i<innings.length;i++){
        // htmlstring+=$(innings[i]).html()
        let team_name=$(innings[i]).find('.ds-text-tight-s.ds-font-bold.ds-uppercase').text()
        team_name=team_name.split("INNINGS")
        team_name=team_name[0].trim()
        if(i==0){
            k=1
        }
        else{
            k=0
        }
        let oponent_team_name=$(innings[k]).find('.ds-text-tight-s.ds-font-bold.ds-uppercase').text()
        oponent_team_name=oponent_team_name.split("INNINGS")
        oponent_team_name=oponent_team_name[0].trim()
        console.log(`${venue} ${date} ${team_name} vs ${oponent_team_name} \n ${winner}`)
        let current_batsman=$(innings[i]).find(".ds-w-full.ds-table.ds-table-xs.ds-table-fixed.ci-scorecard-table .ds-border-b.ds-border-line.ds-text-tight-s")
        // console.log(current_batsman.length)
        for(let t=1;t<current_batsman.length-1;t++){
            let tds =$(current_batsman[t]).find(".ds-min-w-max")
            let playername=$(tds[0]).text().trim()
            let runs=$(tds[2]).text().trim()
            let balls=$(tds[3]).text().trim()
            let fours= $(tds[5]).text().trim()
            let sixes = $(tds[6]).text().trim()
            let sr = $(tds[7]).text().trim()
            console.log(`${playername} ${runs} ${balls} ${fours} ${sixes} ${sr}`)
            processPlayer(team_name,playername,runs,balls,fours,sixes,sr,oponent_team_name,venue,date,winner )
        }
    }
    // console.log(htmlstring)
}

function processPlayer(team_name,playername,runs,balls,fours,sixes,sr,oponent_team_name,venue,date,winner ){
    let teamPath=path.join(__dirname,"IPL",team_name)
    dirCreator(teamPath)
    let filePath=path.join(teamPath,playername+".xlsx")
    let someContent = excelReader(filePath,playername)
    let playerObj={
        team_name,
        playername,
        runs,balls,
        fours,
        sixes,
        sr,
        oponent_team_name,
        venue,
        date,
        winner
    }
    
    someContent.push(playerObj)
    excelWriter(filePath,someContent,playername)
}

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath)
    }
}

function excelWriter(FilePath,json,sheetName){
    let newWB = xlsx.utils.book_new()
    let newWS = xlsx.utils.json_to_sheet(json)
    xlsx.utils.book_append_sheet(newWB,newWS,sheetName)
    xlsx.writeFile(newWB,FilePath)    
}


//read in xlsx

function excelReader(FilePath,sheetName){
    if(fs.existsSync(FilePath)==false){
        return []
    }
    let wb=xlsx.readFile(FilePath)
    let excel_data=wb.Sheets[sheetName]
    let ans = xlsx.utils.sheet_to_json(excel_data)
    return (ans)
}


module.exports={
    expo:exporting
}