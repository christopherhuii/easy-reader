import React from 'react';
import './../scss/reddit-post.css';

export default function RedditPost({post: {data}}) {

    return (
        <div className="post__wrapper">
            <a
                className="post__title"
                href={data.url}
                rel="noopener noreferrer"
                target="_blank"
            >
                {data.title}
            </a>
            <a
                className="post__subreddit"
                href={`https://reddit.com/r/${data.subreddit}`}
                rel="noopener noreferrer"
                target="_blank"
            >
                (r/{data.subreddit})
            </a>
        </div>
    );
}
