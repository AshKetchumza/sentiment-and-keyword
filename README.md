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
        "sentiment_score": 7,
        "sentiment_status": "Positive",
        "sentiment_calculation": [  {"keyword1": 2},
                                    {"keyword2": 3} ],
        "sentiment_comparative": "1.67",
        "strength_tracker": [ {"keyword": "Independent", "score": 3},
                              {"keyword": "Honest", "score": 0},
                              {"keyword": "Collaborative", "score": 2},
                              {"keyword": "Brilliant", "score": 4},
                              {"keyword": "Caring", "score": 1} ],
        "graph_data": [ ["Keyword", "Percentage", { "role": "style" }],
                        ["keyword1", 0, "#color"],
                        ["keyword3", 50, "#color"],
                        ["keyword4", 25, "#color"],
                        ["keyword5", 15, "#color"],
                        ["keyword6", 10, "#color"],  ]
    };

```
