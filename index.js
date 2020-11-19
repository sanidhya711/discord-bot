const Discord = require("discord.js");
const client = new Discord.Client();
const apiEndpoint = 'https://trace.moe/api/search?url=';
const fetch = require('cross-fetch');
const puppeteer = require('puppeteer');

client.once("ready",()=>{
    console.log("bot is online");
});

client.on("message",message => {
    if(!message.author.bot){
        var resultsFound = false;
        if (message.attachments.size > 0) {
            message.channel.startTyping();
            var attachments = message.attachments.array();
            var url = attachments[0].url;
    
            fetch(apiEndpoint+url,{
            method: "POST",
            })
            .then((res) => res.json())
            .then((result) => {
            message.channel.stopTyping();
            result.docs.forEach(element => {
                console.log( element);
                if(element.similarity>0.8){
                    resultsFound = true;
                    message.channel.send(element.title_english+"           similarity: "+ Math.round((element.similarity*100)));
                    var anilist_id = element.anilist_id;
                    var filename = element.filename;
                    var at = element.at;
                    var tokenthumb = element.tokenthumb;
                    message.channel.send(`https://trace.moe/thumbnail.php?anilist_id=${anilist_id}&file=${encodeURIComponent(filename)}&t=${at}&token=${tokenthumb}`);
                }
            });
            if(!resultsFound){
                var element = result.docs[0];
                message.channel.send("might be "+element.title_english);
                    var anilist_id = element.anilist_id;
                    var filename = element.filename;
                    var at = element.at;
                    var tokenthumb = element.tokenthumb;
                    message.channel.send(`https://trace.moe/thumbnail.php?anilist_id=${anilist_id}&file=${encodeURIComponent(filename)}&t=${at}&token=${tokenthumb}`);
            }
            });
    
        }else{
            async function hmm(){
                message.channel.startTyping();
                var browser = await puppeteer.launch({headless:true});
                var page = await browser.newPage();
                await page.goto(message.content);
                await page.waitForSelector(".QualityToggle button",{
                    visible:true,
                });
                await page.click(".QualityToggle button:last-child");
                await page.waitForSelector("video",{
                    visible:true,
                });
                var data = await page.evaluate(()=>{
                    src = document.querySelector("video").getElementsByTagName("source")[0].src;
                    return src;
                });
                await browser.close();
                fetch(apiEndpoint+data,{
                    method: "POST",
                })
                .then((res) => res.json())
                .then((result) => {
                    result.docs.forEach(element => {
                        console.log( element);
                            resultsFound = true;
                            message.channel.send(element.title_english+"           similarity: "+ Math.round((element.similarity*100)));
                            var anilist_id = element.anilist_id;
                            var filename = element.filename;
                            var at = element.at;
                            var tokenthumb = element.tokenthumb;
                            message.channel.send(`https://trace.moe/thumbnail.php?anilist_id=${anilist_id}&file=${encodeURIComponent(filename)}&t=${at}&token=${tokenthumb}`);
                    });
                    message.channel.stopTyping();
                });
            }
            hmm();
        }
    }
});

client.login(process.env.BOT_TOKEN); 
