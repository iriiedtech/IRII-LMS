import { razorpay } from '@/lib/razorpay';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { courseId, amount } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: `receipt_${courseId}_${user.id}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in Supabase
    await supabase.from('orders').insert({
      user_id: user.id,
      course_id: courseId,
      razorpay_order_id: order.id,
      amount: amount,
      status: 'pending',
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('RAZORPAY_ORDER_ERROR', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
