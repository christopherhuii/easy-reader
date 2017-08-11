import React from 'react';
import './../scss/hn-post.css';

export default function HackerNews({post}) {

    return (
        <div className="hn__post">
            <a className="hn__title" href={post.url}>{post.title}</a>
            <span className="hn__info">{`${post.score} points by ${post.by}`}</span>
        </div>
    )
}
