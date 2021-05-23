import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import NewsCards from './components/NewsCards/NewsCards'
import useStyles from './styles.js';

const alanKey =
  "88e6e578e9b50da99deb99b9e22df65e2e956eca572e1d8b807a3e2338fdd0dc/stage";

const App = () => {

  const [newsArticles, setNewsArticles] = useState([])
  const classes = useStyles();


  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({ command, articles }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
        }
      }
    })
  }, []);
  return (
    <div>
      <div className={classes.logoContainer}>
        <img src="http://summ.ai/wp-content/uploads/2019/09/logo-transparent-squared-25k-300x300.png" className={classes.alanLogo} alt="alan logo" />
      </div>
      <NewsCards articles={newsArticles} /> {/* props olarak gönderdik. */}
    </div>
  );
};

export default App;
