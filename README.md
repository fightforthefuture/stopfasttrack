Stop Fast Track campaign site!
==============================

Background
----------
If you're reading this, you're probably a campaign manager at Fight for the
Future! Or maybe you're just curious how the site works. In any case, this guide
is set up to explain some of the ways to easily edit the content on this site.
It's supposed to be easy to edit with minimal HTML skills. That said, you might
want to contact your friendly local web developer for any bigger changes.
If you have questions about anything, email jeff@fightforthefuture.org and I'll
do my best to sort it out.

Required software / skillz
--------------------------
For this document, I assume you have access or knowledge of:

* Be able to edit the `index.html` file (either using the Github site or using
  the Github App for Mac OS X, or git itself.)
* Have an image editing program like Photoshop. Know how to crop and resize
  images.
* Be able to upload images to the Github repo. Normally this requires the Github
  App for Mac Os X, or git itself.


Customizing Facebook Share Text
-------------------------------
Near the top of the `index.html` file is a big blog of `<meta` tags, like so:

```html
    <meta property="og:title" content="Stop this secret trade agreement that would censor the Internet."/>
    <meta property="og:type" content="website"/>
    <meta property="og:url" content="https://www.stopfasttrack.com"/>
    <meta property="og:image" content="https://s3.amazonaws.com/fftf-cms/media/opengraph/Screen_Shot_2014-01-03_at_7.20.26_PM.png"/>
    <meta property="og:site_name" content="Stop Fast Track! Stop the TPP!"/>
    <meta property="og:description" content="Congress is pushing legislation right now that would 'Fast Track' the Trans-Pacific Partnership -- a secretive agreement negotiated behind closed doors by government bureaucrats and more than 600 corporate lobbyists. It threatens everything you care about: democracy, jobs, the environment, and the Internet."/>
```
Take a good look, and hopefully it's pretty self-explanatory. These are the
bits of data that Facebook pulls in and uses to show the share image and text.

#### A warning about quotation marks

Avoid using "double quotation marks" in the Facebook share text. Because the
meta tags use double quotation marks to enclose the text, using these can mess
things up. If you really need a double quotation mark, substitute the character
entity `&quot;` in place of the double quotation mark. If that doesn't make
sense, then either don't do it or ask a developer.

#### How to change the share image

You'll notice the `<meta property="og:image" content="https://..." />` tag
points to a full URL of an image. To add a new image, follow these steps:

1. Drop a new image into the `images/share_images/` folder. Make a note of the
   filename. It is cAsE SeNsiTIVe.
2. Customize the `<meta property="og:image" content="https://..." />` tag to
   point to the anticipated full URL of that file, based on the
   `images/share_images/[FILENAME]` path, ie:
   `<meta property="og:image" content="https://www.stopfasttrack.com/images/share_images/share2.png" />`
3. Push your changes to Github using the Github App for Mac OS X or git program.

Customizing Twitter Share Text
------------------------------
Near the top of the `index.html` file is a `<script type="text/javascript">`
tag. Find the line that looks like
`var TWEET_TEXT = "Stop Fast Track for the #TPP!";` and edit that. Note that the
link to the site will be added automatically, so you don't need to add it.

**See the warning above about "double quotation marks." it applies here also.**

Adding an Organization to the Logo Cloud / List
-----------------------------------------------
You'll notice in the `index.html` file, there's a big list of organizations.
These are formatted in a special way that tells the JavaScript code whether to
show them in the logo cloud, or to only show them in the list of orgs at the
bottom. Here's an example:

```html
    <div class="org fftf">
        <!-- width of org image in pixels: -->
        <b class="img_width">250</b>
        <b class="show_in_cloud">true</b>
        <b class="org_name">Fight for the Future</b>
        <b class="headline">We oppose Fast Track because it's fundamentally undemocratic and the TPP would censor the Internet.</b>
        <b class="description">We built this page and helped organize this diverse range of groups to fight back because the TPP is bad for everything you care about. Follow us on <a href="http://twitter.com/fightfortheftr" target="_blank">Twitter</a> and <a href="http://facebook.com/fightfortheftr" target="_blank">Facebook</a> for updates.</b>
        <b class="tweet_text">.@fightfortheftr opposes Fast Track for the TPP because it's fundamentally undemocratic and would censor the net.</b>
    </div>
```

Here are the steps for adding a new organization:

1. Get a PNG logo for the new organization
2. Resize it down to 80 pixels height using PhotoShop. If the scaled image is
   wider than 290 pixels, scale it to 290 pixels width. The maximum size is
   290x80 pixels.
3. Save the image to 1images/orgs/orgname.png1 -- Make a note of what orgname is
   and keep it simple, lowercase.
4. Copy the entire `<div class="org fftf"> ... </div>` block and paste at the
   bottom of this group of organizations.
5. Change `<div class="org fftf">` to `<div class="org orgname">` (whatever the
   _exact_ orgname you named the image was.)
6. Customize the remaining fields as follows, and then push to Github:

```html
    <b class="img_width">250</b>
```
This is the width of the image file as resized. You must set this correctly or
the image will show up distorted.

```html
    <b class="show_in_cloud">true</b>
```
Set this to `true` to show the organization in the logo cloud. Otherwise it will
only show up in the list at the bottom of the page.

```html
    <b class="org_name">Fight for the Future</b>
```
The name of the organization. Text only, any HTML will not be rendered.

```html
    <b class="headline">We hate Fast Track because it sux lolol</b>
```
Headline text. Any HTML will not be rendered.

```html
    <b class="description">Here's why we hate fast track. <a href="https://trolol.com">More info</a></b>
```
Description text. This may include HTML, for example to show a link to another
site. See the other orgs for an example of how to set this up.

```html
    <b class="tweet_text">.@fightfortheftr thinks Fast Track sux lol</b>
```
_Optional Tweet Text_. No need to add a link at the end, it gets added
automatically. Keep this less than ~120 characters so there's room for the link.

Customizing text / other stuff
------------------------------
The markup in `index.html` should be pretty easy to edit. If you see text, it's
probably safe to change it. We could also put optimizely on this.

If you need anything fancier, your highly-responsive professional web
development team is standing by, ready to make your dreams a reality!