---
layout: post
title: Setting up a hacker's blog with Jekyll, part 3
category: tutorial
tags:
 - Jekyll
 - Ruby
 - blogging
 - RSS
 - SASS
 - HTML
---

This is the last part of my small series of tutorials about building your own blog with Jekyll, no autogenerated code included. You can read the previous posts, [part 1]({% post_url 2015-02-01-setting-up-a-hackers-blog-with-jekyll %}) and [part 2]({% post_url 2015-03-13-setting-up-a-hackers-blog-with-jekyll-part-2 %}). In this last tutorial we'll be working with the same blog example code as in the previous ones. However, if you're just looking for a particular solution to a problem you might be facing, these examples should be self-contained enough to help.

Just to recap from the previous tutorials: we're using the gem [Jekyll](http://jekyllrb.com/) to generate our blog's static pages. We do that by running `jekyll serve`, which also allows us to test it in our browser locally. Our blog code structure is currently looking like this:

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

And now let's improve it.

## RSS feed

What's a blog without an RSS feed to let readers subscribe to it? To get one, you need an XML file complying with the RSS spec, and then a link to that file from your default layout, so that it's available for every page of your blog. Let's start with the XML file. You can simply create a `feed.xml` in your project root, like you have for `index.html`. Let's fill it with the blog's latest posts:

{% highlight xml %}
---
---

<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{"{{ site.name | xml_escape "}}}}</title>
    <description>{{"{{ site.description | xml_escape "}}}}</description>
    <link>{{"{{ site.url "}}}}</link>
    <atom:link href="{{"{{ site.url "}}}}/feed.xml" rel="self" type="application/rss+xml" />
    {{"{% for post in site.posts limit:10 "}}%}
      <item>
        <title>{{"{{ post.title | xml_escape "}}}}</title>
        <description>{{"{{ post.content | xml_escape "}}}}</description>
        <pubDate>{{"{{ post.date | date_to_rfc822 "}}}}</pubDate>
        <link>{{"{{ site.url "}}}}{{"{{ post.url "}}}}</link>
        <guid isPermaLink="true">{{"{{ site.url "}}}}{{"{{ post.url "}}}}</guid>
      </item>
    {{"{% endfor "}}%}
  </channel>
</rss>
{% endhighlight %}

This code fetches relevant information from `site.name`, `site.description`, `site.url` and `site.posts`. That last one we already used in the first tutorial for building the initial index page, so should be no surprise. The other ones are values we can define in `_config.yml`. We've previously set the value of `name`. Now we can add `description` and `url` as well:

{% highlight html %}
name: My blog
description: This is my new blog
url: http://www.example.com

author: Ricardo Lopes
twitter: ricardoplopes

permalink: "/:title"

paginate: 2
paginate_path: "/:num"
{% endhighlight %}

Now, Jekyll should have generated a `_site/feed.xml` file that includes the blog's posts. The last thing we need to do is including the feed in the blog pages. We can do that in `_layouts/default.html`, so that all pages include it, by placing the relevant line inside the `<head>` element:

