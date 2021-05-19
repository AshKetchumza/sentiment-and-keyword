// Requirements go here
const thesaurus = require("thesaurus");
const Sentiment = require('sentiment');

function getThesaurus(keywords) {  
    return new Promise(resolve => {
        let results = [];
        // Some additions
        let independent = ['by yourself', 'visionary', 'pioneer', 'pioneering', 'freethinking', 'individualistic', 'self-motivated', 'self', 'independence'];
        let honest = ['truth', 'truthfully', 'integrity', 'sincere', 'sincerity',	'truthful', 'sincere', 'genuine', 'candid',	'trustworthy', 'trust', 'honesty'];
        let caring = ['friendly', 'welcoming', 'welcome', 'at home', 'look after', 'selfless', 'encouraging', 'encourage', 'soothe', 'soothing', 'hospitable', 'hospitality', 'considerate', 'attentive', 'thoughtful', 'compassionate', 'kind', 'warm-hearted', 'generosity', 'looking after', 'taking care of'];
        let collaborative = ['teamwork', 'collaboration', 'together', 'cross-department', 'interdependent', 'group', 'unite', 'team up', 'collude', 'amalgamate', 'team', 'team work', 'team player'];
        let brilliant = ['sharp', 'achiever', 'over-achiever', 'achievement', 'award', 'best', 'awesome', 'amazing', 'limitless', 'gifted', 'accomplished', 'intellectual', 'excellent', 'talented', 'smart', 'witty', 'wit', 'smarty pants'];
        keywords.forEach(async function(keyword) {     
            if(keyword != null){
                let thes = thesaurus.find(keyword.toLowerCase());
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
                let thesSet = new Set(thes);
                let cleanThes = [...thesSet];
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
    let keywords = keys;
    let text = string.toLowerCase();
    let sentiment = new Sentiment();
    let sentimentCheck = sentiment.analyze(text);
    let sentimentScore = sentimentCheck;    
    let groups = await getThesaurus(keywords);
    let results = [];
    let graphData = [
                ["Keyword", "Percentage", { role: "style" }],
              ];
    let colors = [
           "#5f95ed", "#6cde66", "#e6ed64", "#4bcca8", "#a65fe3", "#c164de", "#8f8f8f" 
        ];
    let sentimentStatus = "";
    let totalScore = 0;
    groups.forEach(async function(keyword) {        
        let thes = [];
        let score = 0;
        thes = thes.concat(keyword[(Object.keys(keyword)).join()]);
        thes.forEach(async function(word) {
            let newScore = (text.match(word) || []).length;
            score += newScore;
            totalScore += newScore;
        });
        let key = {
            keyword: (Object.keys(keyword)).join(),
            score: score
        };
        let label = [
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
    let response = {
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