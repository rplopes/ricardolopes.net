# Outputs the reading time

# Read this in “about 4 minutes”
# Put into your _plugins dir in your Jekyll site
# Usage: Read this in about {{ page.content | reading_time }}

module ReadingTimeFilter
  WORDS_PER_MINUTE = 180

  def reading_time(input)
    words = input.split.size;
    minutes = ( words / WORDS_PER_MINUTE ).floor
    minutes_label = minutes === 1 ? " minute" : " minutes"
    minutes > 0 ? "About #{minutes} #{minutes_label}" : "less than 1 minute"
  end
end

Liquid::Template.register_filter(ReadingTimeFilter)
