intent('What does this app do?', 'What can I do here?',
      reply('This is a news project.'));



const API_KEY = 'c86de64c77a34066b5461568e063fe3d';
let savedArticles = [];

// News by Source
intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${API_KEY}`;
    
    
    if(p.source.value) {
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const {articles} = JSON.parse(body);
        
        if(!articles.length) {
            p.play('Sorry, please try searching for news from a different source');
            return;
        }
        
        savedArticles = articles;
        
        p.play({command: 'newHeadlines', articles});
        p.play(`Here are the (latest | recent)${p.source.value}.`)
        
         p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    } );
})

// News by Term
intent('what\'s up with $(term* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
    
    
    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const {articles} = JSON.parse(body);
        
        if(!articles.length) {
            p.play('Sorry, please try searching for something else.');
            return;
        }
        
        savedArticles = articles;
        
        p.play({command: 'newHeadlines', articles});
        p.play(`Here are the (latest | recent) articles on${p.source.value}.`);
        
         p.play('Would you like me to read the headlines?');
        p.then(confirmation);
    } );
})

// News by Categories
const CATEGORIES = ['business', 'entartainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) =>  {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=${API_KEY}`;
    
    
    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const {articles} = JSON.parse(body);
        
        if(!articles.length) {
            p.play('Sorry, please try searching for a different category.');
            return;
        }
        
        savedArticles = articles;
        
        p.play({command: 'newHeadlines', articles});
        
          if(p.C.value) {
           p.play(`Here are the (latest | recent) articles on${p.C.value}.`)
        } else {
             p.play(`Here are the (latest | recent)`)
        }
        
        p.play('Would you like me to read the headlines?');
        p.then(confirmation);
        
       
    } );
});

const confirmation = context(() => {
    intent('yes', async (p) => {
        for(let i = 0; i < savedArticles.length; i++){
            p.play({command:  'highlight', article: savedArticles[i]});
            p.play(`${savedArticles[i].title}`);
        }
    })
    
    intent('no', async (p) => {
        p.play('sure, sounds good to me.')
    })
})

intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value){
        p.play({command: 'open', number: p.number.value, articles: savedArticles})
    }
})

intent('(go|) back', (p) => {
    p.play('Sure, going back');
    p.play({command: 'newHeadlines', articles: []})
})