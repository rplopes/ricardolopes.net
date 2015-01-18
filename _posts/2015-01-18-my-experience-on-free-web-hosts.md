---
layout: post
title: My experience on free web hosts
category: experience
tags:
 - Wordpress
 - PHP
 - MySQL
 - blogging
 - web host
excerpt: Before launching my blog, I’ve been searching for the perfect web host for it. I wanted to spend as little money as possible during the blog’s first days, so if something went wrong it wouldn’t be that bad. Besides, I had never bought any hosting plan, so I really wanted to try the alternative before considering spending money for hosting a blog. In this post I’ll share my experience on the four free web hosts I tried, and some more about the search I’ve been doing. If you’re considering to get a free hosting plan, believe me, you should really read this.
---

_**Disclaimer:** This blog post was first published on the 24th of January of 2011. This means that most of its content might no longer be up-to-date. This was published in my previous blog, which has [met an unfortunate end]({% post_url 2015-01-11-a-postmortem-of-my-wordpress-blog %}), and is being reposted now as an attempt to resurface some of the most popular posts that have been lost._

Before launching my blog, I’ve been searching for the perfect web host for it. I wanted to spend as little money as possible during the blog’s first days, so if something went wrong it wouldn’t be that bad. Besides, I had never bought any hosting plan, so I really wanted to try the alternative before considering spending money for hosting a blog. In this post I’ll share my experience on the four free web hosts I tried, and some more about the search I’ve been doing. If you’re considering to get a free hosting plan, believe me, you should really read this.

## Host1Free

After an intensive search for the best free host, I gave Host1Free a try. Why? Many free hosts use banners or text ads in your site, whether you want them or not. Those that don’t do it usually give very small amounts of bandwidth and disk space (bandwidth is crucial if you’re planning on getting any visitors, and disk space will directly affect how much content you can have online). Host1Free, however, promises an astonishing 10GB disk space and 150GB bandwidth (monthly) with no forced ads on hosted sites, completely free! Besides, you also get 2 MySQL databases, the possibility to run PHP, a nice application installer, and more. These stats are really good for any rookie launching a blog or a website. And if it grows into something big, you can always upgrade to the premium hosting, that gives you all diskspace and bandwidth you want (and also unlimited MySQL databases and FTP accounts, possibility to run Perl, Python, Ruby on Rails, and more, secure webmail, much more support and so on). Perfect, right?

So, what’s the catch?

I never even gave the premium hosting a try, so I won’t talk about it, although I have my doubts about their claims. I also never got to test the free hosting promised limits, because I gave up on Host1Free too soon for that, so I won’t talk about those limits and believe they really offer that disk space and bandwidth to non-paying users.

The first issue I noticed was speed. Really, this host was painfully slow. Sometimes, it would take half a minute to load simple text pages (and the other times weren’t much faster). For any website that is supposed to deliver value without frustrating its visitors to death, a 30-second waiting time on any page load is simply something you can’t let happen.

However, it couldn’t be that bad. As my blog’s host it would be useless, but I could still use it for test purposes. I first used it to learn some PHP and integration with PHP and MySQL, and then used it to learn how to create a WordPress blog. I have to say that their application installer, Softaculous Auto Installer, is awesome, and installing WordPress with it was completely effortless.

During my tests on that test-only blog, I found yet another big annoyance: Host1Free doesn’t force ads into the hosted sites, but it does force some code without telling you. The forced code doesn’t seem to make any difference in the displayed page, at least when Javascript is enabled. However, that HTML code is also put in the blog’s RSS feed. As RSS doesn’t support those tags, the blog’s feed gets corrupted, and thus becomes completely useless.

I have had enough with this server. I wanted a host for my blog, and this wasn’t it.

## ByeHost

My second stop was ByeHost, a free server without forced ads, featuring 5.5GB disk space, 200GB bandwidth, 50 MySQL databases, PHP, unlimited POP email accounts, another nice application installer, and more. ByeHost even managed to load pages faster than Host1Free (although that’s not really that hard). And when choosing your subdomain, you could have, among other less awesome options, `[yourname].isgreat.org` (like `ricardolopes.isgreat.org`). What could you ask more from a free service?

However, the speed wasn’t good enough. The test-only blog would load a bit faster than the one in the previous host, but not fast enough for any blog trying to get returning visitors. By now, it’s becoming clear which is the no. 1 problem with free web hosts.

Just like I did with the previous server, I still gave ByeHost a try for test purposes only. As it didn’t force any type of code in my pages, I could finally test drive WordPress, including its RSS feed.

ByeHost’s application installer, Fantastico, was also able to install WordPress with no effort at all. However, it didn’t install WordPress on the site’s root, which led to some small issues. The bigger issue happened just some days later. Suddenly, all pages besides index.php, the main page, would not load, and a 404 Error page would appear. Even though 404 Error means that the page was not found, I still had all pages on the server, just like they were before this happened.

Having a very slow blog is bad, but not being able to show a blog’s content is completely out of question.

Next!

## Zymic

This free server promised an ad-free hosting featuring 5GB disk space, 50GB bandwidth, 3 MySQL databases, PHP and so on (notice: for this article, I’ve first copied the information on Zymic’s start page, but then visited the page with the full features of the free hosting plan, and the numbers were lower there, so the start page has some misleading information). Not as great as the other servers I tried, but still more than I would ask from a free service.

