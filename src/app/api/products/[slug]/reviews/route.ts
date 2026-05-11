import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@supabase/ssr';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get product by slug to get product_id
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (productError) throw productError;
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Fetch reviews for the product
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false });

    if (reviewsError) throw reviewsError;

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get user from auth (implementation depends on your auth strategy)
    // This is a placeholder - replace with your actual auth method
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rating, title, body, skinType } = await request.json();

    // Validate input
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
        { status: 400 }
      );
    }
    if (!body || typeof body !== 'string') {
      return NextResponse.json(
        { error: 'Body is required and must be a string' },
        { status: 400 }
      );
    }

    // Get product by slug
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, rating_avg, rating_count')
      .eq('slug', slug)
      .single();

    if (productError) throw productError;
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Optional: Verify user purchased the product (skip for now as per instructions)

    const userName =
      (user.user_metadata?.name as string | undefined) ||
      user.email ||
      'Anonymous';
    const userAvatar = (user.user_metadata?.avatar_url as string | undefined) || null;

    // Insert review
    const { data: review, error: reviewError } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id: product.id,
        user_id: user.id,
        user_name: userName,
        user_avatar: userAvatar,
        rating,
        title,
        body,
        skin_type: skinType || null,
      })
      .select()
      .single();

    if (reviewError) throw reviewError;

    // Update product's rating_avg and rating_count
    const currentRatingCount = Number(product.rating_count ?? 0);
    const currentRatingAvg = Number(product.rating_avg ?? 0);
    const newRatingCount = currentRatingCount + 1;
    const newRatingAvg =
      (currentRatingAvg * currentRatingCount + rating) / newRatingCount;

    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({
        rating_avg: newRatingAvg,
        rating_count: newRatingCount,
      })
      .eq('id', product.id);

    if (updateError) throw updateError;

    // Revalidate the product page
    revalidatePath(`/products/${slug}`);

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserFromRequest(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and anon key are required');
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (name) => request.cookies.get(name)?.value,
      set: () => {
        throw new Error('Setting cookies is not supported in this context');
      },
      remove: () => {
        throw new Error('Removing cookies is not supported in this context');
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}