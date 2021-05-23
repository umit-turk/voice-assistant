import React from 'react'
import NewsCard from '../NewsCard/NewsCard'

//destructing yöntemi ile prop'u aldık ve map metodu ile tek tek yazdırdık.
const NewsCards = ({articles}) => {
    return (
        <div>
            {articles.map((article, i) => (
                <NewsCard />
            ))}
        </div>
    )
}

export default NewsCards
