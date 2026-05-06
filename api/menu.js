import supabase from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category');

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, price, category, description, image_url } = req.body;
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{ name, price, category, description, image_url }])
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}