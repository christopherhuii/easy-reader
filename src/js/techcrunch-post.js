import React from 'react';
import utils from './utils.js';
import './../scss/techcrunch-post.css';

export default function TechCrunchPost({post}) {
    const postCategories = post.categories.slice(0, 10).map((category) => {
        return (
            <span
                className="medium__post-category"
                key={`${post.guid}-${category}`}>
                {category}
            </span>
        );
    });

    return (
        <div className="techcrunch__post">
            <a className="techcrunch__post-wrapper" href={post.guid} target="_blank" rel="noopener noreferrer">
                {post.thumbnail ? (
                    <div
                        className="techcrunch__post-image"
                        style={{backgroundImage: `url(${post.enclosure.link})`}}
                    />
                ): null}
                <div className="techcrunch__post-content" data-match-height-watch>
                    <p className="techcrunch__post-title">{post.title}</p>
                    <div className="techcrunch__categories">
                        {postCategories}
                    </div>
                    <span className="techcrunch__post-date">{utils.formatDate(post.pubDate)}</span>
                    <span className="techcrunch__post-author">{post.author}</span>
                </div>
            </a>
        </div>
    );
}
