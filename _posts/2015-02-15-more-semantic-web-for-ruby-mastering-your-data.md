---
layout: post
title: "More Semantic Web for Ruby: mastering your data"
category: tutorial
tags:
 - Semantic Web
 - Ruby
 - Ruby on Rails
excerpt: In a [previous post]({% post_url 2015-02-08-developing-for-the-semantic-web-with-ruby-on-rails-the-2012-guide %}) I shared some important tips and resources for anyone who plans on developing for the Semantic Web in Ruby (like in a Ruby on Rails webapp). If you haven’t checked it yet, I strongly recommend you to do so. This new post goes a step further and shows you how to convert data from the Semantic Web to your app’s data model and also the other way around.
---

_**Disclaimer:** This blog post was first published on the 14th of October of 2013. This means that most of its content might no longer be up-to-date. This was published in my previous blog, which has [met an unfortunate end]({% post_url 2015-01-11-a-postmortem-of-my-wordpress-blog %}), and is being reposted now as an attempt to resurface some of the most popular posts that have been lost._

In a [previous post]({% post_url 2015-02-08-developing-for-the-semantic-web-with-ruby-on-rails-the-2012-guide %}) I shared some important tips and resources for anyone who plans on developing for the Semantic Web in Ruby (like in a Ruby on Rails webapp). If you haven’t checked it yet, I strongly recommend you to do so. This new post goes a step further and shows you how to convert data from the Semantic Web to your app’s data model and also the other way around.

