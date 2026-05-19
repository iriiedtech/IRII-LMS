/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CheckCircle, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import Script from "next/script";

function EnrollButton({
  courseId,
  isEnrolled,
  price,
  courseTitle,
}: {
  courseId: string;
  isEnrolled: boolean;
  price: number;
  courseTitle: string;
}) {
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoadingUser(false);
    };
    getUser();
  }, []);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    setCouponError("");
    setAppliedCoupon(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, amount: price }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon(data);
      } else {
        setCouponError(data.error || "Failed to apply coupon");
      }
    } catch {
      setCouponError("Network error validating coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch('/api/payments/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            courseId, 
            amount: price,
            couponCode: appliedCoupon ? appliedCoupon.code : null
          }),
        });

        const order = await response.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "IRII Finishing School",
          description: `Enrollment for ${courseTitle}`,
          order_id: order.id,
          handler: async function (response: any) {
            const verifyRes = await fetch('/api/payments/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.message === 'Success') {
              router.refresh();
              router.push(`/dashboard/courses/${courseId}`);
            }
          },
          prefill: {
            email: user.email,
          },
          theme: {
            color: "#004D61",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Error in handleEnroll:", error);
      }
    });
  };

  if (loadingUser || isPending) {
    return (
      <div className="w-full h-12 rounded-lg bg-muted flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-semibold bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Access Course</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Coupon Application Box */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="PROMO CODE"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            disabled={validatingCoupon}
            className="flex-1 border rounded-lg px-3 py-1.5 text-xs bg-background focus:outline-none focus:ring-1 focus:ring-primary uppercase"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={validatingCoupon || !couponInput.trim()}
            className="px-4 py-1.5 bg-primary text-primary-foreground font-semibold rounded-lg text-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {validatingCoupon ? "Applying..." : "Apply"}
          </button>
        </div>

        {appliedCoupon && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
            <Check className="h-3.5 w-3.5" />
            <span>Coupon applied! Saved ₹{appliedCoupon.discount}. Final price: ₹{appliedCoupon.finalAmount}</span>
          </div>
        )}

        {couponError && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{couponError}</span>
          </div>
        )}
      </div>

      <button
        className={`w-full rounded-lg px-6 py-3 font-semibold transition-all duration-300 ease-in-out relative h-12
          ${
            isPending
              ? "bg-muted text-muted-foreground cursor-not-allowed hover:scale-100"
              : "bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-lg hover:shadow-primary/20"
          }
        `}
        disabled={isPending}
        onClick={handleEnroll}
      >
        <span>Enroll Now {appliedCoupon ? `(₹${appliedCoupon.finalAmount})` : `(₹${price})`}</span>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
    </div>
  );
}

export default EnrollButton;
