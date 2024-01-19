const markdownIt = require("markdown-it");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight, {
    preAttributes: {
      "data-language": function({ language, content, options }) {
        return language;
      }
    }
  });
  
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/css");
  eleventyConfig.addPassthroughCopy("./src/img");
  eleventyConfig.addWatchTarget("./src/css/");

  eleventyConfig.addPassthroughCopy("CNAME");

  eleventyConfig.addCollection("published", (collectionApi) => {
    return collectionApi.getFilteredByGlob(["./src/posts/*.md"])
      .filter((post) => "published" in post.data && post.data["published"] == true);
  });

  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob(["./src/posts/*.md"]);
  });

  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob(["./src/projects/*.md"]);
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

  eleventyConfig.addFilter("debugger", (...args) => {
    console.log(...args)
    debugger;
  })

  const markdownItAnchorOptions = {
    permalink: markdownItAnchor.permalink.linkAfterHeader({
      symbol: "#",
      style: 'visually-hidden',
      assistiveText: title => `permalink to "${title}"`,
      visuallyHiddenClass: 'visually-hidden',
      wrapper: ['<div class="anchor-wrapper">', '</div>'],
      renderAttrs: (slug) => {
        return { class: "test" };
      }
    }),
  }

  const md = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  })
  .use(require("markdown-it-footnote"))
  .use(markdownItAnchor, markdownItAnchorOptions);

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
