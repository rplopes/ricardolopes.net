<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"
                xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
      <head>
        <title><xsl:value-of select="/rss/channel/title"/> RSS Feed</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
        <style type="text/css">
          *,::after,::before{box-sizing:border-box}html{font-family:system-ui,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji';line-height:1.15;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4}body{margin:0}hr{height:0;color:inherit}abbr[title]{text-decoration:underline dotted}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace,SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button}::-moz-focus-inner{border-style:none;padding:0}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}legend{padding:0}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}
        html {
          font-size: 1.1rem;
          font-family: Lucida Grande, Helvetica, Arial;
          line-height: 1.6rem;

          @media (prefers-color-scheme: dark) {
            color: #eeeeee;
            background: #111111;
          }
        }
        section {
          max-width: 40rem;
          margin: 3rem auto 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: Palatino, Palatino Linotype, Lucida Grande, Helvetica, Arial;
        }

        h1 {
          font-size: 2.5rem;
          line-height: 3rem;
        }

        h2 {
          font-size: 1.5rem;
          line-height: 2rem;
        }

        a {
          color: #e00000;
        }

        a:visited {
          color: #c60000;
        }

        a:hover {
          color: #ff0000;
        }

#content {
          margin: 0 auto;
        }

#main {
          width: 100%;
          margin: 0;
          padding: 1rem;
        }

        ul.post-meta {
          padding: 0;
          font-size: 0.9rem;
          color: #888888;

          li {
            display: inline;
            margin-right: 1rem;
          }
        }

        #instructions {
          padding: 0.5em 1.2em;
          font-size: 0.9em;
          color: #222222;
          background-color: #dddddd;

          @media (prefers-color-scheme: dark) {
            color: #dddddd;
            background: #222222;
          }
        }
      </style>
      </head>
      <body>
        <div id="content">
          <div id="main">
            <section>
              <h1>
                <!-- https://commons.wikimedia.org/wiki/File:Feed-icon.svg -->
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="vertical-align: text-bottom; width: 1.2em; height: 1.2em; margin-right: 0.5em;" id="RSSicon" viewBox="0 0 256 256">
                  <defs>
                    <linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
                      <stop  offset="0.0" stop-color="#E3702D"/><stop  offset="0.1071" stop-color="#EA7D31"/>
                      <stop  offset="0.3503" stop-color="#F69537"/><stop  offset="0.5" stop-color="#FB9E3A"/>
                      <stop  offset="0.7016" stop-color="#EA7C31"/><stop  offset="0.8866" stop-color="#DE642B"/>
                      <stop  offset="1.0" stop-color="#D95B29"/>
                    </linearGradient>
                  </defs>
                  <rect width="256" height="256" rx="55" ry="55" x="0"  y="0"  fill="#CC5D15"/>
                  <rect width="246" height="246" rx="50" ry="50" x="5"  y="5"  fill="#F49C52"/>
                  <rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)"/>
                  <circle cx="68" cy="189" r="24" fill="#FFF"/>
                  <path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/>
                  <path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/>
                </svg>

                <xsl:value-of select="/rss/channel/title"/> RSS Feed
              </h1>
              <p><xsl:value-of select="/rss/channel/description"/></p>
              <a target="_blank">
                <xsl:attribute name="href">
                  <xsl:value-of select="/rss/channel/link"/>
                </xsl:attribute>
                Visit Blog
              </a>
            </section>
            <section>
              <div id="instructions">
                <p>
                  Subscribe with <a target="_blank" href="https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fricardolopes.net%2Fblog%2Frss.xml">Feedly</a>,
                  <a target="_blank" href="https://www.inoreader.com/search/feeds/https%3A%2F%2Fricardolopes.net%2Fblog%2Frss.xml">Inoreader</a>,
                  or with any other RSS reader by adding this feed's URL.
                </p>
                <p>
                  If you prefer to subscribe by email, you can use this feed's URL on a service like <a target="_blank" href="https://feedrabbit.com/subscriptions/new?url=https%3A%2F%2Fricardolopes.net%2Fblog%2Frss.xml">Feedrabbit</a>.
                </p>
              </div>
            </section>
            <section>
              <h2>All Posts:</h2>
              <xsl:for-each select="/rss/channel/item">
                <section>
                  <h3>
                    <a target="_blank">
                      <xsl:attribute name="href">
                        <xsl:value-of select="link"/>
                      </xsl:attribute>
                      <xsl:value-of select="title"/>
                    </a>
                  </h3>
                  <ul class="post-meta">
                    <li><xsl:value-of select="pubDate" /></li>
                  </ul>
                </section>
              </xsl:for-each>
            </section>
          </div>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

