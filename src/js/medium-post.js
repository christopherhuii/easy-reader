import React from 'react';
import utils from './utils.js';
import './../scss/medium-post.css';

export default function GiphyPost({post}) {
    const postCategories = post.categories.map((category) => {
        return (
            <span
                className="medium__post-category"
                key={`${post.guid}-${category}`}>
                {category}
            </span>
        );
    });

    return (
        <div className="medium__post">
            <a className="medium__post-wrapper" href={post.guid} target="_blank" rel="noopener noreferrer">
                {utils.parseImage(post.description) ? (
                    <img
                        alt={post.title}
                        className="medium__post-image"
                        src={utils.parseImage(post.description)}
                    />
                ): null}
                <div className="medium__post-content">
                    <p className="medium__post-title">{post.title}</p>
                    <div className="medium__categories">
                        {postCategories}
                    </div>
                    <span className="medium__post-date">{utils.formatDate(post.pubDate)}</span>
                    <span className="medium__post-author">{post.author}</span>
                </div>
            </a>
        </div>
    );
}
