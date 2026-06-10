import { query, queryOne } from '../../lib/db'

interface DbCategory {
  id: string
  name: string
  slug: string
  icon_name: string | null
  open_gig_count: string
}

export const listCategories = async () => {
  const rows = await query<DbCategory>(
    `SELECT c.id, c.name, c.slug, c.icon_name,
            COUNT(g.id) FILTER (WHERE g.status = 'OPEN') AS open_gig_count
     FROM categories c
     LEFT JOIN gigs g ON g.category_id = c.id
     GROUP BY c.id
     ORDER BY c.name ASC`
  )
  return rows.map(c => ({
    id:       c.id,
    name:     c.name,
    slug:     c.slug,
    iconName: c.icon_name,
    _count:   { gigs: Number(c.open_gig_count) },
  }))
}

export const getCategoryBySlug = async (slug: string) => {
  const row = await queryOne<DbCategory & { total_gig_count: string }>(
    `SELECT c.id, c.name, c.slug, c.icon_name,
            COUNT(g.id) FILTER (WHERE g.status = 'OPEN') AS open_gig_count,
            COUNT(g.id) AS total_gig_count
     FROM categories c
     LEFT JOIN gigs g ON g.category_id = c.id
     WHERE c.slug = $1
     GROUP BY c.id`,
    [slug]
  )
  if (!row) return null
  return {
    id:       row.id,
    name:     row.name,
    slug:     row.slug,
    iconName: row.icon_name,
    _count:   { gigs: Number(row.open_gig_count) },
  }
}
