// @flow

import 'whatwg-fetch'
import React, {Component} from 'react';
import debounce from 'lodash.debounce';
import Media from 'react-media';

import './easy-reader.css';
import Loader from './js/loader.js';
import RedditPost from './js/reddit-post.js';
import HackerNewsPost from './js/hn-post.js';
import GiphyPost from './js/giphy-post.js';
import MediumPost from './js/medium-post.js';
import TechCrunchPost from './js/techcrunch-post.js';
import utils from './js/utils.js';

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

    fetchTechCrunchPosts = () => {
        this.setState({
            isFetchInProgress: true
        }, () => {
            fetch('https://api.rss2json.com/v1/api.json?rss_url=http://feeds.feedburner.com/TechCrunch/', {
                method: 'GET'
            }).then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({
                    activeTab: 'techcrunch',
                    isFetchInProgress: false,
                    posts: data.items
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
                case 'techcrunch':
                    return <TechCrunchPost post={post} key={post.guid} />
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

    resizeMatchHeight = () => {
        utils.matchHeight(true);
    }

    onMobileDropdownChange = (e) => {
        switch(e.target.value) {
            case 'reddit':
                this.fetchRedditPosts();
                break;
            case 'hacker-news':
                this.fetchHackerNewsPosts();
                break;
            case 'giphy':
                this.fetchGiphyPosts();
                break;
            case 'medium':
                this.fetchMediumPosts();
                break;
            case 'techcrunch':
                this.fetchTechCrunchPosts();
                break;
        }
    }

    componentDidMount() {
        this.fetchRedditPosts();
        window.addEventListener('scroll', this.checkScrollPosition);
        window.addEventListener('resize', this.resizeMatchHeight);
    }

    componentDidUpdate() {
        // Only posts that need matchHeight (for now...)
        if (this.state.activeTab === 'techcrunch') {
            utils.matchHeight();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.fetchRedditPosts);
        window.removeEventListener('resize', this.resizeMatchHeight);
    }

    render() {
        const {activeTab, isFetchInProgress, posts} = this.state;
        const postTypeClass = activeTab === 'giphy' ? 'giphy' : '';
        return (
            <div className="easy-reader__wrapper" id="easy-reader">
                <h1 className="easy-reader__global-heading">easy reader</h1>
                <Media query="(min-width: 768px)">
                    {matches => matches ? (
                        <ul className="easy-reader__nav-container">
                            <li className={`easy-reader__nav ${'reddit' === activeTab ? 'active' : ''}`} onClick={this.fetchRedditPosts}>reddit</li>
                            <li className={`easy-reader__nav ${'medium' === activeTab ? 'active' : ''}`} onClick={this.fetchMediumPosts}>medium</li>
                            <li className={`easy-reader__nav ${'hacker-news' === activeTab ? 'active' : ''}`} onClick={this.fetchHackerNewsPosts}>hacker news</li>
                            <li className={`easy-reader__nav ${'giphy' === activeTab ? 'active' : ''}`} onClick={this.fetchGiphyPosts}>giphy</li>
                            <li className={`easy-reader__nav ${'techcrunch' === activeTab ? 'active' : ''}`} onClick={this.fetchTechCrunchPosts}>TechCrunch</li>
                        </ul>
                    ): (
                        <select className="easy-reader__nav-container--mobile" onChange={this.onMobileDropdownChange} value={activeTab || 'reddit'}>
                            <option value="reddit">reddit</option>
                            <option value="medium">medium</option>
                            <option value="hacker-news">hacker news</option>
                            <option value="giphy">giphy</option>
                            <option value="techcrunch">techcrunch</option>
                        </select>
                    )}
                </Media>
                <div className="easy-reader__post-wrapper">
                    <div className={`easy-reader__post-container ${postTypeClass}`} data-match-height-container>
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
