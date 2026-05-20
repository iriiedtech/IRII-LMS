import { razorpay } from '@/lib/razorpay';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(req: Request) {
  try {
    const { courseId, amount, couponCode } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let finalAmount = Number(amount);

    if (couponCode) {
      // Validate coupon code
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase().trim())
        .single();

      if (coupon) {
        const now = new Date();
        const isExpired = coupon.expiry_date ? new Date(coupon.expiry_date) < now : false;
        const isLimitReached = coupon.usage_limit ? coupon.used_count >= coupon.usage_limit : false;

        if (!isExpired && !isLimitReached) {
          if (coupon.discount_type === 'percentage') {
            finalAmount = finalAmount - (finalAmount * (Number(coupon.discount_value) / 100));
          } else if (coupon.discount_type === 'flat') {
            finalAmount = finalAmount - Number(coupon.discount_value);
          }
          if (finalAmount < 0) finalAmount = 0;
        }
      }
    }

    const options = {
      amount: Math.round(finalAmount * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: `rcpt_${courseId.slice(0, 8)}_${Date.now().toString().slice(-8)}`,
    };

    const order = await razorpay.orders.create(options);

    // Save order in Supabase
    await supabase.from('orders').insert({
      user_id: user.id,
      course_id: courseId,
      razorpay_order_id: order.id,
      amount: finalAmount,
      status: 'pending',
    });

    // If coupon was applied, record coupon usage (tentatively, we will finalize it upon payment verification)
    return NextResponse.json({
      ...order,
      discountedAmount: finalAmount
    });
  } catch (error) {
    console.error('RAZORPAY_ORDER_ERROR', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
