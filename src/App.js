import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import NewsCards from './components/NewsCards/NewsCards'
import useStyles from './styles.js';
import  wordsToNumbers from 'words-to-numbers';

const alanKey =
  "88e6e578e9b50da99deb99b9e22df65e2e956eca572e1d8b807a3e2338fdd0dc/stage";

const App = () => {

  const [newsArticles, setNewsArticles] = useState([])
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();


  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
        } else if(command === 'highlight'){
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1)
        } else if(command === 'open'){
          const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true}) : number;
          const article = articles[parsedNumber - 1];

          if(parsedNumber > 20) {
            alanBtn().playText('please try that again.')
          }else if(article){
            window.open(article.url, '_blank');
            alanBtn().playText('Opening');
          }

        }
      }
    })
  }, []);
  return (
    <div>
      <div className={classes.logoContainer}>
        <img src="http://summ.ai/wp-content/uploads/2019/09/logo-transparent-squared-25k-300x300.png" className={classes.alanLogo} alt="alan logo" />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle}/> {/* props olarak gönderdik. */}
    </div>
  );
};

export default App;
