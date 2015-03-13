---
layout: post
title: Setting up a hacker's blog with Jekyll
category: tutorial
tags:
 - Jekyll
 - Ruby
 - blogging
 - HTML
---

If you're looking for a blogging platform or framework to start sharing your thoughts with the rest of the world, there's no shortage of options to consider. My previous blog was a self-hosted Wordpress install, a pretty popular option, which [turned out to be a disaster for me]({% post_url 2015-01-11-a-postmortem-of-my-wordpress-blog %}). Other popular options include regular [Wordpress](https://wordpress.com/), [Medium](https://medium.com/) or even [Tumblr](https://www.tumblr.com/). However, if you want your blog to exercise your hacking skills, then [Jekyll](http://jekyllrb.com/) is the way to go.

Jekyll is a static websites and blogs generator that is run from the command line. What this means is that instead of setting up a database of posts, comments, etc. and a webapp that connects to that database to generate dynamic webpages, it simply generates all the necessary pages upfront. This means that you don't have to worry about databases, caching, running live server code, and so on: it's as simple and practical as it can get.

I wouldn't recommend it to anyone with no programming background, however. You're expected to deal with YAML files to change the website settings, HTML with Liquid tags to build the structure of every page, Ruby to develop or tweak any plugins and Markdown (or an alternative, like Textile or raw HTML) to write any post. Also, generating the website after every change (in design, structure, or simply after every new post) is done through the command line, and after that you still have to upload the generated files to your server.

However, for the enthusiastic developer, this means that you have full control over the entire process. It also means that dealing with your blog feels closer than ever to hacking one of your projects. You can, in fact, never leave your favourite text editor: even for regular blog posts, I get to do everything with vim.

Enough talk already. If I got your interest, let's get hacking. This is a Ruby tutorial, so I'm assuming that you have Ruby installed and are comfortable enough using it.

## Setting up Jekyll

Jekyll is a Ruby gem, so its installation is what you'd expect:

```
gem install jekyll
```

Now you have two options: you either ask Jekyll to build you a complete new site from its default template, or you just go ahead and build your own from scratch. For the former, you'd just need to type:

```
jekyll new yourwebsitename
```

After that, you'd have your brand new website in the newly created `yourwebsitename` directory. From that directory, you'd only need to type `jekyll serve` to generate the static files and be able to browse it.

However, that doesn't feel like hacking at all. So fire up your favourite text editor and get yourself a cup of coffee, because we're building it the fun way.

## Index

A typical Jekyll blog is structured into specific directories inside of the root project directory. So start by creating a directory for your new blog, where all the code will live.

All the generated static files will go to the directory `_site`. So if you create a new `index.html` in your project root and run `jekyll serve`, a `_site/index.html` will be created. While that Jekyll server is running, you can view that generated page at `localhost:4000`.

For our new blog's index, we'll want to iterate through our list of blog posts and show their title and excerpt:

{% highlight html %}
---
---

{{"{% for post in site.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}
{% endhighlight %}

The templating tags you can see are Liquid tags. You use `{{"{% text "}}%}` for logic like iterating a list (like ERB's `<% text %>`, and `{{"{{ text "}}}}` for text output (like ERB's `<%= text %>`). Another relevant remark about the code above is that you don't need to surround the excerpt with `<p>` tags: its output already includes them.

In this code we can see another important part of Jekyll: the front matter. It's the block defined by the triple dashes, and it holds any configuration, in YAML, that you might need in a page. Right now we're not needing anything, so we'll just leave it empty. We can't just remove it, because otherwise the Liquid tags won't get parsed by Jekyll (it would just be treated as a regular, static HTML file).

Trying to check the generated site with this code won't show anything interesting. That's because our blog still has no posts to display. Let's fix that.

## Posts

The blog posts must be stored in the `_posts` directory. Their filename should be their publication date followed by their intended URL identifier (slug). This ensures that you get your posts organised by date and you can immediatelly identify any of their files, while it also gives two important bits of information to Jekyll to use. So if you want to create your Hello World post, you would name it something like `_posts/2015-02-01-hello-world.md` (in this tutorial I'm assuming we're formatting our posts with Markdown). Here's how that file would look like:

{% highlight html %}
---
title: Hello World!
---

Welcome to my new **blog**!
{% endhighlight %}

This time we have a use for the front matter: for a blog post we need to define a title. It's not necessary to include the post publication date and slug, because Jekyll already gets them from the filename.

Browsing the generated site should now start to get more interesting. You should now be able to see your new post listed in the blog index and be able to navigate to its page.

However, everything still seems too simple and ugly. It's time to give our blog a proper look.

## Layouts

In Jekyll you theme your blog by providing a list of layouts. Those are stored in the `_layouts` directory. Let's start with a default layout `_layouts/default.html` to apply to all our existing pages:

{% highlight html %}
---
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>My blog</title>
  </head>
  <body>
    <div style="max-width: 800px; margin: 20px auto">
      <h1><a href="/">My blog</a></h1>

      {{"{{ content "}}}}

    </div>
  </body>
</html>
{% endhighlight %}

We now have a slightly better design and the blog title in every page, linking to the blog index. The contents of every page will be replacing that `{{"{{ content "}}}}`. And if you try to browse the generated site... you'll see that nothing changed and the layout isn't being used.

To make every page use this new layout, we have to specify it in their front matters. So your index will have to change into:

{% highlight html %}
---
layout: default
---

{{"{% for post in site.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}
{% endhighlight %}

And, likewise, the front matter of your post will also need to be updated:

{% highlight html %}
---
layout: default
title: Hello World!
---

Welcome to my new **blog**!
{% endhighlight %}

You should now be able to see the changes in the generated site. The design is still not great, but styling webpages is out of scope of this tutorial. Our blog post, however, still looks incomplete, without its title and publication date. We can fix that by introducing a new layout, just for blog posts. Fortunately, specific layouts can reuse more generic ones, to avoid duplicating a lot of code. Here's how a `_layouts/post.html` could look like:

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.title "}}}}</h2>
<p>{{"{{ page.date | date_to_string "}}}}</p>
{{"{{ content "}}}}
{% endhighlight %}