To get our mappings between the Semantic Web data and our app’s data model we need some Ruby gems. The gem [rdf](https://rubygems.org/gems/rdf) lets us parse and work with RDF data in Ruby. The gem [linkeddata](https://rubygems.org/gems/linkeddata)  gives us additional resources for working with the semantic web and the Linked Data. Finally, I will also use the gem [rdf-turtle](https://rubygems.org/gems/rdf-turtle) because I find the Turtle notation to be clearer than the RDF/XML notation, so this gem helps us parse this alternative notation (if you won’t use Turtle, you’ll be just fine without this gem).

## Importing RDF data to Ruby

As we’ve seen in the previous tutorial, creating a semantic graph in Ruby for describing RDF data is as easy as doing:

{% highlight ruby %}
graph = RDF::Graph.new
{% endhighlight %}

Now we want to create a semantic graph based on the data of an existing RDF file. To do that, we need to change it to:

{% highlight ruby %}
graph = RDF::Graph.load(path_of_rdf_file)
{% endhighlight %}

We can now query that graph to import its data to our Ruby application. The rdf gem is powerful enough to allow querying that graph using pure Ruby code (no SPARQL needed).

Let’s imagine we’re developing a blog and we’re importing RDF data about posts and their authors. We have the models `Post` and `Author` in our application. The RDF ontology that the data on that file is using is called `MyBlog` and has the class `Post` (for the authors, it reuses the class `Person` from the well-known ontology [FOAF](http://www.foaf-project.org)). That ontology has also the properties `hasTitle` (that links a `MyBlog:Post` to a string of its title) and `hasAuthor` (that links a `MyBlog:Post` to a `FOAF:Person`).

Here is an example of how we could query the graph to find all posts:

{% highlight ruby %}
include RDF
MyBlog = RDF::Vocabulary.new("http://ricardolopes.net/myblog.owl#")

# Load the RDF file to a semantic graph
graph = RDF::Graph.load(path_of_rdf_file)

# To get all the posts, we need a SPARQL-like query, but using hashes
query_posts = RDF::Query.new({
  :post => {
    RDF.type => MyBlog.Post,
    MyBlog.hasTitle => :title,
    MyBlog.hasAuthor => :author
  }
})

# Build an array of results of that query
results = query_posts.execute(graph)
{% endhighlight %}

Now we have an array called `results` that holds all instances of objects with `RDF:type` `MyBlog:Post`. To import the relevant data, we should now iterate through these results and create a new `Post` for each. Here is an example of how to do that and fetch each post’s title:

{% highlight ruby %}
results.each do |result_post|
  post = Post.new
  post.title = result_post.title
  post.save
end
{% endhighlight %}

We can fetch the title of the post using `result_post.title` because in the query that originated those results we asked to store the value of the property `MyBlog:hasTitle` in a variable called `title`. Remember that the value of `MyBlog:hasTitle` is a string with the title of the post, so we can save its value directly in our Ruby class.

To fetch each post’s author we need to do an extra step. Unlike `MyBlog:hasTitle`, the `MyBlog:hasAuthor` property doesn’t hold a string: it holds a reference to an individual of the class `FOAF:Person`. For our application we want to store the author’s name and URI. To get the string with the name of a `FOAF:Person` we need to query its property `FOAF:name`. To get the string with their URI we use the reference of the individual. Here is an example of how we could modify the last piece of code to add the author’s name and URI to the post:

{% highlight ruby %}
results.each do |result_post|
  post = Post.new
  post.title = result_post.title

  # New query, this time to get the post's author
  query_author = RDF::Query.new({
    :author => {
      RDF.type => FOAF.Person,
      FOAF.name => :name
    }
  })

  # Get the authors and fetch the one from this post
  query_author.execute(graph).each do |result_author|
    # If it's the same reference, we found it!
    if result_author.author == result_post.author
      post.author_name = result_author.name
      post.author_uri = result_author.author
    end
  end

  post.save
end
{% endhighlight %}

As we can see, this second query looks like it’s cluttering the code. This could be avoided if the original query (`query_posts`) was already expecting it. So one way to greatly simplify this code would be to change `query_posts` to the following:

{% highlight ruby %}
query_posts = RDF::Query.new({
  :post => {
    RDF.type => MyBlog.Post,
    MyBlog.hasTitle => :title,
    MyBlog.hasAuthor => :author
  },
  :author => {
    FOAF:name => :name
  }
})
{% endhighlight %}

This would fetch not only the full list of posts, but also the author (and their name) of that post, because its identifier is the same as the identifier of the value of `MyBlog:hasAuthor` (`:author`). However, if an author didn’t have a `FOAF:name`, we wouldn’t get any information of that post, because that query expects results in all the variables we’re querying. In addition, if we wanted to fetch more information about the post (its creation date, its category, etc.), we should only include it in the initial query if it’s always present, because otherwise, since there’s a variable in the query with no value, the posts that don’t have that value won’t be fetched. So the solution to fetch that additional information only if it’s available is to do a second query (so even if that second query fails for posts without that value, the first query still succeeds and at least we got the essential information of the post).

So unfortunately there might be situations where we do need to do further queries that make the overall code look uglier. However, there are always ways of trying to mitigate that problem as much as possible. One way is to create a separate method for these second queries, so to get the author’s name you only had to do:

{% highlight ruby %}
results.each do |result_post|
  post = Post.new
  post.title = result_post.title
  post.author_name = query(graph, result_post.author, FOAF.name)
  post.save
end

# And the method would look like:
def query(graph, element, property)
  new_query = RDF::Query.new({
    :element => {
      property => :property
    }
  })
  new_query.execute(graph).each do |result|
    return s.property.to_s if element == result.element
  end
end
{% endhighlight %}

That method expects to return a string. It might need some adjustments for other tasks, like returning the URI of the element.

With this information, it is now possible to fetch all the information we need from an RDF file to the Ruby application’s data model. Now we look at the exact opposite: exporting our application’s data into an RDF file.

## Exporting relational data from Ruby to semantic data in RDF

In the previous tutorial, in section “Putting the Semantic Web in Ruby on Rails”, we already saw how to create a semantic graph in Ruby, populate it with RDF classes and properties, and export it to a file. Now, we’re using the application’s data model to automatically export the application data.

Lets use the same blog example for the export process. The first thing we need to do is get everything ready:

{% highlight ruby %}
graph = RDF::Graph.new
FOAF = RDF::FOAF # This vocabulary is known by the gem
MyBlog = RDF::Vocabulary.new("http://ricardolopes.net/myblog.owl#")
data = RDF::Vocabulary.new("http://example.com/myblogdata#")
{% endhighlight %}

`MyBlog` represents the ontology we’ve been using. `data` represents the namespace of this blog application (one of the many that would be using the `MyBlog` ontology). We can now iterate through all the blog’s posts and save them to the semantic graph:

{% highlight ruby %}
Post.each do |post|
  uri = generate_unique_uri(post)
  graph << [data[uri], RDF.type, MyBlog.Post]
end
{% endhighlight %}

In the code snippet above we first fetch a unique URI for the blog post, because every object in RDF must have an identifying URI. We could implement a method to generate such URI based on some rules (an auto-incremented integer, truncating its title, etc.), or we could avoid that step if we saved its URI when we were importing the RDF data. However, if your application is intended to make it easier for users to manage semantic data, chances are not all the exported objects were previously imported.

After generating the identifying URI, we use it to add the post to the semantic graph. `data[uri]` joins the application's namespace (defined in the snippet of code before this last one) with the generated URI (so if a post got an URI `my-first-post`, it would result in `http://example.com/myblogdata#my-first-post`). `RDF.type` and `MyOnt.Post` return the property `type` of the ontology `RDF` and the class `Post` of the ontology `MyBlog`, respectively. These three elements together are the equivalent of the following triple:

{% highlight erb %}
<http://example.com/myblogdata#my-first-post>
<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>
<http://ricardolopes.net/myblog.owl#Post> .
{% endhighlight %}

This means that we are adding to the semantic graph a triple that states that the blog post identified by `my-first-post` is of type `MyBlog:Post`. We could extend the previous code to include the remaining information of the post:

{% highlight ruby %}
Post.each do |post|
  uri = generate_unique_uri(post)
  graph << [data[uri], RDF.type, MyBlog.Post]
  graph << [data[uri], MyBlog.hasTitle, post.title]
end
{% endhighlight %}

Finally, we also want to add the author information. Since the author is another RDF object, we need to create it and link it to the post:

{% highlight ruby %}
created_authors = []
Post.each do |post|
  uri = generate_unique_uri(post)
  graph << [data[uri], RDF.type, MyBlog.Post]
  graph << [data[uri], MyBlog.hasTitle, post.title]

  # Only add new author element if it hasn't been added before
  if not created_authors.index(post.author_uri)
    graph << [data[post.author_uri], RDF.type, FOAF.Person]
    graph << [data[post.author_uri], FOAF.name, post.author_name]
    created_authors << post.author_uri
  end

  # Link the post to its author
  graph << [data[uri], MyBlog.hasAuthor, data[post.author_uri]]
end
{% endhighlight %}

Now we should have all the information we want in our semantic graph. The last step is to export it into an external file. This is something that we also dealt with in the previous tutorial, so now let's try to do it using the Turtle notation, to generate files that are easier to read by humans:

{% highlight ruby %}
PREFIXES = {
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  owl: 'http://www.w3.org/2002/07/owl#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  myblog: 'http://ricardolopes.net/myblog.owl#',
  data: 'http://example.com/myblogdata#'
}
RDF::Writer.for(:ttl).buffer do |writer|
  writer.prefixes = PREFIXES
  graph.each_statement do |statement|
    writer << statement
  end
end
{% endhighlight %}

The `PREFIXES` array is optional, but it's a nice to have addition to make the resulting file easier to read. If you are using other ontologies, it's better to add them to that array, as well. Then, we use an `RDF::Writer` to write all statements of our semantic graph into a file using Turtle (`:ttl`) notation. This is where the gem rdf-turtle comes in handy, so if you're exporting to a different RDF notation, you probably won't need it.

## To sum up

As with my previous tutorial, this one is also not intended to be a step-by-step manual that gives you a working demo by the end of it. Instead, this tutorial is meant to be a helper for everybody that is struggling with the integration of the Semantic Web and Ruby, and a complement to the previous tutorial. More specifically, it is intended to demonstrate how to import and export semantic data into/from a Ruby application that relies on a relational data model.

As I've concluded in early 2012, Ruby tools for development with the Semantic Web are still not as good as tools that we can find for other languages, such as Java. Still, it's good to see that it is in fact possible to import and export data seamlessly using pure Ruby, so if this is the main Semantic Web related feature your application is supposed to have, the good news is that it shouldn't be too hard to develop it in Ruby on Rails, Sinatra or any other Ruby framework.
