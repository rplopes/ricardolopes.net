---
layout: post
title: Setting up a hacker's blog with Jekyll, part 2
category: tutorial
tags:
 - Jekyll
 - Ruby
 - blogging
 - HTML
---

Feeling like building your new bog from scratch with tools that empower you to develop it the way you want? You've come to the right place. If you're just starting, make sure you read [part 1]({% post_url 2015-02-01-setting-up-a-hackers-blog-with-jekyll %}) of this tutorial, where you can learn the advantages of using Jekyll over other options and how to use it to create a basic blog from scratch. In this second part we'll be working with the same blog example code to extend it and make it more interesting. However, if you're just looking for a particular solution to a problem you might have with your existing blog, these examples should be self-contained enough.

Just to recap from the previous tutorial: we're using the gem [Jekyll](http://jekyllrb.com/) to generate our blog's static pages. We do that by running `jekyll serve`, which also allows us to test it in our browser locally. Our blog code structure is currently looking like this:

{% highlight bash %}
_config.yml
_layouts
    default.html
    post.html
_posts
    2015-02-01-hello-world.md
_site
index.html
{% endhighlight %}

Now without further ado let's get hacking.

## Better URLs

Jekyll defaults URLs to the format `/:year/:month/:day/:title.html`. So our Hello World post has the URL `/2015/02/01/hello-world.html`. However, this isn't the best structure: it's long and exposes a file extension and the full date. We can change this by setting a value to `permalink` in `_config.yml`.

If you're ok with showing the full date on the URL (some blogs do this to give a temporal context and to make it easier to have multiple posts with the same slug), then you can set the value of `permalink` to `pretty`, which hides the HTML extension:

{% highlight html %}
name: My blog
author: Ricardo Lopes
twitter: ricardoplopes

permalink: pretty
{% endhighlight %}

I typically prefer to remove the date from the URL, because I want my posts to be generally timeless, and because if they got an update, that URL would suddenly be misleading. You can do that setting `permalink` to `none`.

However, that still exposes the HMTL file extension, which I also don't want. Jekyll doesn't provide a direct value for these requirements, but fortunately it lets you build your own custom URLs. So if you want URLs that simply display the post slug you need to change your `_config.yml` to:

{% highlight html %}
name: My blog
author: Ricardo Lopes
twitter: ricardoplopes

permalink: "/:title"
{% endhighlight %}

You can adapt that to your needs: prefer having the categories and the publication year included? Change it to `/:categories/:year/:title`. And so on.

## Paginating our list of posts

Right now we're displaying every single blog post in our index page, which is far from ideal. Since we have just one blog post so far we still don't see a problem with it, but if we get to hundreds, we really shouldn't be showing them all in one page.

For the sake of experimentation, let's create two new blog posts. Our posts directory should now look like this:

{% highlight bash %}
_posts
    2015-02-01-hello-world.md
    2015-03-01-my-second-post.md
    2015-04-01-aprils-fools-post.md
{% endhighlight %}

Now that we have 3 different posts, we can paginate our blog to show only 2 posts per page. Ideally you might want more posts per page, but for now this should be good enough to test what we want.

Pagination is done by setting the number of posts per page in the config attribute `paginate` and, if you want a particular URL for those pages, setting its format like the one described for permalinks in the config attribute `paginate_path`. So to test for 2 posts per page, our `_config.yml` would change to something like:
{% highlight html %}

name: My blog
author: Ricardo Lopes
twitter: ricardoplopes

permalink: "/:title"

paginate: 2
paginate_path: "/:num"
{% endhighlight %}

However, if you visit your blog now you'll notice that it's still not paginating. That's because we've configured pagination, but we're still not using it. Let's look back at `index.html`:

{% highlight html %}
---
layout: default
---

{{"{% for post in site.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}
{% endhighlight %}

We're iterating over the full list of the website's posts. We want to iterate over the posts that belong to a particular page of our pagination. To do that, we have to fetch `posts` not from `site`, but from `paginator`:

{% highlight html %}
---
layout: default
---

{{"{% for post in paginator.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}
{% endhighlight %}

Great, now we should just see the latest two posts. And if we browse `/2` we should see the second page, with the oldest post there. Still, there's no paginator to browse different pages easily.

We can add that to the end of `index.html`, so that it shows after the list of posts. we only want to show it if there's any need for it, i.e. only if there's a previous page or a next page:

{% highlight html %}
...

{{"{% if paginator.next_page or paginator.previous_page "}}%}
  <!-- paginator code here -->
{{"{% endif "}}%}
{% endhighlight %}

With this interface you can do the fanciest paginator you can think of. Here's a suggestion for how `index.html` might look like with one of the simplest paginators that can be done:

{% highlight html %}
---
layout: default
---

{{"{% for post in paginator.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}

{{"{% if paginator.next_page or paginator.previous_page "}}%}
  {{"{% if paginator.previous_page "}}%}
    <a href="{{"{{ paginator.previous_page_path "}}}}">Previous page</a>
  {{"{% else "}}%}
    Previous page
  {{"{% endif "}}%}
  |
  {{"{% if paginator.next_page "}}%}
    <a href="{{"{{ paginator.next_page_path "}}}}">Next page</a>
  {{"{% else "}}%}
    Next page
  {{"{% endif "}}%}
{{"{% endif "}}%}
{% endhighlight %}

