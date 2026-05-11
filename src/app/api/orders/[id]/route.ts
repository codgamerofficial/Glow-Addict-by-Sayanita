import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderNumber } = await params;

    if (!orderNumber) {
      return NextResponse.json(
        { error: 'Order number is required' },
        { status: 400 }
      );
    }

    // Fetch order
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        total,
        created_at,
        shipping_address
      `)
      .eq('order_number', orderNumber)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Count order items separately for reliable typing and query parsing
    const { count: orderItemsCount } = await supabaseAdmin
      .from('order_items')
      .select('id', { count: 'exact', head: true })
      .eq('order_id', order.id);

    // Construct tracking steps based on status
    const statusSteps = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
    const currentStatusIndex = statusSteps.indexOf(order.status as string);
    
    const steps = statusSteps.map((status, index) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      done: index <= currentStatusIndex
    }));

    // Format response
    const response = {
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        itemsCount: orderItemsCount ?? 0,
        total: order.total,
        created_at: order.created_at,
        shipping_address: order.shipping_address
      },
      steps
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}