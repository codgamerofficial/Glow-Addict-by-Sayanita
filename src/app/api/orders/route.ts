import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      items,
      subtotal,
      total,
      shippingFee,
      paymentMethod,
      codDepositAmount,
      transactionId,
      screenshotUrl,
      shippingAddress
    } = body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      );
    }

    if (!paymentMethod || !['upi', 'cod'].includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, error: 'Valid payment method is required' },
        { status: 400 }
      );
    }

    if (!shippingAddress) {
      return NextResponse.json(
        { success: false, error: 'Shipping address is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // For now, require authentication (can be extended for guest checkout later)
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Generate order number
    const orderNumber = `GA-${Math.floor(100000 + Math.random() * 900000)}`;

   // Determine payment status and order status based on method
   let paymentStatus = 'pending';
   let orderStatus: string = 'pending';

   if (paymentMethod === 'cod') {
     orderStatus = codDepositAmount ? 'cod_pending' : 'pending';
   } else {
     // UPI payment - awaiting verification
     orderStatus = 'pending_payment';
   }

   // Create the order
   const { data: order, error: orderError } = await supabase
     .from('orders')
     .insert({
       order_number: orderNumber,
       user_id: user.id,
       status: orderStatus,
       subtotal: subtotal,
       total: total,
       payment_method: paymentMethod,
       payment_status: paymentStatus,
      cod_deposit_amount: codDepositAmount || 0,
       transaction_id: transactionId || null,
       screenshot_url: screenshotUrl || null,
       shipping_fee: shippingFee,
       tax: 0,
       shipping_address: shippingAddress,
     })
     .select()
     .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return NextResponse.json(
        { success: false, error: orderError.message },
        { status: 500 }
      );
    }

    // Create order items
   const orderItems = items.map((item: {
     id: string;
     product: {
       id: string;
       name: string;
       images: string[];
       price: number;
       salePrice?: number;
     };
     quantity: number;
   }) => ({
     order_id: order.id,
     product_id: item.product.id,
     product_name: item.product.name,
     product_image: item.product.images[0] || '',
     quantity: item.quantity,
     price: item.product.salePrice || item.product.price,
     total: (item.product.salePrice || item.product.price) * item.quantity,
   }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items creation error:', itemsError);
      // Note: In production, you'd want to rollback the order here
      return NextResponse.json(
        { success: false, error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderNumber,
      order: order
    });
  } catch (err) {
    console.error('Order creation failed:', err);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
