import { useEffect } from 'react'

/**
 * Sets document title and meta description per route.
 */
export default function SEOHead({ title, description }) {
  useEffect(() => {
    document.title = title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])

  return null
}
