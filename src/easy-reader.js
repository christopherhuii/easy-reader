// @flow

import 'whatwg-fetch'
import React, {Component} from 'react';
import debounce from 'lodash.debounce';

import './easy-reader.css';
import RedditPost from './js/reddit-post.js';
import HackerNewsPost from './js/hn-post.js';

class EasyReader extends Component {
    state = {
        activeTab: '',
        posts: []
    };

    checkScrollPosition = debounce(() => {
        const scrollToTopButton = window.document.querySelector('.easy-reader__scroll-top-container');
        if (window.document.body.scrollTop > 200) {
            scrollToTopButton.classList.add('active');
        } else {
            scrollToTopButton.classList.remove('active');
        }
    }, 150);

    fetchHackerNewsPosts = () => {
        // Only taking first 25 (for now...)
        fetch('https://hacker-news.firebaseio.com/v0/topstories.json', {
            method: 'GET'
        }).then((response) => {
            return response.json();
        }).then((data) => {
            return new Promise((resolve, reject) => {
                let posts = [];

                data.slice(0, 25).forEach((postId) => {
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${postId}.json`, {
                        method: 'GET',
                    }).then((response) => {
                        return response.json();
                    }).then((data) => {
                        posts.push(data);

                        if (posts.length === 25) {
                            resolve(posts);
                        }
                    });
                });

            }).then((posts) => {
                this.setState({
                    activeTab: 'hacker-news',
                    posts
                });
            });
        });
    }

    fetchRedditPosts = () => {
        fetch('https://www.reddit.com/.json', {
            method: 'GET',
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({
                activeTab: 'reddit',
                posts: data.data.children
            });
        });
    }

    renderPosts = () => {
        return this.state.posts.map((post) => {
            switch(this.state.activeTab) {
                case 'reddit':
                    return <RedditPost post={post} key={post.data.id}/>
                case 'hacker-news':
                    return <HackerNewsPost post={post} key ={post.id} />
                default:
                    return <h1>Error</h1>
            }
        })
    }

    scrollToTop = () => {
        let int = setInterval(() => {
            window.scrollBy(0, -30);
            if (window.document.body.scrollTop === 0) {
                clearInterval(int);
            }
        }, 10);
    }

    componentDidMount() {
        this.fetchRedditPosts();
        window.addEventListener('scroll', this.checkScrollPosition);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.fetchRedditPosts);
    }

    render() {
        const {activeTab, posts} = this.state;
        return (
            <div className="easy-reader__wrapper" id="easy-reader">
                <h1 className="easy-reader__global-heading">easy reader</h1>
                <ul className="easy-reader__nav-container">
                    <li className={`easy-reader__nav ${'reddit' === activeTab ? 'active' : ''}`} onClick={this.fetchRedditPosts}>reddit</li>
                    <li className={`easy-reader__nav ${'medium' === activeTab ? 'active' : ''}`} onClick={() => this.fetchPosts('medium')}>medium</li>
                    <li className={`easy-reader__nav ${'hacker-news' === activeTab ? 'active' : ''}`} onClick={this.fetchHackerNewsPosts}>hacker news</li>
                    <li className={`easy-reader__nav ${'lifehacker' === activeTab ? 'active' : ''}`} onClick={this.fetchHackerNewsPosts}>lifehacker</li>
                </ul>
                <div className="easy-reader__post-wrapper">
                    <div className="easy-reader__post-container">
                        {this.renderPosts()}
                        {posts.length > 1 ? (
                            <p className="easy-reader__end-text">the end :)</p>
                        ): null}
                    </div>
                </div>
                <a className="easy-reader__scroll-top-container" onClick={this.scrollToTop}>
                    <img alt="scroll-to-top-button" className="easy-reader__scroll-top" src="./arrow-up.png" />
                </a>
            </div>
        );
    }
}

export default EasyReader;
