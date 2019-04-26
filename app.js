// load puppeteer
const puppeteer = require('puppeteer');
const domain = "https://www.amazon.it";

// IIFE
(async () => {
  // wrapper to catch errors
  try {
    // create a new browser instance
    const browser = await puppeteer.launch();

    // create a page inside the browser;
    const page = await browser.newPage();

    // navigate to a website and set the viewport
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(domain, {
      timeout: 3000000
    });

    // search and wait the product list
    await page.type('#twotabsearchtextbox', 'iphone x 64gb');
    await page.click('input.nav-input');
    await page.waitForSelector('.s-image');

    // create a screenshots
    await page.screenshot({path: 'search-iphone-x.png'});

    const products = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('.s-result-item'));
      return links.map(link => {
        if (link.querySelector(".a-price-whole")) {
          return {
            name: link.querySelector(".a-size-medium.a-color-base.a-text-normal").textContent,
            url: link.querySelector(".a-link-normal.a-text-normal").href,
            image: link.querySelector(".s-image").src,
            price: parseFloat(link.querySelector(".a-price-whole").textContent.replace(/[,.]/g, m => (m === ',' ? '.' : ''))),
          };
        }
      }).slice(0, 5);
    });

    console.log(products.sort((a, b) => {
      return a.price - b.price;
    }));

    // close the browser
    await browser.close();
  } catch (error) {
    // display errors
    console.log(error)
  }
})();