Notice that by setting a layout to a layout we avoid a lot of code repetition. Now if you change the layout in the post file from `default` into `post`, you should be able to see the post title and publication date in its page.

Also, you might have noticed the new `| date_to_string`. The `|` is used in Liquid to apply the filter specified on the right to the element on the left. So in this example we're applying the `date_to_string` filter to `post.date`, which converts the post publication date into a nicer to read string.

So now we have a blog index, posts and a theme. Things are starting to look better, and you're now in a position to start adding elements like a sidebar, Google Analytics, Disqus comments and anything else you want. So now let's finish with some cleanup, to help with future improvements.

## Configurations

In our defaut layout we're hardcoding the name of our blog twice. If we want to add elements like an RSS feed, semantic annotations or others, chances are we're going to have to hardcode it again. The same applies for other information like blog author, description and social media links.

Fortunately, there is a place to store all this information: the configurations file, which acts like the ultimate front matter of the whole site. So create the `_config.yml` file in the project root:

{% highlight html %}
name: My blog
author: Ricardo Lopes
twitter: ricardoplopes
{% endhighlight %}

Now we can access any of these variables through the `site` object. We can now change the default layout to something more interesting (and maintainable):

{% highlight html %}
---
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{"{{ site.name "}}}}</title>
  </head>
  <body>
    <div style="max-width: 800px; margin: 20px auto">
      <h1><a href="/">{{"{{ site.name "}}}}</a></h1>

      {{"{{ content "}}}}

      <hr>
      © {{"{{ site.time | date: '%Y' "}}}} {{"{{ site.author "}}}}.
      <a href="https://twitter.com/{{"{{ site.twitter "}}}}">Follow me on Twitter</a>
    </div>
  </body>
</html>
{% endhighlight %}

## What's next

So far we've only really scratched the surface on what Jekyll can do for our blog. The current structure should be something like:

{% highlight bash %}
_config.yml
_layouts
    default.html
    post.html
_posts
    2015-02-01-hello-world.md
_site
_index.html
{% endhighlight %}

However, there's a lot more hacking that can be done. Some examples are building an RSS feed, paginating the index page, getting better URLs, better theming and adding categories and tags. Also, although you can go ahead and upload the generated files to your personal server to get your blog online, it's still worth to discuss some alternatives to ease that process.

Unfortunately, it all starts to be too much for a single blog post. So expect to see all those examples explained in future tutorials, and don't forget to [subscribe]({{ site.feed }}) to get them as soon as they're published. In the meantime, my blog's source code is open, so you can learn from it and get some ideas through its [Github project]({{ site.code_repo }}).

**Update:** [Part 2]({% post_url 2015-03-13-setting-up-a-hackers-blog-with-jekyll-part-2 %}) now available.
