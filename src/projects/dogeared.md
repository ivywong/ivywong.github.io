---
title: dogeared
description: a browser extension to keep track of your place in series and books on the web
repoUrl: https://github.com/ivywong/dogeared
created: 2024-01-10T14:27:05-08:00
published: true
---
## overview

I spend a lot of time reading and watching things on the internet. Sometimes these things are long / broken into parts across many different pages and I don't have a good way to keep track of my progress without either juggling a lot of bookmarks, writing down where I left off elsewhere, or eternally keeping a tab open.

This browser extension tries to solve this problem by providing a way to save the current page as your place in a "series", load it, and overwrite the saved page with some other page.

## links

- [github repo](https://github.com/ivywong/dogeared)

## out of scope (for now)

- adding complex validation for whether you can save certain pages in a series based on URL pattern matching
- storing or scraping table of contents for various kinds of series (and therefore progress information)

## development plan

Until validation is implemented, in practice, what I'm referring to as a "series" does not have to be an actual series, but is simply "a named container for a URL". For many use cases, validation would involve parsing the actual web page or providing a table of contents, which is unnecessary. Still, I plan to implement basic validation using the current domain, or a user-provided prefix.

### features in order of development

- [x] you can create a series with the current page and a custom name
- [x] you can save, load, update, and delete a series
- [ ] you can edit the name of an existing series
- [x] you can view a list of saved series in the extension popup 
- [x] series information is stored persistently
- [ ] search and filter series in the extension popup by name/url
- [ ] validate adding marks by domain (at minimum)
- [ ] popup for displaying errors
- [ ] you can view history of a series in the popup
    - no limit to the history for now
- [ ] export/import series data (needs UI) (no merge)

### sometime

- fancy styling and clean UI
    - css animations? or other way to expand history list
    - light and dark mode icons and theme
- options page
    - configure max history size
- keyboard shortcuts for doing all the things
    - open popup
    - create new series
    - select series
    - update selected series
    - filter series
- shortcut (context menu/keyboard) to save current page to last loaded series
- save and load data from The Cloud
    - possibly google drive

## design details

### dependencies

Browser APIs:
- tabs APIs
    - tabs.query() (for active tab)
    - tabs.create()
- window.localstorage
    - to persist series data across browser sessions
- Web components?
    - [Patterns for Reactivity with Modern Vanilla JavaScript – Frontend Masters Boost](https://frontendmasters.com/blog/vanilla-javascript-reactivity/)
    - [Writing a TodoMVC App With Modern Vanilla JavaScript – Frontend Masters Boost](https://frontendmasters.com/blog/vanilla-javascript-todomvc/)

Third-party dependencies:
- Something for fuzzy searching? [Fuse.js | Fuse.js](https://www.fusejs.io/)
    - or can just use [regex - Javascript fuzzy search that makes sense - Stack Overflow](https://stackoverflow.com/a/62216738/23227058)

External Information needed
- user's current tab - title & URL
- current page favicon ([how to save in local storage](https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page))
- current time (when saving)

### storage format

<details>
<summary>Series Information JSON</summary>

```json
{
    "series": [
        {
            "id": "1e8ed227-7c10-4000-afa0-669f184576fc",
            "name": "Grant Abbitt - Blender 3 - Complete Beginners Guide",
            "marks": [
                {
                    "title": "Blender 3 - Complete Beginners Guide - Part 2 - Materials & Rendering",
                    "url": "https://www.youtube.com/watch?v=g5lHlUB66r0&list=PLn3ukorJv4vuU3ILv3g3xnUyEGOQR-D8J&index=2",
                    "creation_time" : 1704668925
                },
                {
                    "title": "Blender 3 - Complete Beginners Guide - Part 3 - The Old Man",
                    "url": "https://www.youtube.com/watch?v=zt2ldQ23uOE&list=PLn3ukorJv4vuU3ILv3g3xnUyEGOQR-D8J&index=3",
                    "creation_time": 1704928125
                } // the page displayed is always the last one
            ],
            "validation_prefix": "https://youtube.com",
            "favicon": `icon_${id}.png`, // or store separately
            "last_access_time": 1704928125, // update, load
            "creation_time": 1704928125
        },
        {
            "id": "047b0f7b-2da2-4b5c-8bb3-36078a2c1b08",
            "name": "Crafting Interpreters",
            "marks": [
                {
                    "title": "Scanning - Crafting Interpreters",
                    "url": "http://craftinginterpreters.com/scanning.html#lexemes-and-tokens",
                    "creation_time": 1704668925
                }
            ],
            "validation_prefix": "http://craftinginterpreters.com",
            "favicon": "",
            "last_access_time": 1704928125,
            "creation_time": 1704928125
        },
        {
            "id": "c4df7368-747c-4c88-ba3c-2256355bead4",
            "name": "Misc Cat Videos",
            "marks": [
                {
                    "title": "Nyan Cat! [Official]",
                    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "creation_time": 1704668925
                },
                {
                    "title": "ABBA - Happy New Year (cover by Bongo Cat)",
                    "url": "https://www.youtube.com/watch?v=hQdVkcB6e9U",
                    "creation_time": 1704668925
                }
            ],
            "validation_prefix": "https://youtube.com",
            "favicon": "",
            "last_access_time": 1704928125,
            "creation_time": 1704928125
        }
    ]
}
```
</details>

<details>
<summary>Options JSON</summary>

```json
{
    "default_sort": "LAST_UPDATED", // LAST_ACCESSED, LAST_CREATED, CUSTOM(?)
    "default_theme": "light", // dark, auto
    "show_favicons": False,
    "max_history_size": 10, // -1 for infinite
    "validate_urls": True
}
```
</details>

## open questions

- How to handle user saving series with multiple names?
    - Allow this for now and use series IDs under the hood, otherwise you would need some way to check for duplicate series
    - How to make unique ids when deleting / creating?
        - Probably use UUIDs rather than increment numbers. This also allows for easier import / merge potential

## devlog

### 2024-01-09

Went through the [MDN popup extension tutorial](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_second_WebExtension) and then tried to make a simple popup where you can click a button and populate it with the current tab's title and URL. Success!

The thing I most struggled with was the development workflow. The manual way of adding a temporary addon, inspecting it, reloading the addon after changing it, was definitely not the way to go.

After some trial and error and hunting around documentation I finally figured out a web-ext command to open the Firefox developer edition with the extension installed, to a specific page, with dev tools for the popup itself open (you can't inspect the popup itself with the normal inspector, and you can't disable the popup auto-hide either).

```bash
web-ext run \
    --firefox=/Applications/Firefox\ Developer\ Edition.app/Contents/MacOS/firefox \
    --devtools --firefox-profile=dev-edition-default \
    --start-url http://google.com
```

I also added the `--firefox-profile` option so I could access uBlock and TreeStyleTabs in the test browser environment.

Even with this, I still have to manually rearrange my windows and disable the popup auto-hide every time I run `web-ext`. Wish there was a flag or setting that I could check.

### 2024-01-10

Since this is just a browser extension, I didn't want to use any build tools nor any frameworks. I looked into [vanilla JS reactive app patterns](https://frontendmasters.com/blog/vanilla-javascript-reactivity/) and tried using [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) for the first time and while I did get something working (see my [web-components branch](https://github.com/ivywong/dogeared/tree/web-components) on github) I didn't have a clear understanding of how to hook the data (essentially a json blob) into separate components. Do you just store the whole object in the component itself? How could I export the data afterwards? I think if I had experience using React or other similar frameworks, it would have been more intuitive.

### 2024-01-11

I looked at the [TodoMVC implementation in Vanilla JS](https://frontendmasters.com/blog/vanilla-javascript-todomvc/) by the folks at Frontend Masters and read through the code, which made a lot of sense to me (the way the data layer was separated and so on) compared to whatever I was doing with web components. It also taught me about event delegation and using events with the storage layer to trigger re-rendering. I rewrote the extension to follow the simplest approach and got the series list rendering, as well as saving and loading data from localstorage.

### 2024-01-12

Got the MVP of the extension working with overwrite, load, create/remove series functionality, and installed it persistently on my regular browser.

<details>
<summary>Here are some demos! (After recording I added a "Remove Series" button.)</summary>

![dogeared demo save and load](/img/test-dogeared-rec1.gif)

![dogeared demo create series](/img/test-dogeared-rec2.gif)

</details>