import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

type TrendRow = {
  query: string;
  search_count: number;
  last_results_count: number;
  intent: string | null;
  top_product_id: string | null;
};

type RecoveryTaskRow = {
  id: string;
  query: string;
  intent: string | null;
  status: 'open' | 'in_progress' | 'resolved' | 'ignored';
  demand_hits: number;
  suggested_product_ids: string[] | null;
  notes: string | null;
  updated_at: string;
};

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: trends, error } = await supabase
      .from('search_trends')
      .select('query,search_count,last_results_count,intent,top_product_id')
      .order('search_count', { ascending: false })
      .limit(200);

    if (error) {
      throw error;
    }

    const { data: recoveryTasks } = await supabase
      .from('search_recovery_tasks')
      .select('id,query,intent,status,demand_hits,suggested_product_ids,notes,updated_at')
      .in('status', ['open', 'in_progress'])
      .order('demand_hits', { ascending: false })
      .limit(12);

    const productIds = Array.from(
      new Set(
        ((recoveryTasks || []) as RecoveryTaskRow[])
          .flatMap((task) => (Array.isArray(task.suggested_product_ids) ? task.suggested_product_ids : []))
          .filter(Boolean),
      ),
    );

    const { data: suggestedProducts } = productIds.length > 0
      ? await supabase
          .from('products')
          .select('id,name,slug,brand_name,category_name,sale_price,price,images')
          .in('id', productIds)
      : { data: [] as Array<{ id: string; name: string; slug: string; brand_name: string; category_name: string; sale_price: number | null; price: number; images: string[] | null }> };

    const productMap = new Map(
      (suggestedProducts || []).map((product) => [
        product.id,
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          brandName: product.brand_name,
          categoryName: product.category_name,
          price: Number(product.sale_price || product.price || 0),
          image: Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null,
        },
      ]),
    );

    const rows = (trends || []) as TrendRow[];
    const totalSearches = rows.reduce((sum, row) => sum + Number(row.search_count || 0), 0);
    const weightedResults = rows.reduce((sum, row) => sum + Number(row.search_count || 0) * Number(row.last_results_count || 0), 0);
    const avgResults = totalSearches > 0 ? weightedResults / totalSearches : 0;
    const zeroResultSearches = rows
      .filter((row) => Number(row.last_results_count || 0) === 0)
      .reduce((sum, row) => sum + Number(row.search_count || 0), 0);

    const intentMap = rows.reduce<Record<string, number>>((acc, row) => {
      const intent = row.intent || 'general';
      acc[intent] = (acc[intent] || 0) + Number(row.search_count || 0);
      return acc;
    }, {});

    const intentDistribution = Object.entries(intentMap)
      .map(([intent, count]) => ({ intent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const topQueries = rows.slice(0, 10).map((row) => ({
      query: row.query,
      searches: Number(row.search_count || 0),
      results: Number(row.last_results_count || 0),
      intent: row.intent || 'general',
    }));

    const noResultQueries = rows
      .filter((row) => Number(row.last_results_count || 0) === 0)
      .slice(0, 8)
      .map((row) => ({ query: row.query, searches: Number(row.search_count || 0) }));

    const recoveryQueue = ((recoveryTasks || []) as RecoveryTaskRow[]).map((task) => ({
      id: task.id,
      query: task.query,
      intent: task.intent || 'general',
      status: task.status,
      demandHits: Number(task.demand_hits || 0),
      suggestionsCount: Array.isArray(task.suggested_product_ids) ? task.suggested_product_ids.length : 0,
      notes: task.notes || '',
      suggestedProducts: (task.suggested_product_ids || [])
        .map((productId) => productMap.get(productId))
        .filter(Boolean)
        .slice(0, 4),
      updatedAt: task.updated_at,
    }));

    return NextResponse.json({
      totalSearches,
      avgResults: Number(avgResults.toFixed(2)),
      zeroResultSearches,
      zeroResultRate: totalSearches > 0 ? Number(((zeroResultSearches / totalSearches) * 100).toFixed(2)) : 0,
      topQueries,
      noResultQueries,
      intentDistribution,
      recoveryQueue,
    });
  } catch {
    return NextResponse.json(
      {
        totalSearches: 0,
        avgResults: 0,
        zeroResultSearches: 0,
        zeroResultRate: 0,
        topQueries: [],
        noResultQueries: [],
        intentDistribution: [],
        recoveryQueue: [],
      },
      { status: 200 },
    );
  }
}
