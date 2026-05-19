import { preloadData } from '../app/lib/cache'

async function main() {
  console.log('Preloading data...')
  try {
    await preloadData()
    console.log('Data preloaded successfully')
  } catch (error) {
    console.error('Error preloading data:', error)
    process.exit(1)
  }
}

main() 