{% highlight html %}
---
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{"{{ site.name "}}}}</title>
    <link rel="alternate" type="application/rss+xml" title="{{"{{ site.title "}}}}" href="{{"{{ site.url "}}}}/feed.xml">
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

And that's all you need to do to set up a feed so that your readers can start subscribing to your blog.

And now for something completely different: styling.

## Styling with SASS

Given the choice between something terrible and an improvement, you'd probably go for the improvement. So our blog's style will be in SASS instead of plain CSS. Those files will live in the new `_sass` directory of our project (didn't see that one coming). For every `jekyll serve`, the SASS files will be compiled and the necessary CSS will be generated in the `_site` directory, like the rest of the generated static pages.

Let's start this exercise with a simple refactor. Just by looking at the last code example, we can see some ugly inline CSS in an HTML file. That's not what any serious codebase should look like. Let's separate those styles into their own styling file (like `_sass/style.scss`) and leave the HTML alone:

{% highlight scss %}
#body {
  max-width: 800px;
  margin: 20px auto;
}
{% endhighlight %}

We're applying those rules to a DOM element with id `body`. So now, in `_layouts/default.html`, we can replace:

{% highlight html %}
<div style="max-width: 800px; margin: 20px auto">
{% endhighlight %}

with:

{% highlight html %}
<div id="body">
{% endhighlight %}

Great, so now if you check the newly generated pages... you'll see that we've just broken the previous style. That's because we still need to include the generated CSS file, `css/main.css`, in the layout. The final code should now look like this:

{% highlight html %}
---
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{"{{ site.name "}}}}</title>
    <link rel="stylesheet" href="/css/main.css" type="text/css">
    <link rel="alternate" type="application/rss+xml" title="{{"{{ site.title "}}}}" href="{{"{{ site.url "}}}}/feed.xml">
  </head>
  <body>
    <div id="body">
      <h1><a href="/">{{"{{ site.name "}}}}</a></h1>

      {{"{{ content "}}}}

      <hr>
      © {{"{{ site.time | date: '%Y' "}}}} {{"{{ site.author "}}}}.
      <a href="https://twitter.com/{{"{{ site.twitter "}}}}">Follow me on Twitter</a>
    </div>
  </body>
</html>
{% endhighlight %}

Now we should get our old style back.

Because SASS augments CSS in some interesting ways, we can explore new things in our new styles file:

{% highlight scss %}
$body-width: 800px;
$phone-max-width: 570px;

$desktop-vertical-margins: 20px;
$phone-vertical-margins: 10px;

$main-color: #F91111;
$text-color: #564A4A;

@mixin on-phone {
  @media screen and (max-width: $phone-max-width) {
    @content;
  }
}

#body {
  max-width: $body-width;
  color: $text-color;
  margin: $desktop-vertical-margins auto;
  @include on-phone {
    margin: $phone-vertical-margins auto;
  }
}

a {
  color: $main-color;
  text-decoration: none;

  &:hover {
    color: lighten($color-main, 15%);
    text-decoration: underline;
  }
}
{% endhighlight %}

Some things this code does, if you're not too familiar with SASS:

 - Nesting: if we're styling links and want to ad additional styles to its `hover` status, we only need to define `&:hover` inside `a`, instead of having a separate `a:hover`. Great for avoiding scattering things all over the place;
 - Saving commonly used values like colours into variables that can be used in CSS properties. Great for DRY;
 - Using mixins to define different styles for different situations, like setting a smaller margin for smartphones. Also great for DRY.

Studying the things we can do with SASS is out of scope of this tutorial, so if you want to know more, I encourage you to explore the great tutorials that can be found online.

## Categories

Now that the blog is looking more complete, we want to be able to categorise posts. Every post starts with a front matter that configures, in YAML, the post's metadata. So if we want to add a category to a post, we just need to define it like this:

{% highlight html %}
---
title: Hello World!
category: unrelated
---

Welcome to my new **blog**!
{% endhighlight %}

And now we can change `index.html` to include the post category:

{% highlight html %}
---
layout: default
---

{{"{% for post in paginator.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{% if post.category "}}%}<p>Category: {{"{{ post.category "}}}}</p>{{"{% endif "}}%}
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}

{{"{% include paginator.html "}}%}
{% endhighlight %}

And we can also change `_layouts/post.html` to do the same change:

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.title "}}}}</h2>
<p>
  {{"{{ page.date | date_to_string "}}}}
  {{"{% if post.category "}}%} | Category: {{"{{ post.category "}}}}{{"{% endif "}}%}
</p>
{{"{{ content "}}}}

{{"{% include disqus.html "}}%}
{% endhighlight %}

Great. Now we want categories to link to their own pages, where we can see the list of all the posts with that category. Unfortunately, Jekyll doesn't support that. Fortunately, it lets us build our own custom plugins, so we will do just that to solve our problem.

