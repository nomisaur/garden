const repeat = (func, seconds) => {
  func();
  setTimeout(() => repeat(func, seconds), seconds);
};

// Require puppeteer extra, puppeteer stealth, google vision
const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const vision = require('@google-cloud/vision');

// Require our hcaptcha method
const { hcaptcha } = require('puppeteer-hcaptcha');

// Instantiate a new Google Vision Client
// This is important so make sure keyFilename points to your credentials
// Our solver method will be using this to speed up the process
const client = new vision.ImageAnnotatorClient({
  keyFilename: '/Users/nlsaltis/fun/garden/popcat-311705-40d649aa757e.json',
});

// Tell puppeteer to use puppeteer stealth
puppeteer.use(pluginStealth());

(async () => {
  // Instantiate a new browser object
  // Ignore errors associated to https
  // Can be headless but for example sake we want to show the browser
  // Set your desired arguments for your puppeteer browser
  const browser = await puppeteer.launch({
    ignoreHTTPSErrors: true,
    headless: false,
    args: [
      `--window-size=600,1000`,
      '--window-position=000,000',
      '--disable-dev-shm-usage',
      '--no-sandbox',
      '--user-data-dir="/tmp/chromium"',
      '--disable-web-security',
      '--disable-features=site-per-process',
    ],
  });

  // Get browser pages
  const [page] = await browser.pages();

  // Send page to your url
  await page.goto('https://popcat.click/');

  // Remove the page's default timeout function
  await page.setDefaultNavigationTimeout(0);

  // Call hcaptcha method passing in our page and google vision client
  hcaptcha(page, client);

  // Your page is ready to submit. Captcha solving should be the last function on your page so we don't have to worry about the response token expiring.
  //await page.screenshot({ path: 'popcat.png' });
  repeat(() => page.click('.cat-img'), 38);
})();
