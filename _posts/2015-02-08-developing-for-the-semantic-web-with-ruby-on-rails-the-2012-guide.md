---
layout: post
title: Developing for the Semantic Web with Ruby on Rails, the 2012 guide
category: tutorial
tags:
 - Semantic Web
 - Ruby
 - Ruby on Rails
excerpt: The Semantic Web, an Internet of of connected knowledge, meaningful data and machine-readable information, is seen as many as the future of the Internet. Envisioned by Tim Berners-Lee, its purpose is to transition from a web of unstructured documents into a “web of data”, in which we could browse and search for data not only based on syntactic  keywords, but also based on semantic meaning. However, it’s awkward to realise that most of the work around the Semantic Web is done in Java, and many technologies with great future potential, such as Ruby on Rails, are seemingly forgotten.
---

_**Disclaimer:** This blog post was first published on the 30th of January of 2012. This means that most of its content might no longer be up-to-date. This was published in my previous blog, which has [met an unfortunate end]({% post_url 2015-01-11-a-postmortem-of-my-wordpress-blog %}), and is being reposted now as an attempt to resurface some of the most popular posts that have been lost._

The Semantic Web, an Internet of of connected knowledge, meaningful data and machine-readable information, is seen as many as the future of the Internet. Envisioned by Tim Berners-Lee, its purpose is to transition from a web of unstructured documents into a “web of data”, in which we could browse and search for data not only based on syntactic  keywords, but also based on semantic meaning. However, it’s awkward to realise that most of the work around the Semantic Web is done in Java, and many technologies with great future potential, such as Ruby on Rails, are seemingly forgotten.

Having developed a Semantic Web project using that Ruby framework, I found very scattered information and tiny bits of contributions, many already obsolete. It’s almost shocking to see so few and old information around such a modern framework with such a vibrant and participating community developing for it. As such, having collected many of those bits of information, I believe it’s time to put them together and finally create an updated guide to the development for the Semantic Web with Ruby on Rails.

Disclaimer: This is not a step-by-step tutorial, so don’t expect to know how to develop a Semantic Web application in Ruby on Rails as soon as you finish reading this. The main goal of this article is to save hours of research and show the best and updated tools available. Also, the code examples aren’t necessarily complete or 100% correct, as their goal is to explain something, and not simply being copy+pasted to a tutorial application.

## Building the ontology and fetching relevant data

