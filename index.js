// Requirements go here
const thesaurus = require("thesaurus");
const Sentiment = require('sentiment');

function getThesaurus(keywords) {  
    return new Promise(resolve => {
        var results = [];
        // Some additions
        var independent = ['by yourself', 'visionary', 'pioneer', 'pioneering', 'freethinking', 'individualistic', 'self-motivated', 'self', 'independence'];
        var honest = ['truth', 'truthfully', 'integrity', 'sincere', 'sincerity',	'truthful', 'sincere', 'genuine', 'candid',	'trustworthy', 'trust', 'honesty'];
        var caring = ['friendly', 'welcoming', 'welcome', 'at home', 'look after', 'selfless', 'encouraging', 'encourage', 'soothe', 'soothing', 'hospitable', 'hospitality', 'considerate', 'attentive', 'thoughtful', 'compassionate', 'kind', 'warm-hearted', 'generosity', 'looking after', 'taking care of'];
        var collaborative = ['teamwork', 'collaboration', 'together', 'cross-department', 'interdependent', 'group', 'unite', 'team up', 'collude', 'amalgamate', 'team', 'team work', 'team player'];
        var brilliant = ['sharp', 'achiever', 'over-achiever', 'achievement', 'award', 'best', 'awesome', 'amazing', 'limitless', 'gifted', 'accomplished', 'intellectual', 'excellent', 'talented', 'smart', 'witty', 'wit', 'smarty pants'];
        keywords.forEach(async function(keyword) {     
            if(keyword != null){
                var thes = thesaurus.find(keyword.toLowerCase());
                thes.push(keyword.toLowerCase());
                if(keyword.toLowerCase() === 'independent'){
                    independent.forEach(function(ind) {
                        thes.push(ind);
                    });
                }
                if(keyword.toLowerCase() === 'honest'){
                    honest.forEach(function(hon) {
                        thes.push(hon);
                    });
                }
                if(keyword.toLowerCase() === 'caring'){
                    caring.forEach(function(car) {
                        thes.push(car);
                    });
                }
                if(keyword.toLowerCase() === 'collaborative'){
                    collaborative.forEach(function(col) {
                        thes.push(col);
                    });
                }
                if(keyword.toLowerCase() === 'brilliant'){
                    brilliant.forEach(function(bri) {
                        thes.push(bri);
                    });
                }
                var thesSet = new Set(thes);
                var cleanThes = [...thesSet];
                results.push({[keyword]:cleanThes});
            }
        });
        resolve(results);
    });      
}

exports.analyze = async function(string,keys,cb) {
    if(keys == undefined) {
        cb(null,{'message':'Please make sure you send keywords'});
        return;
    } 
    if(string == undefined) {
        cb(null,{'message':'Please make sure you send a string to analyze'});
        return;
    }
    var keywords = keys;
    var text = string.toLowerCase();
    var sentiment = new Sentiment();
    var sentimentCheck = sentiment.analyze(text);
    var sentimentScore = sentimentCheck;    
    var groups = await getThesaurus(keywords);
    var results = [];
    var graphData = [
                ["Keyword", "Percentage", { role: "style" }],
              ];
    var colors = [
           "#5f95ed", "#6cde66", "#e6ed64", "#4bcca8", "#a65fe3", "#c164de", "#8f8f8f" 
        ];
    var sentimentStatus = "";
    var totalScore = 0;
    groups.forEach(async function(keyword) {        
        var thes = [];
        var score = 0;
        thes = thes.concat(keyword[(Object.keys(keyword)).join()]);
        thes.forEach(async function(word) {
            var newScore = (text.match(word) || []).length;
            score += newScore;
            totalScore += newScore;
        });
        var key = {
            keyword: (Object.keys(keyword)).join(),
            score: score
        };
        var label = [
            (Object.keys(keyword)).join(),
            score,
            score==1?colors[0]:score==2?colors[1]:score==3?colors[2]:score==4?colors[3]:score==5?colors[4]:score==6?colors[5]:colors[6]
        ];
        results.push(key);
        graphData.push(label);
    });
    if(sentimentScore.score <= -10){
        sentimentStatus = 'Toxic';
    } else if(sentimentScore.score > -10 && sentimentScore.score < 0) {
        sentimentStatus = 'Negative';
    } else if(sentimentScore.score > 0 && sentimentScore.score <= 10) {
        sentimentStatus = 'Positive';
    } else if(sentimentScore.score > 10) {
        sentimentStatus = 'Amazing';
    } else {
        sentimentStatus = 'Neutral';
    }
    for(let i=1; i<graphData.length;i++) {
        if(graphData[i][1]!=0){
            graphData[i][1] = (graphData[i][1]/totalScore)*100;   
        }
    }
    var response = {
        text: text,
        sentiment_score: sentimentScore.score,
        sentiment_status: sentimentStatus,
        sentiment_calculation: sentimentScore.calculation,
        sentiment_comparative: sentimentScore.comparative.toFixed(2),
        strength_tracker: results,
        graph_data: graphData 
    };
    cb(response);
};