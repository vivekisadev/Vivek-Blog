import { generateRssFeed } from '../lib/feed';

async function main() {
  console.log('Generating RSS feed...');
  await generateRssFeed();
  console.log('RSS feed generated successfully!');
}

main().catch(console.error);