Great, we now have pagination working with proper navigation. Our `index.html` is starting to look crowded, though, and if we ever want to reuse the paginator code, there's a lot there to copy and to maintain. It's time to look at includes.

## Includes

Jekyll has this nice thing called includes, which are basically partials that you can reuse on multiple pages. So if you've just built your perfect paginator and you want to use it in different lists of posts, you can just put it in its own include and then just call it from those pages. Includes, unlike regular layouts, go inside their own directory: `_includes`. If you want to isolate the paginator code into one, then you'll need to create a `_includes/paginator.html`. Using the same code as above, that file would be something like:

{% highlight html %}
{{"{% if paginator.next_page or paginator.previous_page "}}%}
  {{"{% if paginator.previous_page "}}%}
    <a href="{{"{{ paginator.previous_page_path "}}}}">Previous page</a>
  {{"{% else "}}%}
    Previous page
  {{"{% endif "}}%}
  |
  {{"{% if paginator.next_page "}}%}
    <a href="{{"{{ paginator.next_page_path "}}}}">Next page</a>
  {{"{% else "}}%}
    Next page
  {{"{% endif "}}%}
{{"{% endif "}}%}
{% endhighlight %}

As you can see, there's no need to add a front matter for includes. Having this new file, we could then change our `index.html` to be simply:

{% highlight html %}
---
layout: default
---

{{"{% for post in paginator.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}

{{"{% include paginator.html "}}%}
{% endhighlight %}

In the beginning, it might seem that using includes is an overkill that just scatters the code all over your code. However, as the code gets more complex, some parts start to repeat, or files start to get too big. Right now this paginator is only used for one page (the blog index), but is ready to be reused by other future pages, like tags or categories pages. Another good use for includes is using them to isolate external blocks, like share links or comments. Speaking of comments...

## Comments with Disqus

Because these blogs are nothing but a group of static pages, it's impossible to serve comments as you would with Wordpress or something similar: when a reader wants to post a comment, there's no database for it to go to. So the solution is to use a third-party tool to serve comments.

There are plenty of solutions out there that can be used. The most popular one, which is also the one I'm using for my blog, must probably be [Disqus](https://disqus.com/). It's usually a good option because it allows users to post using their favourite social network accounts, lets the same account post on multiple blogs, instead of having to create a new one per blog, and gives blog authors a good set of tools to moderate and manage inbound comments.

There are other platforms for blog comments, like Facebook's, Google's and more. You should really pick the one that you think makes more sense for the type of blog you're creating. So if you're building an awesome new hacker's blog, there probably won't be a big audience that prefers to use their personal Facebook accounts to engage in the discussions.

Because Disqus is usually seen as a good generic option and because that's what I experimented with when I built my blog, that's the one I'm showing how to use. If you want to use another, you might still benefit from some of the tips below.

To get started with Disqus go to [their website](https://disqus.com/), register and follow their instructions. You should be given a code snippet to paste into your blog. That code snippet should be asking for important information like your username, the post's identifier and the post's URL. This is a great example of code that we can put in its own include. So let's create a `_includes/disqus.html` and drop the code there, using the right tags to fill the requested information:

{% highlight html %}
<div id="disqus_thread"></div>
<script type="text/javascript">
    /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
    var disqus_shortname = 'your_disqus_shortname';
    var disqus_identifier = '{{"{{ page.url "}}}}';
    var disqus_url = '{{"{{ site.url "}}}}{{"{{ page.url "}}}}';

    /* * * DON'T EDIT BELOW THIS LINE * * */
    (function() {
        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
        dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();
</script>
{% endhighlight %}

**Please remember that, because this is a third-party tool, it might have changed since this post was written. Make sure that you get the most up-to-date code instead of just copying this example.**

Now that we have a new include, we just need to add it wherever we prefer. Because it's comments, it makes sense to add it to the blog post layout. So `_layouts/post.html` should be updated to:

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.title "}}}}</h2>
<p>{{"{{ page.date | date_to_string "}}}}</p>
{{"{{ content "}}}}

{{"{% include disqus.html "}}%}
{% endhighlight %}

That should be enough to have comments on your blog. Disqus will also give you moderator options through their website. Other providers should probably give you similar tools. If at some point you want to switch commenting providers, you can work on the new one's code on its own include while still keeping the old one, and when you're happy to do the switch you just need to change in the post layout the include to be used.

## What's next

After having improved our blog in this second tutorial, we should now have a structure like this:

{% highlight bash %}
_config.yml
_layouts
    default.html
    post.html
_includes
    disqus.html
    paginator.html
_posts
    2015-02-01-hello-world.md
    2015-03-01-my-second-post.md
    2015-04-01-aprils-fools-post.md
_site
index.html
{% endhighlight %}

In this second tutorial we covered some more material to get to an awesome hacker's blog. However, there's still a lot more that we can add, and it wouldn't fit in a single blog post. So there will be a third post where I'll try to cover RSS, categories, tags and some theming. If you think that there's something else worth mentioning, do shout.

Don't forget to [subscribe]({{ site.feed }}) to get the latest updates as soon as they're published. Alternatively, you can [follow me on Twitter](https://twitter.com/{{ site.twitter }}), where I plan to post the links to those updates. And, like I mentioned the last time, my blog's source code is open, so you can learn from it and get some ideas through its [Github project]({{ site.code_repo }}).
