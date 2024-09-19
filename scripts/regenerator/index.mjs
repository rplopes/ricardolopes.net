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

const pipeline = promisify(stream.pipeline);
const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RSS_URL = 'https://rplopes.hashnode.dev/rss.xml';
const BLOG_DIR = path.join(__dirname, '..', '..', 'blog');
const TEMPLATE_PATH = path.join(BLOG_DIR, 'no-surprises', 'index.html');

async function fetchRSS(url) {
  const response = await fetch(url);
  const xml = await response.text();
  const parser = new xml2js.Parser({ explicitArray: false });
  return parser.parseStringPromise(xml);
}

async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  await pipeline(response.body, fs.createWriteStream(outputPath));
}

async function fetchBlogPostContent(url) {
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  
  // Use the correct selector for the post content
  const content = $('#post-content-wrapper').html();
  
  // Extract the reading time
  const readingTime = $('span:contains("min read")').text().trim();
  
  if (!content) {
    console.warn(`Could not find content for post: ${url}`);
    return null;
  }
  
  return { content, readingTime };
}

async function createBlogPost(item, template) {
  const slug = new URL(item.link).pathname.split('/').pop();
  const dir = path.join(BLOG_DIR, slug);
  await fsPromises.mkdir(dir, { recursive: true });

  const postData = await fetchBlogPostContent(item.link);
  
  if (!postData) {
    console.error(`Skipping post due to missing content: ${item.link}`);
    return;
  }

  let { content, readingTime } = postData;

  let $ = cheerio.load(content, { decodeEntities: false });

  // Handle images
  const imagePromises = [];
  $('img').each((index, element) => {
    const img = $(element);
    let src = img.attr('src');
    if (src && src.startsWith('https://cdn.hashnode.com')) {
      // Remove query parameters from the URL
      src = src.split('?')[0];
      
      const filename = path.basename(src);
      const localPath = `/blog/${slug}/${filename}`;
      const fullLocalPath = path.join(dir, filename);
      
      // Update image src to absolute path
      img.attr('src', `https://ricardolopes.net${localPath}`);
      
      // Add promise to download image
      imagePromises.push(downloadImage(src, fullLocalPath));
    }
  });

  // Wait for all images to be downloaded
  await Promise.all(imagePromises);

  // Update content with modified image links
  content = $.html();

  const $template = cheerio.load(template, { decodeEntities: false });

  // Update title
  $template('title').text(`${item.title} | Ricardo Lopes`);
  $template('h1[itemprop="headline"]').text(item.title);

  // Update meta description and og:description
  $template('meta[name="description"]').attr('content', item.description);
  $template('meta[property="og:description"]').attr('content', item.description);

  // Update canonical link, og:url, and itemprop="url"
  const canonicalUrl = `https://ricardolopes.net/blog/${slug}/`;
  $template('link[rel="canonical"]').attr('href', canonicalUrl);
  $template('meta[property="og:url"]').attr('content', canonicalUrl);
  $template('link[itemprop="url"]').attr('href', canonicalUrl);

  // Update og:title
  $template('meta[property="og:title"]').attr('content', item.title);

  // Update og:image
  $template('meta[property="og:image"]').attr('content', `${canonicalUrl}og.png`);

  // Update publication date
  const pubDate = new Date(item.pubDate);
  $template('time[itemprop="datePublished"]').attr('datetime', pubDate.toISOString().split('T')[0]);
  $template('time[itemprop="datePublished"]').text(pubDate.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }));

  // Update reading time
  const readingTimeElement = $template('.post-meta li:last-child');
  readingTimeElement.text(readingTime);

  // Update content
  $template('div[itemprop="articleBody"]').html(content);

  // Generate the final HTML without pretty formatting
  let html = $template.html({ decodeEntities: false });

  await fsPromises.writeFile(path.join(dir, 'index.html'), html, 'utf8');

  // Generate og.png
  const title = item.title;
  const estimate = readingTime.split(' ')[0]; // Extract the number from "X min read"
  const ogImagePath = path.join(dir, 'og.png');
  
  try {
    await execPromise(`TITLE="${title}" ESTIMATE="${estimate}" OUTPUT_PATH="${ogImagePath}" node scripts/ogimage/index.mjs`, {
      cwd: path.join(__dirname, '..', '..') // Adjust this path as needed
    });
    
    console.log(`Generated og.png for: ${title}`);
  } catch (error) {
    console.error(`Error generating og.png for ${title}:`, error);
  }
}

async function main() {
  const rss = await fetchRSS(RSS_URL);
  const items = rss.rss.channel.item;
  const template = await fsPromises.readFile(TEMPLATE_PATH, 'utf-8');

  for (const item of items) {
    await createBlogPost(item, template);
  }

  console.log('Blog updated successfully!');
}

main().catch(console.error);
