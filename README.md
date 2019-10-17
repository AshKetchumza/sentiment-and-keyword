# [sentiment-and-keyword](https://www.npmjs.com/package/sentiment-and-keyword)

### Analyze strings based on sentiment and keyword strength using synonyms sentiment analysis

See https://www.npmjs.com/package/sentiment-and-keyword

### Install

```npm i sentiment-and-keyword ```

### Usage

```js
const sentkey = require('sentiment-and-keyword');

// Set your text to analyzed *required
var text = "The text you want to be analyzed";
// Set your keywords to be used for analysis *required
var keywords = ["love", "honour", "independance"];

sentkey.analyze(text,keywords,function(err,res){
    if(err){
        console.log(err);
        return
    } 
    console.log(res);
})

```

### Result parse

```json
{
        "text": "The text you sent for analysis",
        "sentiment_score": 0,
        "sentiment_status": "Neutral",
        "sentiment_calculation": [  {"Independent": 0},
                                    {"Honest": 0},
                                    {"Collaborative": 0},
                                    {"Brilliant": 0},
                                    {"Caring": 0} ],
        "sentiment_comparative": "0",
        "strength_tracker": [ {"keyword": "Independent", "score": 0},
                              {"keyword": "Honest", "score": 0},
                              {"keyword": "Collaborative", "score": 0},
                              {"keyword": "Brilliant", "score": 0},
                              {"keyword": "Caring", "score": 0} ],
        "graph_data": [ ["Keyword", "Percentage", { "role": "style" }],
                        ["keyword1", 0, "#color"],
                        ["keyword3", 0, "#color"],
                        ["keyword4", 0, "#color"],
                        ["keyword5", 0, "#color"],
                        ["keyword6", 0, "#color"],  ]
    };

```
