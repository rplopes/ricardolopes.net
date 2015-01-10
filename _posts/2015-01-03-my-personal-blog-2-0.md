---
layout: post
title: My personal blog 2.0
category: meta
tags:
 - Wordpress
 - Jekyll
 - PHP
 - Ruby
 - blogging
---

For around 4 years I've been maintaining my own personal blog, a self-hosted WordPress install, where I usually talked about things I was working with, cool tricks that I learned and wanted to share the knowledge, and so on. The typical dev blog. However, sometimes it faced some periods of inactivity, either by lack of time, energy or inspiration. And then the worst happened.

After some weeks of very limited Internet access and close to no free time, I decided to take a look at my blog, and what I saw was a completely broken site. There was a problem in the database connection, an that completely killed all its pages, including the admin section. So my blog was as good as dead and I didn't even know about it before casually trying to visit it.

I'll leave the details for a later post (update: it's [here]({% post_url 2015-01-11-a-postmortem-of-my-wordpress-blog %})!). Long story short, I lost the work of these 4 years because of some unknown problem and had to shut down my Wordpress blog.

This post is, then, a new start. After that experience, this time I dropped Wordpress and PHP and went for [Jekyll](http://jekyllrb.com/) and Ruby. One of the main reasons is that Jekyll pre-generates static pages, instead of keeping a server running to access a database and render dynamic pages. So I'm not expecting to have these kind of issues from now on. More details about Jekyll, its advantages and cool tricks I learned will come in future posts.

This new start allowed me to change how some things worked in my blog, now that I could break compatibility with the past. I also used this opportunity to merge my website and blog into one project and give them a new custom-built theme.

I recovered some of the old posts through the RSS feed and Google cache and will repost the most popular ones, so that their useful information doesn't get lost with the rest of the old blog. And, of course, brand new content is also waiting to be published.

So... welcome again to my personal blog, second edition.
