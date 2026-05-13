const axios = require('axios');

const isShopifyConfigured = () =>
  Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );

const getShopifyClient = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  return axios.create({
    baseURL: `https://${domain}/api/2024-01/graphql.json`,
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': accessToken,
    },
    timeout: 10000,
  });
};

const shopifyService = {
  isConfigured: isShopifyConfigured,

  getProducts: async () => {
    if (!isShopifyConfigured()) return [];
    const client = getShopifyClient();
    const query = `
      {
        products(first: 20) {
          edges {
            node {
              id
              title
              description
              handle
              productType
              vendor
              images(first: 5) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                      currencyCode
                    }
                    compareAtPrice {
                      amount
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await client.post('', { query });
      return response.data.data.products.edges.map(edge => {
        const node = edge.node;
        const price = parseFloat(node.variants.edges[0]?.node.price.amount || 0);
        const originalPrice = parseFloat(node.variants.edges[0]?.node.compareAtPrice?.amount || 0);
        
        return {
          id: node.handle,
          title: node.title,
          price: price,
          originalPrice: originalPrice > price ? originalPrice : undefined,
          discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
          image: node.images.edges[0]?.node.url || '',
          gallery: node.images.edges.map(e => e.node.url),
          category: node.productType.toLowerCase().includes('men') ? 'men' : 'women',
          description: node.description,
          brand: node.vendor,
          handle: node.handle
        };
      });
    } catch (error) {
      console.error('Error fetching products from Shopify:', error.message);
      throw error;
    }
  },

  getProductByHandle: async (handle) => {
    if (!isShopifyConfigured()) return null;
    const client = getShopifyClient();
    const query = `
      query getProduct($handle: String!) {
        product(handle: $handle) {
          id
          title
          description
          handle
          productType
          vendor
          images(first: 10) {
            edges {
              node {
                url
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await client.post('', { query, variables: { handle } });
      const node = response.data.data.product;
      if (!node) return null;

      const price = parseFloat(node.variants.edges[0]?.node.price.amount || 0);
      const originalPrice = parseFloat(node.variants.edges[0]?.node.compareAtPrice?.amount || 0);

      return {
        id: node.handle,
        title: node.title,
        price: price,
        originalPrice: originalPrice > price ? originalPrice : undefined,
        discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
        image: node.images.edges[0]?.node.url || '',
        gallery: node.images.edges.map(e => e.node.url),
        category: node.productType.toLowerCase().includes('men') ? 'men' : 'women',
        description: node.description,
        brand: node.vendor,
        sizes: [...new Set(node.variants.edges.map(v => v.node.selectedOptions.find(o => o.name === 'Size')?.value).filter(Boolean))],
        handle: node.handle
      };
    } catch (error) {
      console.error(`Error fetching product ${handle} from Shopify:`, error.message);
      throw error;
    }
  },

  getCollections: async () => {
    if (!isShopifyConfigured()) return [];
    const client = getShopifyClient();
    const query = `
      {
        collections(first: 10) {
          edges {
            node {
              id
              title
              handle
              description
              image {
                url
              }
            }
          }
        }
      }
    `;

    try {
      const response = await client.post('', { query });
      return response.data.data.collections.edges.map(edge => ({
        id: edge.node.handle,
        title: edge.node.title,
        image: edge.node.image?.url || '',
        description: edge.node.description,
        handle: edge.node.handle
      }));
    } catch (error) {
      console.error('Error fetching collections from Shopify:', error.message);
      throw error;
    }
  },

  getProductsByCollection: async (handle) => {
    if (!isShopifyConfigured()) return [];
    const client = getShopifyClient();
    const query = `
      query getCollectionProducts($handle: String!) {
        collection(handle: $handle) {
          products(first: 20) {
            edges {
              node {
                id
                title
                description
                handle
                productType
                vendor
                images(first: 5) {
                  edges {
                    node {
                      url
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await client.post('', { query, variables: { handle } });
      const collection = response.data.data.collection;
      if (!collection) return [];

      return collection.products.edges.map(edge => {
        const node = edge.node;
        const price = parseFloat(node.variants.edges[0]?.node.price.amount || 0);
        const originalPrice = parseFloat(node.variants.edges[0]?.node.compareAtPrice?.amount || 0);
        
        return {
          id: node.handle,
          title: node.title,
          price: price,
          originalPrice: originalPrice > price ? originalPrice : undefined,
          discountPercent: originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined,
          image: node.images.edges[0]?.node.url || '',
          gallery: node.images.edges.map(e => e.node.url),
          category: node.productType.toLowerCase().includes('men') ? 'men' : 'women',
          description: node.description,
          brand: node.vendor,
          handle: node.handle
        };
      });
    } catch (error) {
      console.error(`Error fetching products for collection ${handle}:`, error.message);
      throw error;
    }
  }
};

module.exports = shopifyService;
