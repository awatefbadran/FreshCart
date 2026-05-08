"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/lib/schemas";
import { signIn } from "@/components/services/apiCall";
import { saveToken, getUserFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import { signIn as nextAuthSignIn } from "next-auth/react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginSchema) => {
    const result = await signIn({
      email: data.email,
      password: data.password,
    });

    if (result.message === "success") {
      saveToken(result.token);
      const user = getUserFromToken();
      refreshUser();
      toast.success(`Welcome back, ${user?.name}!`);
      router.push("/");
    } else {
      toast.error(result.message || "Invalid email or password");
    }
  };

  return (
    <>
      <section>
        <div className="container py-16 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="hidden lg:block">
              <div className="text-center space-y-6">
                <Image
                  src="/login.png"
                  alt="login"
                  className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  width={500}
                  height={500}
                ></Image>
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">
                    FreshCart - Your One-Stop Shop for Fresh Products
                  </h2>
                  <p className="text-lg text-gray-600">
                    Join thousands of happy customers who trust FreshCart for
                    their daily grocery needs
                  </p>
                  <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.875 2.625C0.875 1.65977 1.65977 0.875 2.625 0.875H10.5C11.4652 0.875 12.25 1.65977 12.25 2.625V3.5H13.6363C14.1012 3.5 14.5469 3.6832 14.875 4.01133L16.1137 5.25C16.4418 5.57812 16.625 6.02383 16.625 6.48867V10.5C16.625 11.4652 15.8402 12.25 14.875 12.25H14.7848C14.5004 13.259 13.5707 14 12.4688 14C11.3668 14 10.4398 13.259 10.1527 12.25H7.34727C7.06289 13.259 6.1332 14 5.03125 14C3.9293 14 3.00234 13.259 2.71523 12.25H2.625C1.65977 12.25 0.875 11.4652 0.875 10.5V2.625ZM14.875 7.875V6.48867L13.6363 5.25H12.25V7.875H14.875ZM6.125 11.5938C6.125 11.3037 6.00977 11.0255 5.80465 10.8204C5.59953 10.6152 5.32133 10.5 5.03125 10.5C4.74117 10.5 4.46297 10.6152 4.25785 10.8204C4.05273 11.0255 3.9375 11.3037 3.9375 11.5938C3.9375 11.8838 4.05273 12.162 4.25785 12.3671C4.46297 12.5723 4.74117 12.6875 5.03125 12.6875C5.32133 12.6875 5.59953 12.5723 5.80465 12.3671C6.00977 12.162 6.125 11.8838 6.125 11.5938ZM12.4688 12.6875C12.7588 12.6875 13.037 12.5723 13.2421 12.3671C13.4473 12.162 13.5625 11.8838 13.5625 11.5938C13.5625 11.3037 13.4473 11.0255 13.2421 10.8204C13.037 10.6152 12.7588 10.5 12.4688 10.5C12.1787 10.5 11.9005 10.6152 11.6954 10.8204C11.4902 11.0255 11.375 11.3037 11.375 11.5938C11.375 11.8838 11.4902 12.162 11.6954 12.3671C11.9005 12.5723 12.1787 12.6875 12.4688 12.6875Z"
                          fill="#16A34A"
                        />
                      </svg>
                      Free Delivery
                    </div>
                    <div className="flex items-center">
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.75021 0C8.87599 0 9.00177 0.0273438 9.11661 0.0792969L14.2682 2.26406C14.8697 2.51836 15.3182 3.11172 15.3154 3.82812C15.3018 6.54063 14.1861 11.5035 9.47482 13.7594C9.01818 13.9781 8.48771 13.9781 8.03107 13.7594C3.317 11.5035 2.20411 6.54063 2.19044 3.82812C2.18771 3.11172 2.63615 2.51836 3.23771 2.26406L8.38654 0.0792969C8.50138 0.0273438 8.62443 0 8.75021 0ZM8.75021 1.82656V12.1652C12.5236 10.3387 13.5381 6.2918 13.5627 3.86914L8.75021 1.8293V1.82656Z"
                          fill="#16A34A"
                        />
                      </svg>
                      Secure Payment
                    </div>
                    <div className="flex items-center">
                      <svg
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.75 0C10.6065 0 12.387 0.737498 13.6997 2.05025C15.0125 3.36301 15.75 5.14348 15.75 7C15.75 8.85652 15.0125 10.637 13.6997 11.9497C12.387 13.2625 10.6065 14 8.75 14C6.89348 14 5.11301 13.2625 3.80025 11.9497C2.4875 10.637 1.75 8.85652 1.75 7C1.75 5.14348 2.4875 3.36301 3.80025 2.05025C5.11301 0.737498 6.89348 0 8.75 0ZM8.09375 3.28125V7C8.09375 7.21875 8.20312 7.42383 8.38633 7.54688L11.0113 9.29688C11.3121 9.49922 11.7195 9.41719 11.9219 9.11367C12.1242 8.81016 12.0422 8.40547 11.7387 8.20312L9.40625 6.65V3.28125C9.40625 2.91758 9.11367 2.625 8.75 2.625C8.38633 2.625 8.09375 2.91758 8.09375 3.28125Z"
                          fill="#16A34A"
                        />
                      </svg>
                      24/7 Support
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-3xl font-bold text-green-600">
                      Fresh
                      <span className="text-gray-800">Cart</span>
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome Back!
                  </h1>
                  <p className="text-gray-600">
                    Sign in to continue your fresh shopping experience
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() =>
                      nextAuthSignIn("google", { callbackUrl: "/" })
                    }
                    className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.1562 8.92266C17.1562 13.8973 13.7496 17.4375 8.71875 17.4375C3.89531 17.4375 0 13.5422 0 8.71875C0 3.89531 3.89531 0 8.71875 0C11.0672 0 13.043 0.861328 14.5652 2.28164L12.1922 4.56328C9.08789 1.56797 3.31523 3.81797 3.31523 8.71875C3.31523 11.7598 5.74453 14.2242 8.71875 14.2242C12.1711 14.2242 13.4648 11.7492 13.6687 10.466H8.71875V7.46719H17.0191C17.1 7.91367 17.1562 8.34258 17.1562 8.92266Z"
                        fill="#FB2C36"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">
                      Continue with Google
                    </span>
                  </button>
                  <div
                    onClick={() =>
                      nextAuthSignIn("facebook", { callbackUrl: "/" })
                    }
                    className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
                  >
                    <svg
                      width="23"
                      height="18"
                      viewBox="0 0 23 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.25 9C20.25 4.02891 16.2211 0 11.25 0C6.27891 0 2.25 4.02891 2.25 9C2.25 13.2188 5.15742 16.7625 9.07734 17.7363V11.7492H7.22109V9H9.07734V7.81523C9.07734 4.75313 10.4625 3.33281 13.4719 3.33281C14.0414 3.33281 15.0258 3.44531 15.4301 3.55781V6.04688C15.2191 6.02578 14.85 6.01172 14.3895 6.01172C12.9129 6.01172 12.3434 6.5707 12.3434 8.02266V9H15.2824L14.7762 11.7492H12.3398V17.9332C16.7977 17.3953 20.25 13.602 20.25 9Z"
                        fill="#155DFC"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">
                      Continue with Facebook
                    </span>
                  </div>
                </div>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">
                      OR CONTINUE WITH EMAIL
                    </span>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <input
                          {...register("email")}
                          id="email"
                          placeholder="Enter your email"
                          type="email"
                          className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="svg-inline--fa fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          <path
                            d="M3.5 2C2.67188 2 2 2.67188 2 3.5C2 3.97187 2.22188 4.41562 2.6 4.7L9.1 9.575C9.63438 9.975 10.3656 9.975 10.9 9.575L17.4 4.7C17.7781 4.41562 18 3.97187 18 3.5C18 2.67188 17.3281 2 16.5 2H3.5ZM2 6.125V12C2 13.1031 2.89688 14 4 14H16C17.1031 14 18 13.1031 18 12V6.125L11.8 10.775C10.7344 11.575 9.26562 11.575 8.2 10.775L2 6.125Z"
                            fill="#99A1AF"
                          />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="password"
                          className="block text-sm font-semibold text-gray-700"
                        >
                          Password
                        </label>
                        <Link
                          href="/forgot-password"
                          className="text-sm cursor-pointer z-10 text-green-600 hover:text-green-700 font-medium"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          {...register("password")}
                          type="password"
                          className="w-full px-4 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                          id="password"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                          </p>
                        )}
                        <svg
                          width="20"
                          height="17"
                          viewBox="0 0 20 17"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="svg-inline--fa fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                          <path
                            d="M8 4V6H12V4C12 2.89687 11.1031 2 10 2C8.89687 2 8 2.89687 8 4ZM6 6V4C6 1.79063 7.79063 0 10 0C12.2094 0 14 1.79063 14 4V6C15.1031 6 16 6.89687 16 8V15C16 16.1031 15.1031 17 14 17H6C4.89688 17 4 16.1031 4 15V8C4 6.89687 4.89688 6 6 6Z"
                            fill="#99A1AF"
                          />
                        </svg>
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <svg
                            width="20"
                            height="16"
                            viewBox="0 0 20 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.0004 1C7.47539 1 5.45352 2.15 3.98164 3.51875C2.51914 4.87812 1.54102 6.5 1.07539 7.61562C0.972266 7.8625 0.972266 8.1375 1.07539 8.38437C1.54102 9.5 2.51914 11.125 3.98164 12.4812C5.45352 13.8469 7.47539 15 10.0004 15C12.5254 15 14.5473 13.85 16.0191 12.4812C17.4816 11.1219 18.4598 9.5 18.9254 8.38437C19.0285 8.1375 19.0285 7.8625 18.9254 7.61562C18.4598 6.5 17.4816 4.875 16.0191 3.51875C14.5473 2.15312 12.5254 1 10.0004 1ZM5.50039 8C5.50039 6.80653 5.9745 5.66193 6.81841 4.81802C7.66232 3.97411 8.80692 3.5 10.0004 3.5C11.1939 3.5 12.3385 3.97411 13.1824 4.81802C14.0263 5.66193 14.5004 6.80653 14.5004 8C14.5004 9.19347 14.0263 10.3381 13.1824 11.182C12.3385 12.0259 11.1939 12.5 10.0004 12.5C8.80692 12.5 7.66232 12.0259 6.81841 11.182C5.9745 10.3381 5.50039 9.19347 5.50039 8ZM10.0004 6C10.0004 7.10313 9.10352 8 8.00039 8C7.64102 8 7.30352 7.90625 7.00977 7.7375C6.97852 8.07812 7.00664 8.42812 7.10039 8.775C7.52852 10.375 9.17539 11.325 10.7754 10.8969C12.3754 10.4688 13.3254 8.82188 12.8973 7.22188C12.516 5.79375 11.1629 4.88438 9.73789 5.00938C9.90352 5.3 10.0004 5.6375 10.0004 6Z"
                              fill="#99A1AF"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="forget"
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          id="forget"
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer text-green-600 accent-green-600 border-2 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Keep me signed in
                        </span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className="w-full cursor-pointer bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
