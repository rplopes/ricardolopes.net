module Jekyll
  class CategoryIndex < Page
    def initialize(site, category)
      @site = site
      @base = site.source
      @dir = File.join('blog/categories', Utils.slugify(category))
      @name = 'index.html'
      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'category_index.html')
      self.data['category'] = category
      self.data['title'] = "Every #{category} published"
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
      index.write(File.join(site.dest, 'blog'))
      site.pages << index
    end
  end
end
