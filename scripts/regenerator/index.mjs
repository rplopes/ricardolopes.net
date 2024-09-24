import fs from 'fs';
import { promises as fsPromises } from 'fs';
import fetch from 'node-fetch';
import xml2js from 'xml2js';
import * as cheerio from 'cheerio';
import path from 'path';
import { fileURLToPath } from 'url';
import stream from 'stream';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import crypto from 'crypto';

const pipeline = promisify(stream.pipeline);
const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RSS_URL = 'https://rplopes.hashnode.dev/rss.xml';
const BLOG_DIR = path.join(__dirname, '..', '..', 'blog');
const TEMPLATE_PATH = path.join(BLOG_DIR, 'overly-defensive-coding', 'index.html');

async function fetchRSS(url) {
  const response = await fetch(url);
  const xml = await response.text();
  const parser = new xml2js.Parser({ explicitArray: false });
  return parser.parseStringPromise(xml);
}

async function imageExists(path) {
  return fsPromises
    .access(path)
    .then(() => true)
    .catch(() => false);
}

async function downloadImage(url, outputPath) {
  if (await imageExists(outputPath)) {
    return;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  await pipeline(response.body, fs.createWriteStream(outputPath));
}

async function fetchBlogPostContent(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);

  const content = $('#post-content-wrapper').html();
  if (!content) throw new Error(`Could not find content for post: ${url}`);

  const readingTime = $('span:contains("min read")').text().trim();
  if (!readingTime) throw new Error(`Could not find reading time for post: ${url}`);

  return { content, readingTime };
}

async function generateOgImage(title, estimate, dir) {
  // Create a hash of the title and estimate
  const hash = crypto.createHash('sha256').update(`${title}${estimate}`).digest('hex').slice(0, 16);
  const ogImageFilename = `${hash}.png`;
  const ogImagePath = path.join(dir, ogImageFilename);

  if (await imageExists(ogImagePath)) {
    return;
  }

  try {
    await execPromise(
      `TITLE="${title}" ESTIMATE="${estimate}" OUTPUT_PATH="${ogImagePath}" node scripts/ogimage/index.mjs`,
      {
        cwd: path.join(__dirname, '..', '..'),
      }
    );

    console.log(`Generated ${ogImageFilename} for: ${title}`);
  } catch (error) {
    console.error(`Error generating ${ogImageFilename} for ${title}:`, error);
  }

  return ogImageFilename;
}

async function createBlogPost(item, template) {
  const slug = new URL(item.link).pathname.split('/').pop();
  const dir = path.join(BLOG_DIR, slug);
  await fsPromises.mkdir(dir, { recursive: true });

  let { content, readingTime } = await fetchBlogPostContent(item.link);

  let $ = cheerio.load(content, { decodeEntities: false });

  // Handle images
  const imagePromises = [];
  $('img').each((index, element) => {
    const img = $(element);
    let src = img.attr('src');
    if (src && src.startsWith('https://cdn.hashnode.com')) {
      src = src.split('?')[0];
      const filename = path.basename(src);
      const localPath = `/blog/${slug}/${filename}`;
      const fullLocalPath = path.join(dir, filename);
      img.attr('src', `https://ricardolopes.net${localPath}`);
      img.removeAttr('class');
      imagePromises.push(downloadImage(src, fullLocalPath));
    }
  });

  await Promise.all(imagePromises);

  content = $('body').html();

  const $template = cheerio.load(template, { decodeEntities: false });

  // Update title
  $template('title').text(`${item.title} | Ricardo Lopes`);
  $template('h1[itemprop="headline"]').text(item.title);
  $template('meta[property="og:title"]').attr('content', item.title);

  // Update description
  $template('meta[name="description"]').attr('content', item.description);
  $template('meta[property="og:description"]').attr('content', item.description);

  // Update canonical link
  const canonicalUrl = `https://ricardolopes.net/blog/${slug}/`;
  $template('link[rel="canonical"]').attr('href', canonicalUrl);
  $template('meta[property="og:url"]').attr('content', canonicalUrl);
  $template('link[itemprop="url"]').attr('href', canonicalUrl);

  // Update publication date
  const pubDate = new Date(item.pubDate);
  $template('time[itemprop="datePublished"]').attr('datetime', pubDate.toISOString().split('T')[0]);
  $template('time[itemprop="datePublished"]').text(
    pubDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  );

  // Update reading time
  const readingTimeElement = $template('.post-meta li:last-child');
  readingTimeElement.text(readingTime);

  // Update content
  $template('div[itemprop="articleBody"]').html(content);

  // Generate og.png
  const estimate = readingTime.split(' ')[0]; // Extract the number from "X min read"
  const ogImageFilename = await generateOgImage(item.title, estimate, dir);

  // Update og:image
  $template('meta[property="og:image"]').attr('content', `${canonicalUrl}${ogImageFilename}`);

  const html = $template.html({ decodeEntities: false });

  await fsPromises.writeFile(path.join(dir, 'index.html'), html, 'utf8');

  return {
    title: item.title,
    content,
    url: canonicalUrl,
    pubDate: item.pubDate,
    description: item.description,
    readingTime,
  };
}

