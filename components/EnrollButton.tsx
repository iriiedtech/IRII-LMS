"use client";

import { CheckCircle } from "lucide-react";
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
          body: JSON.stringify({ courseId, amount: price }),
        });

        const order = await response.json();

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: "LMS Platform",
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
            color: "#3399cc",
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
      <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Access Course</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
          ${
            isPending
              ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
              : "bg-blue-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-600/20"
          }
        `}
        disabled={isPending}
        onClick={handleEnroll}
      >
        <span>Enroll Now</span>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
          </div>
        )}
      </button>
    </>
  );
}

export default EnrollButton;