Plugins in Jekyll can be Generators, Converters, Commands and Tags. You can check the [documentation](http://jekyllrb.com/docs/plugins/) for more details on each type of plugin. We'll build a generator that will, unsurprisingly, generate new pages for the blog's categories. That generator will use a new layout, similar to our existing `index.html`, but showing only the posts for that category, and including the category name as a page title. Let's then create a `_layouts/category_index.html` with the following code:

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.category "}}}}</h2>

{{"{% for post in site.posts "}}%}
  {{"{% if post.category == page.category "}}%}
    <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
    {{"{{ post.excerpt "}}}}
  {{"{% endif "}}%}
{{"{% endfor "}}%}
{% endhighlight %}

We can now start developing the plugin. It will go into the new `_plugins` directory. Let's call it `_plugins/categories.rb`. Its classes will live inside the `Jekyll` module. The first step will be to define the category index page for the generator to use:

{% highlight ruby %}
module Jekyll
  class CategoryIndex < Page
    def initialize(site, category)
      @site = site
      @base = site.source
      @dir = File.join('categories', Utils.slugify(category))
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'category_index.html')
      self.data['category'] = category
    end
  end
end
{% endhighlight %}

If you've noticed the new `page.category` in the `_layouts/category_index.html` code, you can now see that it comes from this `CategoryIndex`, from this line: `self.data['category'] = category`. We can now add the generator that will create a new `CategoryIndex` for every category of the blog and save it as a blog page:

{% highlight ruby %}
module Jekyll
  class CategoryIndex < Page
    def initialize(site, category)
      @site = site
      @base = site.source
      @dir = File.join('categories', Utils.slugify(category))
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'category_index.html')
      self.data['category'] = category
    end
  end

  class CategoryGenerator < Generator
    safe true
    def generate(site)
      if site.layouts.key? 'category_index'
        site.categories.keys.each do |category|
          write_category_index(site, category)
        end
      end
    end

    def write_category_index(site, category)
      index = CategoryIndex.new(site, category)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end
{% endhighlight %}

We now finally have category pages. So we can update `index.html` and `_layouts/post.html` to link to them:

{% highlight html %}
---
layout: default
---

{{"{% for post in paginator.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{% if post.category "}}%}<p>Category: <a href="/categories/{{"{{ post.category | slugify "}}}}">{{"{{ post.category "}}}}</a></p>{{"{% endif "}}%}
  {{"{{ post.excerpt "}}}}
{{"{% endfor "}}%}

{{"{% include paginator.html "}}%}
{% endhighlight %}

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.title "}}}}</h2>
<p>
  {{"{{ page.date | date_to_string "}}}}
  {{"{% if page.category "}}%} | Category: <a href="/categories/{{"{{ page.category | slugify "}}}}">{{"{{ page.category "}}}}</a>{{"{% endif "}}%}
</p>
{{"{{ content "}}}}

{{"{% include disqus.html "}}%}
{% endhighlight %}

And now we finally have categories fully working. Please beware that if you're using Github Pages to host your blog, it blocks most plugins (including all custom ones) from running. So if you're using it, you should make sure that you've generated the `_site` directory (that way it doesn't matter that it doesn't run your plugins, because the static pages have already been generated).

## Tags

One more thing: post tags. These are very similar to categories: you can just define them in the post's front matter, but there's no Jekyll support for individual tag pages, so we must create our own. Fortunately, because it's so similar to categories, we can draw inspiration from the previous section.

First, we'll add a list of tags to our posts:

{% highlight html %}
---
title: Hello World!
category: unrelated
tags:
 - hello world
 - blog
---

Welcome to my new **blog**!
{% endhighlight %}

Now we can create the layout for the tag individual pages, where we'll show a list of posts with that tag. Let's call it `_layout/tag_index.html`:

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.tag "}}}}</h2>