As you may have already guessed, the first issue I found was speed. Zymic’s free hosting service was as slow as Host1Free’s. So once again I had a host acceptable (but painful) for my WordPress experiments, but useless for hosting the real thing.

Other small issues appeared, like some problems with the FTP account that were easily solved, not being able to choose one specific available subdomain, WordPress admin panel being unable to fetch its feeds and plugins list, PHP mail function disabled, and others. Zymic didn’t offer any application installer, so I had to manually install WordPress, which wasn’t a big deal at all.

I used this host to test WordPress, and then to build my blog’s theme. I didn’t find any other major flaws, like the ones I found on the other servers. I still couldn’t use it to host the real blog, because of its speed, but at least I was able to finish its design and get ready to launch the real thing elsewhere.

After finishing the blog design, I removed all files from Zymic. I was definitely not trying any more free hosts, and would go for a paid host for my blog.

## DeluXe Host

… Or was I?

After deleting all my files on every free host I tried and studying the best paid hosting service for my blog, I received an email from DeluXe Host, saying my site was finally accepted, and I could now use their free server. Now that’s what I call timing.

I have to say that their hosting service is definitely the best of all the free servers I tested. Loading speeds are actually pretty good, and although there’s no auto-installer, WordPress worked flawlessly after manual installation. After a few tests, I found no issues at all. So, what’s the catch?

The first little problem I found was the server’s lack of support for .htaccess files. This means that some features are not configurable, such as the ability to change the permalinks of blog posts to something meaningful, instead of plain ID numbers (not a big problem, but still pretty bad for link sharing and SEO). But the big deal breaker was the lack of name servers. Without them, you can’t use your own domain name on your site, you’re forced to have a `dhost.info/[yourname]` URL. Of course you could use an alias URL (like `.pt.vu`), but then you couldn’t share blog posts links at all, since the URL would never change through pages.

So this is not a bad host at all, but won’t do for anyone who needs more professional looking domains. Still a nice option if you don’t mind having a `dhost.info/[yourname]` domain (and if you don’t mind the waiting time for approval).

## Other free hosts

During my search, I stumbled upon many more free hosts. The main drawbacks that made me put them aside were usually at least one of the following:

- Forced ads on webpages
- Only English sites were accepted
- Very strict limits on disk size, bandwidth or maximum file size
- Mandatory regular activity in the host’s support forums
- The site’s registration had to be manually accepted (I still haven’t received response from some of those hosts I tried)
- The site was offline, and not just for a day

Finally, I need to warn you about the popular host 000webhost.com. It looks like a nice free host, featuring 1.5GB disk space, 100GB bandwidth and so on. However, a quick search on Google will show you that it’s a scam. Many people have been reporting being kicked from the hosting service for no reason at all, and many of them had earned money from the host’s affiliate program, that they never received. Having a website that suddenly goes offline for no reason is awful, although you can’t complain much if you’re using a free service, but doing paid work and being kicked out before receiving the money is a serious matter.

## Final thoughts

This has been a very frustrating experience, as you can easily guess. Overall, there seems to be no acceptable free web host for any kind of serious website/blog. Their main drawback is speed, surely because no server administrator will want to have many resources allocated for the non-paying users. That makes it possible to raise the bandwidth limit, because at very low speeds you won’t be able to push many bandwidth anyway.

I don’t know how’s the performance on forced ads hosts, as their clients can generate some profit from those ads, but having elements on pages that you can’t control is a big drawback for many websites/blogs (such as the forced scripts on Host1Free that corrupted the blog’s RSS feed).

So if you want your site or blog online, based on my experience, you have two options: go for a paid hosting plan, or use the sites of the services you’re going to use (if you want a WordPress blog, you can register at WordPress.com to have it hosted on WordPress’s servers, instead of downloading it from WordPress.org and having to find a suitable host yourself).

I’d love to hear you thoughts on free hosts, and your experience. Have any free web host actually worked right for you?

## 2015 update

This post is starting to feel old, but since it was still getting so much traffic and comments (lost with the old blog, unfortunately), I decided that it could still be useful. The best I can do now without rewriting the whole thing is giving a short summary of my recent experience.

In short, the best free host that one can choose is probably [Heroku](https://www.heroku.com), which provides many different environments (like PHP, to run a Wordpress install, or Ruby for a Ruby on Rails webapp). Its main problems are speed (if you're not paying, your instance is put on stand by when no one is accessing it, which makes the next access very slow, as it has to wait for the instance to load again) and, if you're planning on upgrading to a paying tier in the future, the prices aren't the most competitive ones.

Now that I switched my blog from Wordpress to Jekyll, a great free host that I could have chosen is [Github Pages](https://help.github.com/articles/using-jekyll-with-pages/). I'm not using it, so I can't tell the pros and cons, but I believe that it doesn't have the speed issues other hosts have. A possible problem for some is that in the free tier you have to disclose the full source code of your webapp.

All in all, my general recommendation still remains: if you're looking for a host for anything serious or professional-looking, you're better off willing to spend some money on it. Low-volume websites aren't that expensive to host, and if you're already paying, it's much easier to scale in the future, and to get better customer support.
