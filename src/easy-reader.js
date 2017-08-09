// @flow

import React, {Component} from 'react';
import 'whatwg-fetch'
import './easy-reader.css';
import RedditPost from './js/reddit-post.js';
class EasyReader extends Component {
    state = {
        activeTab: '',
        posts: []
    };

    getPostTypes = () => {
        return {
            reddit: 'https://www.reddit.com/.json',
        }
    }
    fetchPosts = (slug: string) => {
        fetch(this.getPostTypes()[slug], {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({
                activeTab: slug,
                posts: data.data.children
            });
        });
    }

    renderPosts = () => {
        return this.state.posts.map((post) => {
            switch(this.state.activeTab) {
                case 'reddit':
                    return <RedditPost post={post} key={post.data.id}/>
                default:
                    return <h1>Error</h1>
            }
        })
    }
    componentDidMount() {
        this.fetchPosts('reddit');
    }

    render() {
        const {activeTab, posts} = this.state;
        return (
            <div className="easy-reader__wrapper">
                <h1 className="easy-reader__global-heading">easy reader</h1>
                <ul className="easy-reader__nav-container">
                    <li className={`easy-reader__nav ${'reddit' === activeTab ? 'active' : ''}`} onClick={() => this.fetchPosts('reddit')}>reddit</li>
                    <li className={`easy-reader__nav ${'medium' === activeTab ? 'active' : ''}`} onClick={() => this.fetchPosts('medium')}>medium</li>
                    <li className={`easy-reader__nav ${'hacker-news' === activeTab ? 'active' : ''}`} onClick={() => this.fetchPosts('hacker-news')}>hacker news</li>
                    <li className={`easy-reader__nav ${'lifehacker' === activeTab ? 'active' : ''}`} onClick={() =>this.fetchPosts('lifehacker')}>lifehacker</li>
                </ul>
                <div className="easy-reader__post-wrapper">
                    <div className="easy-reader__post-container">
                        {this.renderPosts()}
                        {posts.length > 1 ? (
                            <p className="easy-reader__end-text">the end :)</p>
                        ): null}
                    </div>
                </div>
            </div>
        );
    }
}

export default EasyReader;