{{"{% for post in site.posts "}}%}
  {{"{% for tag in post.tags "}}%}
    {{"{% if tag == page.tag "}}%}
      <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
      {{"{{ post.excerpt "}}}}
    {{"{% endif "}}%}
  {{"{% endfor "}}%}
{{"{% endfor "}}%}
{% endhighlight %}

We can now adapt the code in `_plugins/categories.rb` to generate these tag index pages and their generator, and save it in the new `_plugins/tags.rb`:

{% highlight ruby %}
module Jekyll
  class TagIndex < Page
    def initialize(site, tag)
      @site = site
      @base = site.source
      @dir = File.join('tags', Utils.slugify(tag))
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'tag_index.html')
      self.data['tag'] = tag
    end
  end

  class TagGenerator < Generator
    safe true
    def generate(site)
      if site.layouts.key? 'tag_index'
        site.tags.keys.each do |tag|
          write_tag_index(site, tag)
        end
      end
    end

    def write_tag_index(site, tag)
      index = TagIndex.new(site, tag)
      index.render(site.layouts, site.site_payload)
      index.write(site.dest)
      site.pages << index
    end
  end
end
{% endhighlight %}

And finally we add the list of post tags to `index.html` and `_layouts/post.html`:

{% highlight html %}
---
layout: default
---

{{"{% for post in paginator.posts "}}%}
  <h2><a href="{{"{{ post.url "}}}}">{{"{{ post.title "}}}}</a></h2>
  {{"{% if post.category "}}%}<p>Category: <a href="/categories/{{"{{ post.category | slugify "}}}}">{{"{{ post.category "}}}}</a></p>{{"{% endif "}}%}
  {{"{{ post.excerpt "}}}}
  <p>Post tags:</p>
  <ul>
    {{"{% for tag in post.tags "}}%}
      <li><a href="/tags/{{"{{ tag | slugify "}}}}">{{"{{ tag "}}}}</a></li>
    {{"{% endfor "}}%}
  </ul>
{{"{% endfor "}}%}

{{"{% include paginator.html "}}%}
{% endhighlight %}

{% highlight html %}
---
layout: default
---

<h2>{{"{{ page.title "}}}}</h2>
<p>
  {{"{{ page.date | date_to_string "}}}}
  {{"{% if page.category "}}%} | Category: <a href="/categories/{{"{{ page.category | slugify "}}}}">{{"{{ page.category "}}}}</a>{{"{% endif "}}%}
</p>
{{"{{ content "}}}}
<p>Post tags:</p>
<ul>
  {{"{% for tag in page.tags "}}%}
    <li><a href="/tags/{{"{{ tag | slugify "}}}}">{{"{{ tag "}}}}</a></li>
  {{"{% endfor "}}%}
</ul>

{{"{% include disqus.html "}}%}
{% endhighlight %}

And we also have tags working. Last section's warning is still relevant for this: if you're using Github Pages to host your blog, make sure you upload the generated `_site` directory, otherwise this plugin won't work, because of their plugin restrictions.


## Summary

After having improved our blog in this last tutorial, we should now have a structure like this:

{% highlight bash %}
_config.yml
_layouts
    category_index.html
    default.html
    post.html
    tag_index.html
_includes
    disqus.html
    paginator.html
_plugins
    categories.rb
    tags.rb
_posts
    2015-02-01-hello-world.md
    2015-03-01-my-second-post.md
    2015-04-01-aprils-fools-post.md
_saas
    style.scss
_site
index.html
feed.html
{% endhighlight %}

We now have a fully functional blog with categories, tags, proper styling, a feed to subscribe to and all the other features shown in the previous parts of this tutorial, like comments and pagination. There is, of course, a lot more that we can do. If you've followed through, I'd recommend you to take a look at the official documentation, where you can find more detailed information about each thing. You can also take a look at my own blog's [source code]({{ site.code_repo }}), which is open source and available on Github.