// @flow

import 'whatwg-fetch'
import React, {Component} from 'react';
import debounce from 'lodash.debounce';

import './easy-reader.css';
import RedditPost from './js/reddit-post.js';

class EasyReader extends Component {
    state = {
        activeTab: '',
        posts: []
    };

    checkScrollPosition = debounce(() => {
        const scrollToTopButton = window.document.querySelector('.easy-reader__scroll-top-container');
        console.log(window.document.body.scrollTop);
        if (window.document.body.scrollTop > 200) {
            scrollToTopButton.classList.add('active');
        } else {
            scrollToTopButton.classList.remove('active');
        }
    }, 150);

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

    scrollToTop = () => {
        let int = setInterval(() => {
            window.scrollBy(0, -30);
            if (window.document.body.scrollTop === 0) {
                clearInterval(int);
            }
        }, 10);
    }

    componentDidMount() {
        this.fetchPosts('reddit');
        window.addEventListener('scroll', this.checkScrollPosition);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.checkScrollPosition);
    }


    render() {
        const {activeTab, posts} = this.state;
        return (
            <div className="easy-reader__wrapper" id="easy-reader">
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
                <a className="easy-reader__scroll-top-container" onClick={this.scrollToTop}>
                    <img alt="scroll-to-top-button" className="easy-reader__scroll-top" src="./arrow-up.png" />
                </a>
            </div>
        );
    }
}

export default EasyReader;