async function updateBlogIndex(blogPosts) {
  const indexPath = path.join(BLOG_DIR, 'index.html');
  const indexContent = await fsPromises.readFile(indexPath, 'utf-8');
  const $ = cheerio.load(indexContent, { decodeEntities: false });

  // Clear existing posts
  $('.posts-list').empty();

  // Add new posts
  blogPosts.forEach((post) => {
    const postDate = new Date(post.pubDate);
    const formattedDate = postDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    $('.posts-list').append(`
      <h3>
        <a href="${post.url}">${post.title}</a>
      </h3>
      <ul class="post-meta">
        <li>
          <time datetime="${postDate.toISOString().split('T')[0]}">${formattedDate}</time>
        </li>
        ${post.readingTime ? `<li>${post.readingTime}</li>` : ''}
      </ul>
      <p>${post.description || ''}</p>`);
  });

  // Write updated content back to file
  await fsPromises.writeFile(indexPath, $.html({ decodeEntities: false }));
  console.log('Blog index updated successfully');
}

async function generateRSSFeed(blogPosts) {
  const parser = new xml2js.Parser();
  const builder = new xml2js.Builder();

  try {
    // Read the existing RSS file
    const rssContent = await fsPromises.readFile(path.join(BLOG_DIR, 'rss.xml'), 'utf-8');

    // Parse the RSS content
    const result = await parser.parseStringPromise(rssContent);

    // Update the channel's lastBuildDate
    result.rss.channel[0].lastBuildDate = [new Date().toUTCString()];

    // Clear existing items
    result.rss.channel[0].item = [];

    // Convert blog posts to RSS items and sort them
    const items = blogPosts.map((post) => ({
      title: post.title,
      description: post.content,
      link: post.url,
      guid: {
        _: post.url,
        $: { isPermaLink: 'true' },
      },
      'dc:creator': 'Ricardo Lopes',
      pubDate: new Date(post.pubDate).toUTCString(),
    }));

    // Add sorted items to the RSS feed
    result.rss.channel[0].item = items;

    // Convert back to XML
    let xmlString = builder.buildObject(result);

    // Add the XML stylesheet processing instruction
    xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="https://ricardolopes.net/blog/rss.xsl" type="text/xsl"?>
${xmlString.split('\n').slice(1).join('\n')}`;

    // Write the updated XML back to the file
    await fsPromises.writeFile(path.join(BLOG_DIR, 'rss.xml'), xmlString);

    console.log('RSS feed generated successfully');
  } catch (error) {
    console.error('Error generating RSS feed:', error);
  }
}

async function main() {
  const hashnode_rss = await fetchRSS(RSS_URL);
  const items = hashnode_rss.rss.channel.item;
  const template = await fsPromises.readFile(TEMPLATE_PATH, 'utf-8');

  const blogPosts = await Promise.all(items.map((item) => createBlogPost(item, template)));

  // Sort blog posts by publication date (newest first)
  blogPosts.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  // Generate RSS feed
  await generateRSSFeed(blogPosts);

  // Update blog index
  await updateBlogIndex(blogPosts);

  console.log('Blog, RSS feed, and index updated successfully!');
}

main().catch(console.error);
