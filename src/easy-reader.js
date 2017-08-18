// @flow

import 'whatwg-fetch'
import React, {Component} from 'react';
import debounce from 'lodash.debounce';

import './easy-reader.css';
import Loader from './js/loader.js';
import RedditPost from './js/reddit-post.js';
import HackerNewsPost from './js/hn-post.js';
import GiphyPost from './js/giphy-post.js';
import MediumPost from './js/medium-post.js';

class EasyReader extends Component {
    state = {
        activeTab: '',
        isFetchInProgress: false,
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
        this.setState({
            isFetchInProgress: true
        }, () => {
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
                        isFetchInProgress: false,
                        posts
                    });
                });
            });
        });
    }

    fetchGiphyPosts = () => {
        this.setState({
            isFetchInProgress: true
        }, () => {
            fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY}&limit=100`, {
                method: 'GET'
            }).then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({
                    activeTab: 'giphy',
                    isFetchInProgress: false,
                    posts: data.data
                });
            });
        });
    }

    fetchMediumPosts = () => {
        // Using RSS to JSON because Medium API doesn't support GET and scraping violates ToS
        this.setState({
            isFetchInProgress: true
        }, () => {
            fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/topic/popular', {
                method: 'GET'
            }).then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({
                    activeTab: 'medium',
                    isFetchInProgress: false,
                    posts: data.items
                });
            });
        });
    }

    fetchRedditPosts = () => {
        this.setState({
            isFetchInProgress: true
        }, () => {
            fetch('https://www.reddit.com/.json', {
                method: 'GET',
            }).then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({
                    activeTab: 'reddit',
                    isFetchInProgress: false,
                    posts: data.data.children
                });
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
                case 'giphy':
                    return <GiphyPost post={post} key={post.id} />
                case 'medium':
                    return <MediumPost post={post} key={post.guid} />
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
        const {activeTab, isFetchInProgress, posts} = this.state;
        const postTypeClass = this.state.activeTab === 'giphy' ? 'giphy' : '';
        return (
            <div className="easy-reader__wrapper" id="easy-reader">
                <h1 className="easy-reader__global-heading">easy reader</h1>
                <ul className="easy-reader__nav-container">
                    <li className={`easy-reader__nav ${'reddit' === activeTab ? 'active' : ''}`} onClick={this.fetchRedditPosts}>reddit</li>
                    <li className={`easy-reader__nav ${'medium' === activeTab ? 'active' : ''}`} onClick={this.fetchMediumPosts}>medium</li>
                    <li className={`easy-reader__nav ${'hacker-news' === activeTab ? 'active' : ''}`} onClick={this.fetchHackerNewsPosts}>hacker news</li>
                    <li className={`easy-reader__nav ${'giphy' === activeTab ? 'active' : ''}`} onClick={this.fetchGiphyPosts}>giphy</li>
                    <li className={`easy-reader__nav ${'lifehacker' === activeTab ? 'active' : ''}`} onClick={this.fetchHackerNewsPosts}>lifehacker</li>
                </ul>
                <div className="easy-reader__post-wrapper">
                    <div className={`easy-reader__post-container ${postTypeClass}`}>
                        {this.renderPosts()}
                        {posts.length > 1 ? (
                            <p className="easy-reader__end-text">the end :)</p>
                        ): null}
                    </div>
                    {isFetchInProgress ? (
                        <div className="easy-reader__loader">
                            <Loader />
                        </div>
                    ) : null}
                </div>
                <a className="easy-reader__scroll-top-container" onClick={this.scrollToTop}>
                    <img alt="scroll-to-top-button" className="easy-reader__scroll-top" src="./arrow-up.png" />
                </a>
            </div>
        );
    }
}

export default EasyReader;
