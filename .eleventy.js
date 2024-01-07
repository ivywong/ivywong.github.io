const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/res");
  eleventyConfig.addWatchTarget("./src/css/");

  eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addCollection("published", (collectionApi) => {
    return collectionApi.getAll()
      .filter((post) => "published" in post.data && post.data["published"] == true)
  });

  eleventyConfig.addFilter("readableDate", function(date) {
    return new Date(date).toLocaleDateString(
      'en-us',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      }).toLocaleLowerCase();
  });

  eleventyConfig.addFilter("stripUrlTrailingSlash", function(url) {
    if (!url.endsWith('/')) {
      return url;
    } else {
      return url.substring(0, url.length - 1);
    }
  });

  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(require("markdown-it-footnote"));

  eleventyConfig.setLibrary("md", md);

  return {
    passthroughFileCopy: true,
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  }
}
