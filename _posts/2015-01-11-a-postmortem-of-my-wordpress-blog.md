---
layout: post
title: A postmortem of my WordPress blog
category: meta
tags:
 - Wordpress
 - blogging
---

I have to say that, for a software developer and tech enthusiast, I'm kind of disappointed with myself. For around 4 years I've been maintaining my personal blog, a self-hosted WordPress install, where I would share projects, tips and rants, like the usual developer's blog. However, for some reason I was finding less and less topics to talk about. Either I was too busy or exhausted to take the time to write meaningful posts, or the inspiration wasn't simply there.

At least as far as software developer's standards go, I actually enjoy writing and documenting. I believe it helps sorting out the thoughts in your head, and definitely are a great tool for sharing knowledge. So it was actually bothering more than it should the fact that new blog posts would come too infrequently. This lead to long periods of time without visiting my own blog or taking a look at its visitors stats.

After some very intense weeks with almost no free time and no Internet at home, I casually visited my blog to see how things were going, and what I saw left me completely off-guard at first, and irritated after that. The blog was completely broken, and all I could see was the message `Error establishing a database connection`. The same message would appear if I tried to access the admin section. So it was as good as dead, with nothing I could do about it, and without a single warning.

But how did that happen? Since when was my blog down? And how come did nothing trigger an alert during all that time?

![Google Analytics investigation](/assets/2015-01-10-ga.png)

After checking what Google Analytics had to tell me, I realised that the blog must have been down since the 29th of October. Which means that it remained dead for almost a month (I found this in late November). A further look into the statistics showed that now most of my traffic was for my landing page (makes sense, since it's unrelated to the WordPress install and didn't suffer the same tragic fate). But there was also some traffic for some other pages. After more investigation I found out that some posts were still active, after all. This must have been because of the heavy caching that I was doing, which allowed cached pages to be displayed instead of hitting a failing CMS. I saved what I could, used my RSS feed to save some others, and the rest just got lost.

My lack of participation was obviously resulting in a low number of visitors. Still enough to be able to easily tell when the database issue started just by looking at the graphs, but clearly not enough to form an audience that would alert me of these kind of issues. The fact that some of the most popular posts were still cached, and were typically accessed through Google searches, not by browsing within the blog, also contributed to this situation remaining undetected.

About how it happened... I still have no clue. I hear how WordPress might be insecure if not always up-to-date or if you installed the wrong plugin, so I decided I should just assume the worst and go ahead and delete the whole installation and think of [what to do next]({% post_url 2015-01-03-my-personal-blog-2-0 %}).

So that's my story: I maintained my personal blog for around 4 years, although it wasn't really getting the love it deserved, and at some point it just died without me noticing it for almost a month. Now with this second one I'm expecting things to get more manageable and new content to show up more frequently. Time will tell.