If you’re going to develop a website using the concept of the Semantic Web, one of the first things you’ll need is an ontology. You may find many useful ontologies capable of describing the data your web application is going to use (the [Swoogle](http://swoogle.umbc.edu/) project might be a good place to start your search), but you might as well have to develop your own. If you’re building your own ontology, I recommend using [Protégé](http://protege.stanford.edu/) for it.

The development of the ontology is out of the scope of this article, as it has no relation to the platform used to develop the web application itself, so if you don’t know how to start I’d recommend reading some simpler guides first (here’s a short [collection](http://protege.stanford.edu/publications/ontology_development/ontology101.pdf) [of](http://www.w3.org/TR/rdf-primer/) [links](http://www.w3.org/RDF/FAQ) [that](http://webcache.googleusercontent.com/search?q=cache:5-Tx99Kz6aEJ:pubs.cs.uct.ac.za/archive/00000257/01/technical_report.pdf) [might](http://www.slideshare.net/fadirra/semantic-web-intro-040411) help you with that).

After you have the right ontology to power your web application, it’s time to to fetch the data. Unless you’re aiming for a very limited and controled set of elements, you’ll probably want to develop a screen scraper or use an external API. Using the Ruby gem [Nokogiri](http://nokogiri.org/), you can easily browse and fetch the information you want from any useful website. Here is a simple example of a screen scraper for your application:

{% highlight ruby %}
items = []
doc = Nokogiri::HTML(open(website_url))

doc.css(".item").each do |item|
  link = item.at_css(".info h4 a")[:href]
  item_doc = Nokogiri::HTML(open(link))

  name = item_doc.at_css("h2#title a").content.to_s
  description = item_doc.at_css("p.description").content.to_s

  items << ["name" => name, "description" => description]
end

return items
{% endhighlight %}

As you see, this little example simply iterates through all the elements of the website of the class `item`, browses to their specific page and then extracts the name and description. This technique may have its flaws, like being vulnerable to major website redesigns, but it’s also a very simple and rapid way of extracting large quantities of information.

Ideally, you’ll want to save your new information in XML files or in a database, so you can use them later without having to run the fetcher again. This, of course, is just a temporary location, ready to change as soon as the Semantic Web enters the game.

## Putting the Semantic Web in Ruby on Rails

It’s easy enough to develop for the Semantic Web in Java, as you can easily find a large set of tools to help you in every stage of the development. In Ruby it’s not that easy at all. After some research you’ll probably come across two Ruby gems that handle the semantic graph: [ActiveRDF](http://activerdf.org/) and [RDF.rb](https://rubygems.org/gems/rdf). However, ActiveRDF is now outdated and it doesn’t seem to work as it should in Rails 3. So RDF.rb it is, then.

Now that we have the tool to manage the semantic data, we should save our raw data in a semantic graph. We’ll use the N-Triples format for that. First you’ll need to define all the semantic relations of your data:

{% highlight ruby %}
include RDF

MyOnt = RDF::Vocabulary.new("http://ricardolopes.net/myont.owl#")
graph = RDF::Graph.new

items.each do |item|
  graph << [item["uri"], RDF.type, MyOnt.Item]
  graph << [item["uri"], MyOnt.hasName, item["name"]]
end

return graph
{% endhighlight %}

This example assumes that you have an ontology with the URI `http://ricardolopes.net/myont.owl`, which has at least a class `Item` and a property `hasName`. This example, as all others in this guide, is far from complete, as it is just used for quick demonstrations. One thing it doesn’t show is how to create the unique URI for each item. That is up to you to decide, as every project is different. However, when you have a unique identifier for every item, you probably should do something like `item["uri"] = MyOnt[unique_identifier]`. Beware, though, that if you use `MyOnt` to store individuals, you’ll no longer have an empty ontology serving only as a schema. You’ll probably find it more useful to use an URI for the ontology schema and another for the individuals (`MyOnt` and `Data`, for instance).

After that step, you’ll then need to store the information of the semantic graph you created in an N-Triples file:

{% highlight ruby %}
RDF::Writer.open("data/graph.nt") do |writer|
  graph.each_statement do |stmt|
    writer << stmt
  end
end
{% endhighlight %}

This is it. you should now have a complete N-Triples file with all your semantic information. Now that you have the semantic data, you may start using its full potential.

## Querying the graph

If you’re not new to the Semantic Web development you’re probably used to SPARQL when it comes to querying for information. In Ruby on Rails you’ll find it possible to do such queries using pure Ruby, thanks to the RDF.rb gem. Imagine you have the following information:

{% highlight erb %}
<http://ricardolopes.net/data/2011/01/10/ricardolopes>
<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>
<http://ricardolopes.net/myont.owl#Developer> .

<http://ricardolopes.net/data/2011/01/10/ricardolopes>
<http://ricardolopes.net/myont.owl#hasName>
"Ricardo Lopes" .

<http://ricardolopes.net/data/2012/01/30/semanticwebarticle>
<http://www.w3.org/1999/02/22-rdf-syntax-ns#type>
<http://ricardolopes.net/myont.owl#Article> .

<http://ricardolopes.net/data/2012/01/30/semanticwebarticle>
<http://ricardolopes.net/myont.owl#hasName>
"Semantic Web article" .

<http://ricardolopes.net/data/2011/01/10/ricardolopes>
<http://ricardolopes.net/myont.owl#isAuthorOf>
<http://ricardolopes.net/data/2011/01/30/semanticwebarticle> .
{% endhighlight %}

This means that we have an individual of the class `Developer` that has the name “Ricardo Lopes”, and an individual of the class `Article` that has the name “Semantic Web article”. We also have a relation that states that the `Developer` “Ricardo Lopes” is the author of the `Article` “Semantic Web article”.

Imagine now that you’re showing the article “Semantic Web article” and want to show the name of its author. Using the RDF.rb gem, you could do it simply using Ruby:

{% highlight ruby %}
article_name = "Semantic Web article"

graph.query([nil, MyOnt.hasName, article_name]) do |stmt1|
  # stmt1.subject now holds the URI of the article
  graph.query([nil, MyOnt.isAuthorOf, stmt1.subject]) do |stmt2|
    # stmt2.subject now holds the URI of the author
    graph.query([stmt2.subject, MyOnt.hasName, nil]) do |stmt3|
      # stmt3.object now holds the name of the author
      author_name = stmt3.object.inspect
    end
  end
end
{% endhighlight %}

If you still prefer to use SPARQL instead of pure Ruby, there’s a gem for that: [SPARQL-Grammar](https://github.com/gkellogg/sparql-grammar). Beware, though, that, as I’ve said before, the Semantic Web in Ruby has still a long road to run to catch up with languages such as Java. The work to bring SPARQL to Ruby is still very incomplete and there are many things you can’t do (sometimes I couldn’t even define prefixes, which resulted in some very ugly queries).

You now have the tools you need to make full use of the semantic information of your application. With many Semantic Web applications, this is all you need to know. However, there’s more we can do. If you’re developing in Ruby on Rails, chances are you’re intending to put your web application on the cloud. And there’s also a good possibility that you may want to change some of your data in the future. That’s when a simple file is no longer an option to store your data and you must upgrade it to a Triple Store.

## Leveling up to a Triple Store

A Triple Store stands for an N-Triples file as a database stands for an XML file (sort of). So if you’ll ever need to update the semantic information of your web application, that’s what you should use.

There are plenty of Triple Stores in Java for you to run locally or in your server, like [Jena](http://incubator.apache.org/jena/), [AllegroGraph](http://www.franz.com/agraph/allegrograph/), [Sesame](http://www.aduna-software.com/technology/sesame) and many more. There are interfaces that let your Ruby application interact with those Java Triple Stores, so if your server supports Java or localhost is as far as you’ll get, them one of those might be the right solution for you.

However, if you’re developing the webapp in Ruby on Rails, chances are you want it online, and your infrastructure might not make it simple to support many languages and configurations. If that’s the case, then you need to develop an interface that creates an abstraction in your server’s database so it acts as a Triple Store. Such an abstraction would probably use a single 3-column table (for subject, predicate and object) and would return a set of triples for every query received. The hardest step should be converting from SPARQL or pure-Ruby RDF.rb queries into the proper SQL query.

Fortunately, if you use PostgreSQL and/or SQLite, there’s an amazing work done that integrates those databases with RDF.rb data. It’s the Ruby gem [RDF-do](https://github.com/ruby-rdf/rdf-do), and it may save you days of work and many frustrations.

## To sum up

Once one grasps the power of the Semantic Web, it’s not easy to ignore its advantages and future potential. However, as you can now see, the work around it in Ruby feels scattered and incomplete. Because it was so difficult to come across these scattered pieces of great work and because of what can be achieved when they are all connected, there was a great need of putting all this knowledge together. Yes, there are other similar guides online, but many are so outdated that may put you on the wrong track.

As I’ve pointed out before, this wasn’t intended to be a step-by-step tutorial for you to copy+paste all the code you needed to develop a basic application. If this article is so long as it is, imagine how it would be with all that information. It’s more like an updated guide you can use to save hours of research and frustration.
