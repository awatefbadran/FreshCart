import { Star } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="bg-green-50 rounded-3xl p-10 flex flex-col lg:flex-row gap-8 items-center">
        <div className="flex-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-linear-to-r from-[#00BC7D] to-[#00BBA7] w-14 h-14 flex items-center justify-center rounded-xl">
              <svg
                width="25"
                height="20"
                viewBox="0 0 25 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.375 2.5C3.33984 2.5 2.5 3.33984 2.5 4.375C2.5 4.96484 2.77734 5.51953 3.25 5.875L11.375 11.9688C12.043 12.4688 12.957 12.4688 13.625 11.9688L21.75 5.875C22.2227 5.51953 22.5 4.96484 22.5 4.375C22.5 3.33984 21.6602 2.5 20.625 2.5H4.375ZM2.5 7.65625V15C2.5 16.3789 3.62109 17.5 5 17.5H20C21.3789 17.5 22.5 16.3789 22.5 15V7.65625L14.75 13.4688C13.418 14.4688 11.582 14.4688 10.25 13.4688L2.5 7.65625Z"
                  fill="white"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-800">NEWSLETTER</p>
              <p className="text-gray-400 text-sm">50,000+ subscribers</p>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-3 leading-snug">
            Get the Freshest Updates{" "}
            <span className="text-green-600">Delivered Free</span>
          </h2>
          <p className="text-gray-500 mb-6">
            Weekly recipes, seasonal offers & exclusive member perks.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {[
              {
                emoji: (
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.5461 0.157063C12.6961 0.0140938 12.9141 -0.0374687 13.1156 0.0281563C13.3453 0.1055 13.5 0.321125 13.5 0.562531V4.943C13.5 8.018 10.9664 10.5 7.90313 10.5C6.09844 10.5 4.54219 9.33988 3.97734 7.718C3.14766 8.43987 2.625 9.50159 2.625 10.6875C2.625 10.9993 2.37422 11.25 2.0625 11.25C1.75078 11.25 1.5 10.9993 1.5 10.6875C1.5 8.93206 2.39531 7.38519 3.75234 6.47581C4.57969 5.92269 5.56641 5.62503 6.5625 5.62503H8.4375C8.74922 5.62503 9 5.37425 9 5.06253C9 4.75081 8.74922 4.50003 8.4375 4.50003H6.5625C5.63203 4.50003 4.75078 4.70628 3.96094 5.07425C4.50703 3.43363 6.05156 2.25003 7.875 2.25003C9.43125 2.25003 10.5891 1.73206 11.3602 1.21878C11.8102 0.918781 12.1922 0.560188 12.5484 0.157063H12.5461Z"
                      fill="#009966"
                    />
                  </svg>
                ),
                label: "Fresh Picks Weekly",
              },
              {
                emoji: (
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.75 2.25C0.75 1.42266 1.42266 0.75 2.25 0.75H9C9.82734 0.75 10.5 1.42266 10.5 2.25V3H11.6883C12.0867 3 12.4688 3.15703 12.75 3.43828L13.8117 4.5C14.093 4.78125 14.25 5.16328 14.25 5.56172V9C14.25 9.82734 13.5773 10.5 12.75 10.5H12.6727C12.4289 11.3648 11.632 12 10.6875 12C9.74297 12 8.94844 11.3648 8.70234 10.5H6.29766C6.05391 11.3648 5.25703 12 4.3125 12C3.36797 12 2.57344 11.3648 2.32734 10.5H2.25C1.42266 10.5 0.75 9.82734 0.75 9V2.25ZM12.75 6.75V5.56172L11.6883 4.5H10.5V6.75H12.75ZM5.25 9.9375C5.25 9.68886 5.15123 9.4504 4.97541 9.27459C4.7996 9.09877 4.56114 9 4.3125 9C4.06386 9 3.8254 9.09877 3.64959 9.27459C3.47377 9.4504 3.375 9.68886 3.375 9.9375C3.375 10.1861 3.47377 10.4246 3.64959 10.6004C3.8254 10.7762 4.06386 10.875 4.3125 10.875C4.56114 10.875 4.7996 10.7762 4.97541 10.6004C5.15123 10.4246 5.25 10.1861 5.25 9.9375ZM10.6875 10.875C10.9361 10.875 11.1746 10.7762 11.3504 10.6004C11.5262 10.4246 11.625 10.1861 11.625 9.9375C11.625 9.68886 11.5262 9.4504 11.3504 9.27459C11.1746 9.09877 10.9361 9 10.6875 9C10.4389 9 10.2004 9.09877 10.0246 9.27459C9.84877 9.4504 9.75 9.68886 9.75 9.9375C9.75 10.1861 9.84877 10.4246 10.0246 10.6004C10.2004 10.7762 10.4389 10.875 10.6875 10.875Z"
                      fill="#009966"
                    />
                  </svg>
                ),
                label: "Free Delivery Codes",
              },
              {
                emoji: (
                  <svg
                    width="15"
                    height="12"
                    viewBox="0 0 15 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.26172 2.25V5.75391C2.26172 6.15234 2.41875 6.53437 2.7 6.81562L7.2 11.3156C7.78594 11.9016 8.73516 11.9016 9.32109 11.3156L12.825 7.81172C13.4109 7.22578 13.4109 6.27656 12.825 5.69062L8.325 1.19062C8.04375 0.907031 7.66406 0.75 7.26563 0.75H3.76172C2.93438 0.75 2.26172 1.42266 2.26172 2.25ZM4.88672 2.625C5.08563 2.625 5.2764 2.70402 5.41705 2.84467C5.5577 2.98532 5.63672 3.17609 5.63672 3.375C5.63672 3.57391 5.5577 3.76468 5.41705 3.90533C5.2764 4.04598 5.08563 4.125 4.88672 4.125C4.68781 4.125 4.49704 4.04598 4.35639 3.90533C4.21574 3.76468 4.13672 3.57391 4.13672 3.375C4.13672 3.17609 4.21574 2.98532 4.35639 2.84467C4.49704 2.70402 4.68781 2.625 4.88672 2.625Z"
                      fill="#009966"
                    />
                  </svg>
                ),
                label: "Members-Only Deals",
              },
            ].map((tag, i) => (
              <span
                key={i}
                className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm"
              >
                <div className="p-2 bg-green-100 rounded-full">{tag.emoji}</div>{" "}
                {tag.label}
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-5 pr-5 py-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all text-base shadow-sm"
            />
            <button className="group cursor-pointer flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-[1.02]">
              Subscribe
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="svg-inline--fa fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"
              >
                <path
                  d="M15.493 7.61807C15.8348 7.27627 15.8348 6.72119 15.493 6.3794L11.118 2.00439C10.7762 1.6626 10.2211 1.6626 9.8793 2.00439C9.5375 2.34619 9.5375 2.90127 9.8793 3.24307L12.7613 6.1251H2.625C2.14102 6.1251 1.75 6.51611 1.75 7.0001C1.75 7.48408 2.14102 7.8751 2.625 7.8751H12.7613L9.8793 10.7571C9.5375 11.0989 9.5375 11.654 9.8793 11.9958C10.2211 12.3376 10.7762 12.3376 11.118 11.9958L15.493 7.6208V7.61807Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ✨ Unsubscribe anytime. No spam, ever.
          </p>
        </div>

        <div className="flex-1 bg-gray-900 relative rounded-2xl p-6 text-white self-stretch flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
          <div>
            <span className="inline-flex items-center gap-1.5 bg-green-600/20 text-green-400 text-xs px-3 py-1 rounded-full mb-5">
              📱 MOBILE APP
            </span>
            <h3 className="text-xl font-bold mb-2">Shop Faster on Our App</h3>
            <p className="text-gray-400 text-sm mb-6">
              Get app-exclusive deals & 15% off your first order.
            </p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer">
              <svg
                width="25"
                height="20"
                viewBox="0 0 25 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.4648 10.4961C17.457 9.0625 18.1055 7.98047 19.418 7.18359C18.6836 6.13281 17.5742 5.55469 16.1094 5.44141C14.7227 5.33203 13.207 6.25 12.6523 6.25C12.0664 6.25 10.7227 5.48047 9.66797 5.48047C7.48828 5.51562 5.17188 7.21875 5.17188 10.6836C5.17188 11.707 5.35937 12.7656 5.73438 13.8555C6.23438 15.2891 8.03906 18.8047 9.92188 18.7461C10.9062 18.7227 11.6016 18.0469 12.8828 18.0469C14.125 18.0469 14.7695 18.7461 15.8672 18.7461C17.7656 18.7188 19.3984 15.5234 19.875 14.0859C17.3281 12.8867 17.4648 10.5703 17.4648 10.4961ZM15.2539 4.08203C16.3203 2.81641 16.2227 1.66406 16.1914 1.25C15.25 1.30469 14.1602 1.89063 13.5391 2.61328C12.8555 3.38672 12.4531 4.34375 12.5391 5.42188C13.5586 5.5 14.4883 4.97656 15.2539 4.08203Z"
                  fill="white"
                />
              </svg>

              <div className="text-left">
                <p className="text-xs text-gray-400 leading-none mb-0.5">
                  DOWNLOAD ON
                </p>
                <p className="font-semibold text-sm leading-none">App Store</p>
              </div>
            </button>
            <button className="flex items-center gap-3 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/10 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] cursor-pointer">
              <svg
                width="19"
                height="20"
                viewBox="0 0 19 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7188 9.15234L3.09766 0.507812L14.0664 6.80469L11.7188 9.15234ZM0.847656 0C0.339844 0.265625 0 0.75 0 1.37891V18.6172C0 19.2461 0.339844 19.7305 0.847656 19.9961L10.8711 9.99609L0.847656 0ZM17.457 8.8125L15.1562 7.48047L12.5898 10L15.1562 12.5195L17.5039 11.1875C18.207 10.6289 18.207 9.37109 17.457 8.8125ZM3.09766 19.4922L14.0664 13.1953L11.7188 10.8477L3.09766 19.4922Z"
                  fill="white"
                />
              </svg>

              <div className="text-left">
                <p className="text-xs text-gray-400 leading-none mb-0.5">
                  GET IT ON
                </p>
                <p className="font-semibold text-sm leading-none">
                  Google Play
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-gray-700 pt-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>
            <span className="text-sm text-gray-300">4.9 · 100K+ downloads</span>
          </div>
        </div>
      </div>
    </section>
  );
}
