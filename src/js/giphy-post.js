import React from 'react';
import './../scss/giphy-post.css';

export default function GiphyPost({post}) {
    return (
        <div className="giphy__post">
            <a className="giphy__gif" href={post.url}>
                <img alt="gif" src={post.images.original.webp} />
            </a>
        </div>
    )
}
