import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";
import { describe } from "node:test";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };

  try {
    const response = await axios.get(url, options);

    const $ = cheerio.load(response.data);

    const title = $(".product__heading > .product__title-left.h1.product__title-collapsed.ng-star-inserted").text().trim();

    const currentPrice = extractPrice(
      $(".product-price__big"),
    );

    const originalPrice = extractPrice(
      $(
        ".product-price__small.ng-star-inserted"
      ),
    );

    const currency =
      $(".product-price__symbol.currency")
        .text().slice(0, 1)

    const wishCount = $('.wish-count-text.ng-star-inserted').text()

    const isOutOfStock = $(".status-label")
      .text()
      .trim()
      .toLowerCase()
      .includes("немає в наявності");

    const image =
      $(".picture-container__picture").attr("src") ||
      "";

    const reviewsCount = $('.product-tabs__heading_color_gray').text().trim()

    const description = $('.product-about__description-content').text().trim()

    const category = $('.breadcrumbs').text().split('/')[2]

    const discountRate = !originalPrice
      ? 0
      : 100 - Math.floor((currentPrice * 100) / originalPrice);

    const data = {
      url,
      title,
      currentPrice: Number(currentPrice),
      originalPrice: Number(originalPrice) || Number(currentPrice),
      isOutOfStock,
      image: String(image),
      discountRate: Number(discountRate),
      priceHistory: [],
      averagePrice: Number(currentPrice) || Number(originalPrice),
      lowestPrice: Number(currentPrice) || Number(originalPrice),
      highestPrice: Number(originalPrice) || Number(currentPrice),
      currency: String(currency),
      wishCount: Number(wishCount),
      reviewsCount: Number(reviewsCount),
      description: String(description),
      category: String(category)
    };
    return data ;
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
